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
const dotenv_1 = __importDefault(require("dotenv"));
const libs_connection_pool_1 = __importDefault(require("libs-connection-pool"));
const OkxBalanceJob_1 = require("./jobs/OkxBalanceJob");
const node_cron_1 = __importDefault(require("node-cron"));
const AsyncJobManager_1 = require("./managers/AsyncJobManager");
const SyncJobWithEmitManager_1 = require("./managers/SyncJobWithEmitManager");
const models_1 = require("./models");
const Logger_1 = require("./util/Logger");
const RebateJob_1 = require("./jobs/RebateJob");
const redis_1 = require("redis");
const BillsJob_1 = require("./jobs/BillsJob");
dotenv_1.default.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, Logger_1.initLogger)("OG-cron");
    const cp = new libs_connection_pool_1.default({
        host: String(process.env.MYSQL_HOST),
        writerHost: String(process.env.MYSQL_HOST),
        readerHost: String(process.env.MYSQL_RO_HOST),
        user: String(process.env.MYSQL_USER),
        password: String(process.env.MYSQL_PASSWORD),
        database: String(process.env.MYSQL_DATABASE),
    });
    const redis = process.env.REDIS_CLUSTER == "true"
        ? (0, redis_1.createCluster)({ rootNodes: [{ url: process.env.REDIS_URL }] })
        : (0, redis_1.createClient)({ url: process.env.REDIS_URL });
    const model = (0, models_1.useModel)(cp, redis);
    Logger_1.logger.load("cp connect complete...");
    const syncJobManager = new SyncJobWithEmitManager_1.SyncJobWithEmitManager(() => {
    });
    const asyncJobManager = new AsyncJobManager_1.AsyncJobManager();
    node_cron_1.default.schedule('*/5 * * * *', () => {
        asyncJobManager.addJob(new BillsJob_1.BillsJob({}, model));
    });
    node_cron_1.default.schedule('10 * * * *', () => {
        asyncJobManager.addJob(new RebateJob_1.RebateJob({}, model));
    });
    node_cron_1.default.schedule('00 * * * *', () => {
        asyncJobManager.addJob(new OkxBalanceJob_1.OkxBalanceJob({}, model));
    });
    Logger_1.logger.info("Load Completed");
}))();
