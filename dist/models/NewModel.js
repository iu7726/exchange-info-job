"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = __importDefault(require("./classes/Model"));
class NewModel extends Model_1.default {
}
exports.default = NewModel;
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
