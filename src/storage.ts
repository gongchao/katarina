import bluebird from 'bluebird';
import redis from 'redis';

const isDev: boolean = process.env.NODE_ENV !== 'production';

/**
 * 转换 Redis Api 成 Promise 方式
 */
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

console.log(isDev);

/**
 * Storage
 */
let config: any = {
    port: 6379,
};

if (!isDev) {
    config.host = '';
    config.password = '';
}

const Storage: any = redis.createClient(config);

export default Storage;
