import { OkPacket } from "mysql2";
import SQL from "sql-template-strings";
import Model from "./classes/Model";
import { logger } from "../util/Logger";
import axios from "axios";
import ConnectionPool from "libs-connection-pool";

export default class BalanceModel extends Model {

  async getLastBill(accountId: number): Promise<string | undefined> {
    try {
      const sql = SQL`
      SELECT 
        id
      FROM
        log_bill
      WHERE
        account_id = ${accountId}
      ORDER BY ts DESC
      LIMIT 1;
      `;
      const result =  await this.connection.readerQuerySingle<{id: string}>(sql);

      return result?.id
    } catch (err) {
      console.error(err);
    }

    return undefined;
  }

  async createBill(record: CreateBill): Promise<boolean> {
    try {
      const sql = SQL`
        INSERT INTO log_bill 
          (
            id,
            account_id,
            user_id,
            volume,
            ccy,
            fee,
            fill_idx_px,
            fill_time,
            inst_id,
            inst_type,
            ord_id,
            px,
            sub_type,
            sz,
            trade_id,
            ts,
            raw
          )
        VALUES
          (
            ${record.id},
            ${record.accountId},
            ${record.userId},
            ${record.volume},
            ${record.ccy},
            ${record.fee},
            ${record.fillIdxPx},
            ${record.fillTime},
            ${record.instId},
            ${record.instType},
            ${record.ordId},
            ${record.px},
            ${record.subType},
            ${record.sz},
            ${record.tradeId},
            ${record.ts},
            ${record.raw}
          )
        ON DUPLICATE KEY UPDATE
          volume = VALUES(volume),
          fill_idx_px = VALUES(fill_idx_px),
          fill_time = VALUES(fill_time),
          ts = VALUES(ts),
          raw = VALUES(raw)
        `;
        
        await this.connection.writerQuery(sql);

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