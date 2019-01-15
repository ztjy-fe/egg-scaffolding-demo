import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1547451863297_7269';

    // add your egg config in here
    config.middleware = [];

    config.view = {
        mapping: {
            '.nj': 'nunjucks'
        },
        defaultViewEngine: 'nunjucks',
        defaultExtension: '.nj'
    }


    config.static = {
        prefix: '/public/'
    };

    config.topClient = {
        appKey: '25033438',
        appSecret: '4c317c3ab3a5c92de75b679f286752ec',
        restUri: 'https://eco.taobao.com/router/rest'
    }

    // the return config will combines to EggAppConfig
    return {
        ...config
    };
};
