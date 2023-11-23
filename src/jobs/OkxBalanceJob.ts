import { Job, JobRequest, JobResult } from "libs-job-manager";
import { ModelManager, useModel } from "../models";
import { logger } from "../util/Logger";
import moment from "moment";
import axios from "axios";
import { decrypt } from "../util/Fernet";
import fs from "fs"
import info from "../seed/exchange-info.json"

export interface BalanceJobRequest extends JobRequest { }

export interface BalanceJobResult extends JobResult { }

export class OkxBalanceJob extends Job<any, BalanceJobResult> {
  constructor(jobRequest: BalanceJobRequest, private readonly model: ModelManager) {
    super(jobRequest);
  }

  async execute(): Promise<BalanceJobResult> {
    try {
      console.log("Balance Job Start ", moment().format('YYYY-MM-DD HH:mm:ss'))
      const count = (await this.model.balanceModel.getAccountCount() ?? 0) / 500;
      console.log(count)

      for (let i = 0; i < count; i++) {
        const users = await this.model.balanceModel.getAccounts(i)

        const insertObj: CreateBalance[] = [];
        for (let j = 0; j < users.length; j++) {
          const user = users[j]

          const access = await this.model.kmsModel.decrypt(user.wallet_key)
          const secret = await this.model.kmsModel.decrypt(user.wallet_secret)
          const passphrase = await decrypt(user.tag, String(process.env.FERNET_KEY))

          if (!access || !secret) {
            continue;
          }
          const result = await this.model.apiModel.getBalance(access, secret, passphrase)

          if (!result) continue;

          if (result.code == '0') {
            const data = result.data[0];

            insertObj.push({
              account_id: user.id,
              user_id: user.user_id,
              balance: data
            })
          } else {
            console.log(result)
          }

          console.log(`pack: ${i + 1} / ${Math.floor(count + 1)} ... User: ${(j / users.length * 100).toFixed(2)}%`)
        }

        if (insertObj.length > 0) {
          const result = await this.model.balanceModel.createBalance(insertObj)

        } else {
          console.log('Not Insert')
        }
      }
      console.log('Balance Job End');
      return {
        success: true,
      };
    } catch (err) {
      logger.log("[Balance Job]", err);
      return {
        success: false,
      };
    }
  }
}
