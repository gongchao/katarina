export default {
    redis: {
        port: 6379,
        host: '127.0.0.1'
    },

    email: {
        emailAddress: '',

        sender: {
            host: 'smtp.exmail.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: '',
                pass: '',
            },
        }
    },

    proxyURL: ''
}
