import {createTransport} from 'nodemailer';
import getSocketProxy from "../../socket";
import {createSendMailTemplate} from "../template";
import config from '../../config';

type Candidate = {
    name: string,
    github: string,
    email: string,
};


const sendEmail = () => {

    const transporter = createTransport(config.email.smtpConfig);

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

    return (candidate: Candidate) => {
        return new Promise((resolve, reject) => {
            transporter.sendMail(createSendMailTemplate(candidate.email, candidate.name), (err, info) => {
                (<any> process).send(`给[${candidate.github}]发送邮件 错误状态: ${JSON.stringify(err)}`);

                if (err) return reject(err);

                return resolve(info);
            });
        });
    }
};

export default sendEmail;
