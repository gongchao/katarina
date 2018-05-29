import bluebird from 'bluebird';
import redis from 'redis';
import config from './config';

/**
 * 转换 Redis Api 成 Promise 方式
 */
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const Storage: any = redis.createClient(config.redis);

export default Storage;
