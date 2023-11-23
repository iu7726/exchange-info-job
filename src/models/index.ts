import ConnectionPool from "libs-connection-pool";
import OkxModel from "./OkxModel";
import BalanceModel from "./BalanceModel";
import KMSModel from "./KMSModel";
import RebateModel from "./RebateModel";
import BillModel from "./BillModel";
import { RedisClientType, RedisClusterType } from 'redis';
import InstrumentModel from "./InstrumentModel";

export class ModelManager {

  balanceModel: BalanceModel;
  kmsModel: KMSModel;
  apiModel: OkxModel;
  rebate: RebateModel;
  bill: BillModel;
  redis: RedisClientType | RedisClusterType;
  instrument: InstrumentModel;

  constructor(connection: ConnectionPool, redis: RedisClientType | RedisClusterType) {
    this.balanceModel = new BalanceModel(connection);
    this.apiModel = new OkxModel(1000);
    this.kmsModel = new KMSModel()
    this.rebate = new RebateModel(connection)
    this.bill = new BillModel(connection);
    this.redis = redis
    this.redis.connect()
    this.instrument = new InstrumentModel
  }
}

let modelManager: ModelManager;

export const useModel = (connection: ConnectionPool, redis: RedisClientType | RedisClusterType) => {
  if (modelManager == undefined) {
    modelManager = new ModelManager(connection, redis);
  }
  return modelManager;
};
