import config from '../config';

const createContentTEXT = (name: string): string => `
dear ${name}:

    我是 Moka 技术研发部 的 巩超（ https://github.com/gongchao ），很高兴在 github 上发现你，我们部门现在招 中/高级 前后端，与您很匹配。

    目前我们的部门负责 Moka 招聘系统系统全链路各类产品，非常希望您能加入我们！期待您的回复~

    下边是我公司的一些介绍，如果您有意可以将简历发送到 gongchao@mokahr.com 进行内推

公司描述:

    Moka 是一个智能化的招聘 CRM （ http://mokahr.com ），帮助公司管理并持续优化招聘，将招聘变成自身的竞争优势。

    我们相信：
    
    - 人才是公司最重要的资产，而招聘是打造优秀团队的重中之重。 
   
    - 占据生命 1/3 时间的工作需要有好用高效的工具辅助，提高生产力。而老旧臃肿的企业软件必将被以用户为中心的新兴产品替代掉。
    
    - 未来的企业决策会越来越数据驱动，而企业服务则会更加注重数据以及智能化。
    
    我们用短短 2 年的时间从 0 发展为 70 余人的团队，并完成了来自金沙江、GGV、峰瑞等顶级 VC 的 3 轮融资，最重要的是产品上也收获了小米、金山云、快手、YY、陌陌、新东方、等数百家知名付费客户的支持。


Moka 的团队:

    创始团队来自硅谷，毕业于伯克利、斯坦福计算机专业，之前在 Facebook，Turo，SignalFx 等公司从事技术产品相关工作。团队成员来自百度、阿里、头条、360、北大、清华等地。 我们的特点

    •	认为 simplicity leads to reliable and maintainable software。无论代码设计、技术选型、架构搭建上我们都崇尚简洁。
    
    •	技术氛围浓厚，鼓励大家分享学习。不定 topic 的技术分享，从前端框架到程序语言再到自动化测试都有涵盖。
    
    •	重视代码质量，相信软件开发不是 sprint 而是 marathon。代码以 PR 方式提交，并会经过严格的 code review。
    
    •	善于利用工具，不做重复性的工作。我们用 github 管理代码，bearychat 沟通，jira 做任务管理，sentry 做 bug 监控，jenkins 做持续集成等等。


在招岗位:

    【中/高级 后端工程师】
    
    岗位要求:
    
    1. 丰富的后端开发经验，了解 Node.js ， 精通以下语言的一种或多种：Node.js ，Python，Ruby，PHP，Java，Golang, C/C++
    
    2. 熟练掌握 web 应用服务器端技术，熟知网络相关知识和数据库(RDBMS, NoSQL)
    
    3. 熟悉一些其他的后端基础知识，如缓存、OS、消息队列、容器技术等
    
    4. 聪明，自信，善于分析和解决问题，优秀的学习能力，热爱技术
    
    
    【中/高级 前端工程师】
    
    岗位要求:
    
    1. 丰富的 web 开发经验，JS 烂熟于胸，HTML/CSS 手到擒来 
    
    2. 熟悉一种 web 框架，如 React + Flux, Angular.js, Backbone.js, Ember.js 等
    
    3. 有较好的计算机基础知识积累，了解服务器端开发技术
    
    4. 聪明，自信，善于分析和解决问题，优秀的学习能力，热爱技术
    
    加分项：
    
    1. 开源爱好者 /贡献者或喜欢业余时间做些有趣的 side project
    
    2. 有复杂项目的前端架构设计经验
    
    3. 熟悉 React + Redux
    
    4. 熟悉 NodeJS
`;

export const createSendMailTemplate = (to: string, toName: string) => (
    {
        from: config.email.emailAddress,
        subject: '【Moka面试邀约】' + toName,
        text: createContentTEXT(toName),
        to,
    }
);
