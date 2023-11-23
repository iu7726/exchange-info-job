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
    getAccountCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
      SELECT 
        COUNT(*) AS count
      FROM
        account_account
      WHERE
        is_active = 1;
      `;
                const result = yield this.connection.readerQuerySingle(sql);
                return result === null || result === void 0 ? void 0 : result.count;
            }
            catch (err) {
                console.error(err);
            }
            return 0;
        });
    }
    getAccounts(page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
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
                return yield this.connection.readerQuery(sql);
            }
            catch (err) {
                console.error(err);
            }
            return undefined;
        });
    }
    createBalance(records) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    records.map((record) => {
                        var _a;
                        return [
                            record.account_id,
                            record.user_id,
                            JSON.stringify((_a = record.balance.details) !== null && _a !== void 0 ? _a : {}),
                            record.balance.uTime,
                            record.balance.imr,
                            record.balance.isoEq,
                            record.balance.totalEq,
                            JSON.stringify(record.balance),
                            new Date()
                        ];
                    })
                ];
                yield this.connection.writerQuery(sql, param);
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
