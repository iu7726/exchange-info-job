"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const DelayApiModel_1 = __importDefault(require("./classes/DelayApiModel"));
const crypto = __importStar(require("crypto"));
class OkxModel extends DelayApiModel_1.default {
    getHeader(access, secret, passphrase, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = new Date().toISOString();
            const input = `${timestamp}${path}`;
            const sign = crypto.createHmac('SHA256', Buffer.from(secret))
                .update(Buffer.from(input))
                .digest('base64');
            return {
                'OK-ACCESS-KEY': access,
                'OK-ACCESS-SIGN': sign,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': passphrase,
                'x-simulated-trading': '0'
            };
        });
    }
    getBalance(access, secret, passphrase) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://www.okx.com/api/v5/account/balance`;
            try {
                const header = yield this.getHeader(access, secret, passphrase, 'GET/api/v5/account/balance');
                const response = yield this.GET(url, 0, header);
                if (response) {
                    return response;
                }
            }
            catch (e) {
                console.log('E', e);
            }
            return undefined;
        });
    }
    getRebate(beginTime, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/api/v5/broker/nd/rebate-daily`;
            if (beginTime != '0') {
                url += `?beginTime=${beginTime}`;
            }
            if (page > 1) {
                url += `&page=${page}`;
            }
            try {
                const header = yield this.getHeader(String(process.env.OKEX_BROKER_KEY), String(process.env.OKEX_BROKER_SECRET_KEY), String(process.env.OKEX_BROKER_PASSPHRASE), `GET${url}`);
                url = 'https://www.okx.com' + url;
                const response = yield this.GET(url, 10000, header);
                if (response) {
                    return response;
                }
            }
            catch (e) {
                console.log('E', e);
            }
            return undefined;
        });
    }
    getBills(access, secret, passphrase, billId) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/api/v5/account/bills-archive?type=2`;
            if (billId) {
                url += `&before=${billId}`;
            }
            try {
                const header = yield this.getHeader(access, secret, passphrase, `GET${url}`);
                url = 'https://www.okx.com' + url;
                const response = yield this.GET(url, 0, header);
                if (response) {
                    return response;
                }
            }
            catch (e) {
                console.log('E', e);
            }
            return undefined;
        });
    }
    getInstruments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'https://www.okx.com/api/v5/public/instruments?instType=SWAP';
                const response = yield this.GET(url);
                if (response) {
                    return response;
                }
            }
            catch (e) {
                console.log("E", e);
            }
        });
    }
}
exports.default = OkxModel;
