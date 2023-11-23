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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class KMSModel {
    constructor() {
        this.initKMS();
        this.aws = new aws_sdk_1.default.KMS();
    }
    initKMS() {
        return __awaiter(this, void 0, void 0, function* () {
            aws_sdk_1.default.config.update({
                accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
                secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
                region: 'ap-southeast-1'
            });
        });
    }
    encrypt(plaintext) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.aws.encrypt({
                KeyId: String(process.env.AWS_KMS_KEY_ID),
                Plaintext: Buffer.from(plaintext)
            }).promise();
            const result = (_a = response.CiphertextBlob) === null || _a === void 0 ? void 0 : _a.toString('base64');
            return result;
        });
    }
    decrypt(key) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.aws.decrypt({
                CiphertextBlob: Buffer.from(key, 'base64')
            }).promise();
            return (_a = response.Plaintext) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
        });
    }
}
exports.default = KMSModel;
