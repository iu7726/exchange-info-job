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
class RebateModel extends Model_1.default {
    getRebateLastDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = (0, sql_template_strings_1.default) `
    SELECT 
      rebate_unix
    FROM
      rebate_detail
    ORDER BY rebate_unix DESC
    LIMIT 1
    `;
            return this.connection.readerQuerySingle(sql);
        });
    }
    insertRebateInfo(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
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
                const result = yield this.connection.writerQuery(sql);
                return result.insertId;
            }
            catch (e) {
                console.error(e);
            }
            return 0;
        });
    }
    createRebateDetail(rebateId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = (0, sql_template_strings_1.default) `
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
          ${Number(dto.rebateTime) / 1000},
          ${new Date()}
        )
      `;
                yield this.connection.writerQuery(sql);
                return true;
            }
            catch (e) {
                console.error(e);
            }
            return false;
        });
    }
}
exports.default = RebateModel;
