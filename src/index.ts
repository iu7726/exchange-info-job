import dotenv from "dotenv";
import ConnectionPool from "libs-connection-pool";
import { OkxBalanceJob } from "./jobs/OkxBalanceJob";
import Cron from "node-cron";

import { AsyncJobManager } from "./managers/AsyncJobManager";
import { SyncJobWithEmitManager } from "./managers/SyncJobWithEmitManager";
import { useModel } from "./models";
import { initLogger, logger } from "./util/Logger";
import { RebateJob } from "./jobs/RebateJob";
import { RedisClientType, RedisClusterType, createClient, createCluster } from 'redis';
import { BillsJob } from "./jobs/BillsJob";
import BigNumber from "bignumber.js";

dotenv.config();

(async () => {
  initLogger("OG-cron");

  const cp = new ConnectionPool({
    host: String(process.env.MYSQL_HOST),
    writerHost: String(process.env.MYSQL_HOST),
    readerHost: String(process.env.MYSQL_RO_HOST),
    user: String(process.env.MYSQL_USER),
    password: String(process.env.MYSQL_PASSWORD),
    database: String(process.env.MYSQL_DATABASE),
  });

  const redis: RedisClientType | RedisClusterType = process.env.REDIS_CLUSTER == "true"
  ? createCluster({ rootNodes: [{ url: process.env.REDIS_URL }] })
  : createClient({ url: process.env.REDIS_URL })
  const model = useModel(cp, redis);
  logger.load("cp connect complete...");

  const syncJobManager = new SyncJobWithEmitManager(() => {
    
  });
  

  const asyncJobManager = new AsyncJobManager();
  
  Cron.schedule('*/5 * * * *', () => {
    asyncJobManager.addJob(new BillsJob({}, model));
  })
  
  Cron.schedule('10 * * * *', () => {
    asyncJobManager.addJob(new RebateJob({}, model));
  })

  Cron.schedule('00 * * * *', () => {
    asyncJobManager.addJob(new OkxBalanceJob({}, model));
  })

  logger.info("Load Completed")

})();
