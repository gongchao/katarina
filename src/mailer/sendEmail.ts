import config from '../config';
import Storage from '../storage';
import {shiftPool} from '../socket';
import * as Transport from './transports';

type Candidate = {
    name: string,
    github: string,
    email: string,
};

function sendEmailHelper(candidate: Candidate) {
    return (<any> Transport)[config.email.transport || 'smtp']()(candidate);
}

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

