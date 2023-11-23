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
exports.RebateJob = void 0;
const libs_job_manager_1 = require("libs-job-manager");
const moment_1 = __importDefault(require("moment"));
class RebateJob extends libs_job_manager_1.Job {
    constructor(jobRequest, model) {
        super(jobRequest);
        this.model = model;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Rebate Job Start ", (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'));
                yield this.rebateExec(1);
                console.log("Rebate Job End ", (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'));
                return {
                    success: true,
                    ts: Date.now(),
                };
            }
            catch (e) { }
            return {
                success: false,
                ts: Date.now(),
            };
        });
    }
    rebateExec(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const last = yield this.model.rebate.getRebateLastDetail();
            console.log('last', last);
            let beginTime = '0';
            if (last) {
                beginTime = String(last.rebate_unix) + '000';
            }
            const rebateResponse = yield this.model.apiModel.getRebate(beginTime, page);
            if ((rebateResponse === null || rebateResponse === void 0 ? void 0 : rebateResponse.code) != '0')
                return {
                    success: false,
                    ts: Date.now()
                };
            const datas = rebateResponse === null || rebateResponse === void 0 ? void 0 : rebateResponse.data;
            for (let i = 0; i < datas.length; i++) {
                const data = datas[i];
                const rebateId = yield this.model.rebate.insertRebateInfo({
                    totalIncome: data.totIncome,
                    convert: data.totIncomeCat.convert,
                    derivative: data.totIncomeCat.derivative,
                    spot: data.totIncomeCat.spot,
                });
                console.log('rebateId', rebateId);
                const details = data.details;
                for (let j = 0; j < details.length; j++) {
                    const detail = details[j];
                    this.model.rebate.createRebateDetail(rebateId, detail);
                    console.log(`pack: ${j + 1} / ${Math.floor(details.length + 1)} ... User: ${(j / details.length * 100).toFixed(2)}%`);
                }
                if (data.totPage != '1') {
                    for (let k = 2; k <= Number(data.totPage); k++) {
                        yield this.rebateExec(k);
                        console.log('new job');
                    }
                }
            }
        });
    }
}
exports.RebateJob = RebateJob;
