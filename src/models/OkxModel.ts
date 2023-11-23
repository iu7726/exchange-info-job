import DelayApiModel from "./classes/DelayApiModel";
import { computeHmac, fromBase64Url } from "../util/Fernet";
import CryptoJS from "crypto-js"
import * as crypto from "crypto"

export default class OkxModel extends DelayApiModel {
    async getHeader(access: string, secret: string, passphrase:string, path:string) {
        const timestamp = new Date().toISOString();
        
        const input = `${timestamp}${path}`
        
        const sign = crypto.createHmac('SHA256', Buffer.from(secret))
        .update(Buffer.from(input))
        .digest('base64')

        return {
            'OK-ACCESS-KEY': access,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': passphrase,
            'x-simulated-trading': '0'
        }
    }

    async getBalance(access: string, secret: string, passphrase: string) {
        const url = `https://www.okx.com/api/v5/account/balance`;

        try {
            const header = await this.getHeader(access, secret, passphrase, 'GET/api/v5/account/balance')
            
            const response = await this.GET<any>(url,0, header);

            if (response) {

                return response;

            }

        } catch (e) {
            console.log('E', e);
        }

        return undefined;
    }


    async getRebate(beginTime: string, page: number = 1) {

        let url = `/api/v5/broker/nd/rebate-daily`

        if (beginTime != '0') {
            url += `?beginTime=${beginTime}`
        }

        if (page > 1) {
            url += `&page=${page}`
        }

        try {
            const header = await this.getHeader(
                String(process.env.OKEX_BROKER_KEY), 
                String(process.env.OKEX_BROKER_SECRET_KEY), 
                String(process.env.OKEX_BROKER_PASSPHRASE), 
                `GET${url}`
            )
            url = 'https://www.okx.com' + url

            const response = await this.GET<RebateResponse>(url,10000, header);

            if (response) {

                return response;

            }

        } catch (e) {
            console.log('E', e);
        }

        return undefined;
    }

    async getBills(access: string, secret: string, passphrase: string, billId: string | undefined) {
        let url = `/api/v5/account/bills-archive?type=2`;

        if (billId) {
            url += `&before=${billId}`
        }

        try {
            const header = await this.getHeader(access, secret, passphrase, `GET${url}`)
            url = 'https://www.okx.com' + url

            const response = await this.GET<BillResponse>(url,0, header);

            if (response) {

                return response;

            }

        } catch (e) {
            console.log('E', e);
        }

        return undefined;
    }

    async getInstruments() {
        try {
            let url = 'https://www.okx.com/api/v5/public/instruments?instType=SWAP'

            const response = await this.GET<any>(url)

            if (response) {

                return response;

            }
        } catch (e) {
            console.log("E", e)
        }

    }
}