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
exports.BillsJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
const moment_1 = __importDefault(require("moment"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Fernet_1 = require("../util/Fernet");
class BillsJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Bills Job Start ", (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'));
                const count = ((_a = yield this.model.balanceModel.getAccountCount()) !== null && _a !== void 0 ? _a : 0) / 500;
                console.log(count);
                for (let i = 0; i < count; i++) {
                    console.log('count', i);
                    const users = yield this.model.balanceModel.getAccounts(i);
                    for (let j = 0; j < users.length; j++) {
                        const user = users[j];
                        const access = yield this.model.kmsModel.decrypt(user.wallet_key);
                        const secret = yield this.model.kmsModel.decrypt(user.wallet_secret);
                        const passphrase = yield (0, Fernet_1.decrypt)(user.tag, String(process.env.FERNET_KEY));
                        if (!access || !secret) {
                            continue;
                        }
                        const billId = yield this.model.bill.getLastBill(user.id);
                        const result = yield this.model.apiModel.getBills(access, secret, passphrase, billId);
                        if (!result)
                            continue;
                        if (result.code == '0') {
                            const insertObj = [];
                            for (let k = 0; k < result.data.length; k++) {
                                const data = result.data[k];
                                // if (data.fee == '0') continue;
                                let volume = (new bignumber_js_1.default(data.sz));
                                if (data.instType == 'SWAP') {
                                    const inst = yield this.model.instrument.getInstrument(data.instId);
                                    volume = (new bignumber_js_1.default(inst.ctVal)).multipliedBy(new bignumber_js_1.default(data.px)).multipliedBy(new bignumber_js_1.default(data.sz));
                                }
                                else {
                                    if (data.ccy != 'USDT') {
                                        volume = volume.multipliedBy(data.px);
                                    }
                                    const instAry = data.instId.split('-');
                                    let ccy = instAry[1];
                                    if (ccy != 'USDT') {
                                        const redisRes = yield this.model.redis.HGET('$USDT:price$', ccy);
                                        volume = (new bignumber_js_1.default((JSON.parse(redisRes !== null && redisRes !== void 0 ? redisRes : '{}')).price)).multipliedBy(volume);
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
                                });
                            }
                            // if (insertObj.length > 0) {
                            //   const result = await this.model.bill.createBill(insertObj)
                            // } else {
                            //   console.log('Not Insert')
                            // }
                        }
                        else {
                            console.log(result);
                        }
                        console.log(`pack: ${i + 1} / ${Math.floor(count + 1)} ... User: ${(j / users.length * 100).toFixed(2)}%`);
                    }
                }
                console.log('Bill Job End');
                return {
                    success: true,
                };
            }
            catch (err) {
                Logger_1.logger.log("[Bill Job]", err);
                return {
                    success: false,
                };
            }
        });
    }
}
exports.BillsJob = BillsJob;
