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
exports.OkxBalanceJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const Logger_1 = require("../util/Logger");
const moment_1 = __importDefault(require("moment"));
const Fernet_1 = require("../util/Fernet");
class OkxBalanceJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Balance Job Start ", (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'));
                const count = ((_a = yield this.model.balanceModel.getAccountCount()) !== null && _a !== void 0 ? _a : 0) / 500;
                console.log(count);
                for (let i = 0; i < count; i++) {
                    const users = yield this.model.balanceModel.getAccounts(i);
                    const insertObj = [];
                    for (let j = 0; j < users.length; j++) {
                        const user = users[j];
                        const access = yield this.model.kmsModel.decrypt(user.wallet_key);
                        const secret = yield this.model.kmsModel.decrypt(user.wallet_secret);
                        const passphrase = yield (0, Fernet_1.decrypt)(user.tag, String(process.env.FERNET_KEY));
                        if (!access || !secret) {
                            continue;
                        }
                        const result = yield this.model.apiModel.getBalance(access, secret, passphrase);
                        if (!result)
                            continue;
                        if (result.code == '0') {
                            const data = result.data[0];
                            insertObj.push({
                                account_id: user.id,
                                user_id: user.user_id,
                                balance: data
                            });
                        }
                        else {
                            console.log(result);
                        }
                        console.log(`pack: ${i + 1} / ${Math.floor(count + 1)} ... User: ${(j / users.length * 100).toFixed(2)}%`);
                    }
                    if (insertObj.length > 0) {
                        const result = yield this.model.balanceModel.createBalance(insertObj);
                    }
                    else {
                        console.log('Not Insert');
                    }
                }
                console.log('Balance Job End');
                return {
                    success: true,
                };
            }
            catch (err) {
                Logger_1.logger.log("[Balance Job]", err);
                return {
                    success: false,
                };
            }
        });
    }
}
exports.OkxBalanceJob = OkxBalanceJob;
