import request from 'request-promise';
import cheerio from 'cheerio';
import Storage from '../storage';

type Candidate = {
    name: string,
    github: string,
    email?: string,
};

/**
 * 默认初始 Cookie 值
 * @type {string[]}
 */
let cookie: string[] = [];

const getCandidateEmail = async (): Promise<void> => {
    try {
        Storage.RPOP('candidates:exec:queue', async (err: Error, candidateStr: string) => {
            if (err || !candidateStr) return;

            const candidate: Candidate = JSON.parse(candidateStr);

            const url = `https://github.com/${candidate.github}`;
            const response = await request({
                url,
                headers: {
                    cookie: cookie.join(';'),
                },
                resolveWithFullResponse: true,
            });

            cookie = response.headers['set-cookie'];

            const $: CheerioStatic = cheerio.load(response.body);

            candidate.email = $('.u-email').text() || '';

            console.log(candidate);

            if (candidate.email) {
                await Storage.LPUSHAsync('candidates:send:queue', JSON.stringify(candidate));
            }

            await getCandidateEmail();
        });
    } catch (err) {
        console.log(err);
    }
};

/**
 * exec
 */
getCandidateEmail().then(async () => {
    return await getCandidateEmail();
});
