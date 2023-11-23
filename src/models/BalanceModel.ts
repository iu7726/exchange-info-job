import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import Model from "./classes/Model";
import { logger } from "../util/Logger";
import axios from "axios";
import ConnectionPool from "libs-connection-pool";

export default class BalanceModel extends Model {

  async getAccountCount(): Promise<number | undefined> {
    try {
      const sql = SQL`
      SELECT 
        COUNT(*) AS count
      FROM
        account_account
      WHERE
        is_active = 1;
      `;
      const result =  await this.connection.readerQuerySingle<{count: number}>(sql);

      return result?.count
    } catch (err) {
      console.error(err);
    }

    return 0;
  }

  async getAccounts(page: number): Promise<any> {
    try {
      const sql = SQL`
      SELECT 
        id,
        user_id,
        wallet_key,
        wallet_secret,
        tag
      FROM
        account_account
      WHERE
        is_active = 1
      LIMIT ${page * 500}, 500
      `;

      return await this.connection.readerQuery(sql);
    } catch (err) {
      console.error(err);
    }

    return undefined
  }

  async createBalance(records: CreateBalance[]): Promise<boolean> {
    try {
      const sql = `
        INSERT INTO account_balance 
          (
            account_id,
            user_id,
            details,
            u_time,
            imr,
            iso_eq,
            total_eq,
            raw,
            created_at
          )
        VALUES
          ?
        `;
        const param = [
          records.map((record:CreateBalance) => [
            record.account_id,
            record.user_id, 
            JSON.stringify(record.balance.details ?? {}), 
            record.balance.uTime, 
            record.balance.imr,
            record.balance.isoEq,
            record.balance.totalEq,
            JSON.stringify(record.balance),
            new Date()
          ])
        ];
        
        await this.connection.writerQuery(sql, param);

        return true
    } catch (e) {
      console.log(e)
    }

    return false
  }
}

/***
 * symbol: symbol.symbol,
          status: symbol.status,
          baseAsset: symbol.baseAsset,
          baseAssetDecimal: symbol.baseCommissionPrecision,
          quoteAsset: symbol.quoteAsset,
          quoteAssetDecimal: symbol.quoteCommissionPrecision,
          orderTypes: orderTypes,
          minPrice: symbol.filters[0].minPrice,
          maxPrice: symbol.filters[0].maxPrice,
          tickSize: symbol.filters[0].tickSize,
          minQty: symbol.filters[1].minQty,
          maxQty: symbol.filters[1].maxQty,
          stepSize: symbol.filters[1].stepSize,
          raw: JSON.stringify(symbol)
 */