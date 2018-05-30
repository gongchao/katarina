import request from 'request';
import config from '../../config';
import {createSendMailTemplate} from '../template';

type Candidate = {
    name: string,
    github: string,
    email: string,
};

const sendEmail = () => {
    return (candidate: Candidate) => {
        return new Promise((resolve, reject) => {
            if (!config.email.httpConfig || !config.email.httpConfig.url) {
                return new Error('缺少 http 发送 url');
            }

            request({
                method: 'POST',
                uri: config.email.httpConfig.url,
                body: {
                    ...config.email.httpConfig,
                    from: config.email.emailAddress,
                    reply: config.email.replyAddress || null,
                    ...createSendMailTemplate(candidate.email, candidate.name),
                },
                json: true,
            }, (err, { body }) => {
                if (err) return reject(err);

                (<any> process).send(`给[${candidate.github}]发送邮件 发送 ${body.status === 'success' ? '成功' : JSON.stringify(body)}`);

                return resolve(body);
            });
        })
    }
};

export default sendEmail;
