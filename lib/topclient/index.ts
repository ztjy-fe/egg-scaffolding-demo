import TopClient from 'szy-ali-topclient';
import { EggApplication } from 'egg';

declare module 'egg' {
    export interface EggApplication {
        TopClient: any;
    }
}

export default (app: EggApplication) => {
    const client = new TopClient({
        'appkey': app.config.topClient.appKey,
        'appsecret': app.config.topClient.appSecret,
        'REST_URL': app.config.topClient.restUri
    });

    app.TopClient = client;
}