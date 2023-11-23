"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModel = exports.ModelManager = void 0;
const OkxModel_1 = __importDefault(require("./OkxModel"));
const BalanceModel_1 = __importDefault(require("./BalanceModel"));
const KMSModel_1 = __importDefault(require("./KMSModel"));
const RebateModel_1 = __importDefault(require("./RebateModel"));
const BillModel_1 = __importDefault(require("./BillModel"));
const InstrumentModel_1 = __importDefault(require("./InstrumentModel"));
class ModelManager {
    constructor(connection, redis) {
        this.balanceModel = new BalanceModel_1.default(connection);
        this.apiModel = new OkxModel_1.default(1000);
        this.kmsModel = new KMSModel_1.default();
        this.rebate = new RebateModel_1.default(connection);
        this.bill = new BillModel_1.default(connection);
        this.redis = redis;
        this.redis.connect();
        this.instrument = new InstrumentModel_1.default;
    }
}
exports.ModelManager = ModelManager;
let modelManager;
const useModel = (connection, redis) => {
    if (modelManager == undefined) {
        modelManager = new ModelManager(connection, redis);
    }
    return modelManager;
};
exports.useModel = useModel;
