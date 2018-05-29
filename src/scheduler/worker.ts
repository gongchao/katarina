///<reference path="../../node_modules/@types/node/index.d.ts"/>
import request from 'request-promise';
import cheerio from 'cheerio';
import Storage from '../storage';

type Candidate = {
    name: string,
    github: string,
};

/**
 * 获取候选人
 * @param {string} candidateGithub
 * @param {number} page
 * @return {Promise<void>}
 */
const getCandidates = async (candidateGithub: string, page: number = 1): Promise<void> => {
    try {
        const url: string = `https://github.com/${candidateGithub}?page=1&tab=following&page=${page}`;

        // 通知 master 当前进度
        if (process.send) {
            process.send({
                candidateGithub, page
            });
        }

        const body: string = await request(url, { timeout: 10000 });

        const $: CheerioStatic = cheerio.load(body);

        /**
         * 获取 Followings
         */
        const followings = $('#js-pjax-container > div > div.col-9.float-left.pl-2 > div.position-relative .d-table');
        followings.each( (_, node) => {

            /**
             * 如果候选人地区是 北京，那么将他存入 Redis Storage 中
             */
            if (/beijing|北京/i.test($(node).html() || '')) {
                const candidate: Candidate = {
                    name: $(node).find('.f4').text(),
                    github: $(node).find('.d-inline-block').attr('href').replace('/', '') || '',
                };

                Storage.SISMEMBER('candidates:github', candidate.github, async (err: Error, reply: string) => {
                    if (err || reply) return;

                    await Storage.SADDAsync('candidates:github', candidate.github);

                    await Storage.LPUSHAsync('candidates:query:queue', JSON.stringify(candidate));

                    await Storage.LPUSHAsync('candidates:exec:queue', JSON.stringify(candidate));
                });
            }
        });

        /**
         * 当存在下一页时，递归调用
         */
        const nextPaginationHref: string | undefined = $('#js-pjax-container > div > div.col-9.float-left.pl-2 > div.position-relative > div.paginate-container > div > a:nth-child(2)').attr('href');
        if (!nextPaginationHref) {
            return;
        }

        await getCandidates(candidateGithub, ++page);
    } catch (err) {
        console.log(err);
    }
};

/**
 * Run worker
 * @param {string} startGithub
 * @return {Promise<void>}
 */
const runWorker = async (startGithub?: string): Promise<any> => {
    if (startGithub) {
        return await getCandidates(startGithub, 1);
    }

    Storage.RPOP('candidates:query:queue', async (err: Error, candidateStr: string) => {
        if (err) return;

        const candidate: Candidate = JSON.parse(candidateStr);
        if (!candidate) {
            return;
        }

        await getCandidates(candidate.github, 1);

        return await runWorker();
    });
};

process.on('message', data => {
    if (data.type === 'start') {
        runWorker().then(() => (<any> process).send(`节点${data.data}启动成功`))
    }
});

export default runWorker;
