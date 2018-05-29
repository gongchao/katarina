type configObject = { [key: string]: any };

type config = {
    redis: configObject,

    email: {
        emailAddress: string,

        sender: configObject,
    },

    proxyURL: string,
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config: config = require(`./config.${process.env.NODE_ENV}`).default;

export default config;
