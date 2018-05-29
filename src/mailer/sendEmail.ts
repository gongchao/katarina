import {createTransport} from 'nodemailer';
import config from '../config';
import {createSendMailTemplate} from './template';
import Storage from '../storage';
import getSocketProxy, {shiftPool} from '../socket';

type Candidate = {
    name: string,
    github: string,
    email: string,
};

// const sleep = (time: number): Promise<void> => new Promise(resolve => {
//     setTimeout(() => resolve(), time);
// });

const transporter = createTransport(config.email.sender);

if (config.proxyURL) {
    (transporter as any).getSocket = function (options: any, callback: any): void {
        getSocketProxy(options).then((socket: any) => {
            callback(null, {
                connection: socket,
                tls: {
                    rejectUnauthorized: true,
                }
            });
        }).catch(err => callback(err));
    };
}

const sendEmailHelper = (candidate: Candidate) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(createSendMailTemplate(candidate.email, candidate.name), (err, info) => {
            (<any> process).send(`给[${candidate.github}]发送邮件 错误状态: ${JSON.stringify(err)}`);

            if (err) return reject(err);

            return resolve(info);
        });
    });
};

const sendEmail = async () => {
    try {
        Storage.RPOP('candidates:send:queue', async (err: Error, candidateStr: string) => {
            if (err) return;

            if (candidateStr) {
                try {
                    const candidate: Candidate = JSON.parse(candidateStr);

                    await sendEmailHelper(candidate).catch(async () => {

                        // shift proxy pool
                        if (config.proxyURL) shiftPool();

                        await Storage.LPUSHAsync('candidates:send:queue', candidateStr);
                    });
                } catch (e) {
                    // 什么也不做
                }
            }

            await sendEmail();
        });

    } catch (error) {
        await sendEmail();

        (<any> process).send(error);
    }
    return;
};

process.on('message', data => {
    if (data.type === 'start') {
        (<any> process).send(`节点${data.data}启动成功`);

        sendEmail().then();
    }
});

