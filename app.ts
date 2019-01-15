import { EggApplication } from 'egg';
import TopClient from './lib/topclient'

export default async (app: EggApplication) => {
    TopClient(app);
}