import { Job, JobRequest, JobResult } from "libs-job-manager";
import { ModelManager, useModel } from "../models";
import { logger } from "../util/Logger";
import moment from "moment";
import axios from "axios";
import { decrypt } from "../util/Fernet";
import fs from "fs"
import info from "../seed/exchange-info.json"

export interface RebateJobRequest extends JobRequest {

}

export interface RebateJobResult extends JobResult {
  ts: number;
}

export class RebateJob extends Job<RebateJobRequest, RebateJobResult> {

  constructor(jobRequest: RebateJobRequest, private readonly model: ModelManager) {
    super(jobRequest);
  }

  async execute(): Promise<RebateJobResult> {
    try {
      console.log("Rebate Job Start ", moment().format('YYYY-MM-DD HH:mm:ss'))
      await this.rebateExec(1)
      console.log("Rebate Job End ", moment().format('YYYY-MM-DD HH:mm:ss'))

      return {
        success: true,
        ts: Date.now(),
      };
    } catch (e) {}

    return {
      success: false,
      ts: Date.now(),
    };
    
  }

  async rebateExec(page: number) {
    const last = await this.model.rebate.getRebateLastDetail()
    console.log('last', last)
    let beginTime = '0'
    if (last) {
      beginTime = String(last.rebate_unix) + '000'
    }

    const rebateResponse = await this.model.apiModel.getRebate(beginTime, page)
  
    if (rebateResponse?.code != '0') return {
      success: false,
      ts: Date.now()
    }

    const datas = rebateResponse?.data
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i]
      
      const rebateId = await this.model.rebate.insertRebateInfo({
        totalIncome: data.totIncome,
        convert: data.totIncomeCat.convert,
        derivative: data.totIncomeCat.derivative,
        spot: data.totIncomeCat.spot,
      })
      console.log('rebateId', rebateId)

      const details = data.details
      for (let j = 0; j < details.length; j++) {
        const detail = details[j]

        this.model.rebate.createRebateDetail(rebateId, detail)
        console.log(`pack: ${j + 1} / ${Math.floor(details.length + 1)} ... User: ${(j/details.length*100).toFixed(2)}%`)
      }

      if (data.totPage != '1') {
        for (let k=2; k <= Number(data.totPage); k++) {
          await this.rebateExec(k)
          console.log('new job')
        }
      }
    }
  }

  
}
