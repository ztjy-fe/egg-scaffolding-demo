import { Service } from 'egg';

/**
 * HomeService Service
 */
export default class HomeService extends Service {
    public async list() {
        const { app } = this;
        let result = null;
        let startTime = +new Date()
        try {
            result = await app.TopClient.execute('taobao.tbk.uatm.favorites.item.get', {
                'platform': '2',
                'page_size': '20',
                'adzone_id': '82910600295',
                'unid': '3456',
                'favorites_id': '19054815',
                'page_no': '1',
                'fields': 'click_url,coupon_click_url,num_iid,title,pict_url,small_images,user_type,volume,zk_final_price_wap,tk_rate,status,type,coupon_end_time,coupon_start_time,coupon_info,coupon_remain_count'
            });
            let endTime = +new Date()
            app.logger.info(`time count: ${endTime - startTime}ms`)
        } catch (err) {
            app.logger.info(`error: ${err}`);
        }

        return result;
    }
}
