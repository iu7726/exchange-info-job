import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import Model from "./classes/Model";
import { logger } from "../util/Logger";
import axios from "axios";
import ConnectionPool from "libs-connection-pool";

export default class RebateModel extends Model {
  async getRebateLastDetail(): Promise<LastRebateDetail | undefined> {
    const sql = SQL`
    SELECT 
      rebate_unix
    FROM
      rebate_detail
    ORDER BY rebate_unix DESC
    LIMIT 1
    `

    return this.connection.readerQuerySingle(sql)
  }

  async insertRebateInfo(dto: RebateInfo): Promise<number> {
    try {
      const sql = SQL`
      INSERT INTO rebate_info 
        (
          total_income, 
          rebate_info.convert, 
          derivative, 
          spot, 
          created_at
        )
      VALUES
          (
            ${dto.totalIncome},
            ${dto.convert},
            ${dto.derivative},
            ${dto.spot},
            ${new Date()}
          )
      `;

      const result: OkPacket = await this.connection.writerQuery(sql)

      return result.insertId
    } catch (e) {
      console.error(e);
    }
    return 0
  }

  async createRebateDetail(rebateId: number, dto: RebateResponseDataDetail): Promise<boolean> {
    try {
      const sql = SQL`
      INSERT INTO rebate_detail
        (
          rebate_id,
          sub_acct,
          income,
          income_convert,
          income_derivative,
          income_spot,
          markup_fee,
          markup_convert,
          markup_derivative,
          markup_spot,
          net_fee,
          net_derivative,
          net_spot,
          rebate_date,
          rebate_unix,
          created_at
        )
      values
        (
          ${rebateId},
          ${dto.subAcct},
          ${dto.income},
          ${dto.incomeCat.convert},
          ${dto.incomeCat.derivative},
          ${dto.incomeCat.spot},
          ${dto.markupFee},
          ${dto.markupFeeCat.convert},
          ${dto.markupFeeCat.derivative},
          ${dto.markupFeeCat.spot},
          ${dto.netFee},
          ${dto.netFeeCat.derivative},
          ${dto.netFeeCat.spot},
          ${dto.rebateDate},
          ${Number(dto.rebateTime)/1000},
          ${new Date()}
        )
      `;

      await this.connection.writerQuery(sql)

      return true
    } catch (e) {
      console.error(e)
    }

    return false
  }
}