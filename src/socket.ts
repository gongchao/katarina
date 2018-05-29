import {SocksClient} from 'socks';
import request from 'request-promise';
import config from './config';

type Proxy = {
    ip: string,
    port: string,
};

const pool: Proxy[] = [];

const fetchProxy = async (): Promise<Proxy | null> => {
    try {
        if (!pool.length) {
            const body = await request(config.proxyURL);
            JSON.parse(body).data.forEach((proxy: Proxy) => {
                pool.push(proxy);
            });
        }

        return pool[0] || null;
    } catch (e) {
        return await fetchProxy();
    }
};

export const shiftPool = () => pool.shift();

const getSocketProxy = (options: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const proxy: Proxy | null = await fetchProxy();

        if (!proxy) {
            return reject(new Error('无代理'));
        }

        const proxyOptions: any = {
            proxy: {
                ipaddress: proxy.ip,
                port: Number(proxy.port),
                type: 5
            },
            destination: {
                host: options.host,
                port: Number(options.port)
            },
            command: 'connect'
        };

        SocksClient.createConnection(proxyOptions, (err: Error, info: any) => {
            if (err) {
                shiftPool();

                return reject(err);
            }

            resolve(info.socket);
        });
    });
};

export default getSocketProxy;
