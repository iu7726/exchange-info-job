"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql_template_strings_1 = __importDefault(require("sql-template-strings"));
const Model_1 = __importDefault(require("./classes/Model"));
class BalanceModel extends Model_1.default {
    getLastBill(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
      SELECT 
        id
      FROM
        log_bill
      WHERE
        account_id = ${accountId}
      ORDER BY ts DESC
      LIMIT 1;
      `;
                const result = yield this.connection.readerQuerySingle(sql);
                return result === null || result === void 0 ? void 0 : result.id;
            }
            catch (err) {
                console.error(err);
            }
            return undefined;
        });
    }
    createBill(record) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
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
                yield this.connection.writerQuery(sql);
                return true;
            }
            catch (e) {
                console.log(e);
            }
            return false;
        });
    }
}
exports.default = BalanceModel;
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
