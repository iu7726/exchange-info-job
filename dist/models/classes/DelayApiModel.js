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
const axios_1 = __importDefault(require("axios"));
const wait = (delay) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
});
class DelayApiModel {
    constructor(delayTime = 2000) {
        this.delayTime = delayTime;
    }
    getHeaders() {
        return { "Accept-Encoding": "gzip,deflate,compress" };
    }
    GET(requestUrl, delayTime = this.delayTime, headers = this.getHeaders()) {
        return __awaiter(this, void 0, void 0, function* () {
            const st = new Date().getTime();
            let result;
            try {
                const axiosResult = yield axios_1.default.get(requestUrl, {
                    headers: headers
                });
                result = axiosResult.data;
            }
            catch (e) {
                console.log(e.response.status, e.response.statusText, e.response.data);
            }
            const dt = new Date().getTime() - st;
            if (delayTime > dt) {
                yield wait(delayTime - dt);
            }
            return result !== undefined ? result : undefined;
        });
    }
}
exports.default = DelayApiModel;
