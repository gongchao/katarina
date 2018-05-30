type configObject = { [key: string]: any };

type httpConfig = {
    url: string,
    appId: string,
    [key: string]: any,
};

type config = {
    redis: configObject,

    email: {
        transport?: 'smtp' | 'http',

        emailAddress: string,
        replyAddress?: string,

        httpConfig?: httpConfig,

        smtpConfig?: configObject,
    },

    proxyURL: string,
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config: config = require(`./config.${process.env.NODE_ENV}`).default;

export default config;
