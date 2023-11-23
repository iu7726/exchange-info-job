import { Job, JobRequest, JobResult } from "libs-job-manager";
import { ModelManager, useModel } from "../models";
import { logger } from "../util/Logger";
import moment from "moment";
import BigNumber from "bignumber.js";
import { decrypt } from "../util/Fernet";

export interface BillsJobRequest extends JobRequest { }

export interface BillsJobResult extends JobResult { }

export class BillsJob extends Job<any, BillsJobResult> {
  constructor(jobRequest: BillsJobRequest, private readonly model: ModelManager) {
    super(jobRequest);
  }

  async execute(): Promise<BillsJobResult> {
    try {
      console.log("Bills Job Start ", moment().format('YYYY-MM-DD HH:mm:ss'))
      const count = (await this.model.balanceModel.getAccountCount() ?? 0) / 500;
      console.log(count)

      for (let i = 0; i < count; i++) {
        console.log('count', i)
        const users = await this.model.balanceModel.getAccounts(i)
        
        for (let j = 0; j < users.length; j++) {
          const user = users[j]
          
          const access = await this.model.kmsModel.decrypt(user.wallet_key)
          const secret = await this.model.kmsModel.decrypt(user.wallet_secret)
          const passphrase = await decrypt(user.tag, String(process.env.FERNET_KEY))

          if ( ! access || ! secret) {
            continue;
          }

          const billId = await this.model.bill.getLastBill(user.id)

          const result = await this.model.apiModel.getBills(access, secret, passphrase, billId)

          if ( ! result) continue;
          
          if (result.code == '0') {
            const insertObj: CreateBill[] = [];
            for (let k = 0; k < result.data.length; k++) {
              const data = result.data[k]
              
              // if (data.fee == '0') continue;

              let volume = (new BigNumber(data.sz))

              if (data.instType == 'SWAP') {
                const inst = await this.model.instrument.getInstrument(data.instId)
              
                volume = (new BigNumber(inst.ctVal)).multipliedBy(new BigNumber(data.px)).multipliedBy(new BigNumber(data.sz))
              } else {
                if (data.ccy != 'USDT') {
                  volume = volume.multipliedBy(data.px);
                }
                
                const instAry = data.instId.split('-')
                let ccy = instAry[1]
  
                if (ccy != 'USDT') {
                  const redisRes = await this.model.redis.HGET('$USDT:price$', ccy)
                  volume = (new BigNumber((JSON.parse(redisRes ?? '{}')).price)).multipliedBy(volume)
                }
              }

              this.model.bill.createBill({
                id: data.billId,
                accountId: user.id,
                userId: user.user_id,
                volume: volume.toString(),
                ccy: data.ccy,
                fee: data.fee,
                fillIdxPx: data.fillIdxPx,
                fillTime: data.fillTime,
                instId: data.instId,
                instType: data.instType,
                ordId: data.ordId,
                px: data.px,
                subType: data.subType,
                sz: data.sz,
                tradeId: data.tradeId,
                ts: data.ts,
                raw: JSON.stringify(data)
              })
            }

            // if (insertObj.length > 0) {
            //   const result = await this.model.bill.createBill(insertObj)
              
            // } else {
            //   console.log('Not Insert')
            // }
            
          } else {
            console.log(result)
          }

          console.log(`pack: ${i + 1} / ${Math.floor(count + 1)} ... User: ${(j/users.length*100).toFixed(2)}%`)
        }
        
        
      }
      console.log('Bill Job End');
      return {
        success: true,
      };
    } catch (err) {
      logger.log("[Bill Job]", err);
      return {
        success: false,
      };
    }
  }
}
