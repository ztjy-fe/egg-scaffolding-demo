import { Controller } from 'egg';

export default class HomeController extends Controller {
    public async index() {
        const { ctx } = this;
        const data = await ctx.service.home.list();
        await ctx.render('home.nj', data);
        //ctx.body = await ctx.renderString(JSON.stringify(data));
    }
}
