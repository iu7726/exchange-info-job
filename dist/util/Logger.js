"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.initLogger = exports.serializeArgs = void 0;
const util_1 = __importDefault(require("util"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { combine, timestamp, colorize, printf, label } = winston_1.default.format;
const clc = {
    bold: (text) => `\x1B[1m${text}\x1B[0m`,
    green: (text) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text) => `\x1B[33m${text}\x1B[39m`,
    red: (text) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text) => `\x1B[96m${text}\x1B[39m`,
};
const logFormat = (appName) => {
    return printf(({ message, timestamp }) => {
        if (typeof message == "string") {
            message = message.replace(/\r\n/gi, "");
            message = message.replace(/\\n/gi, "");
            message = message.replace(/\n/gi, "");
        }
        if (appName) {
            return `[${clc.green(appName)}] ${timestamp} ${message}`;
        }
        else {
            return `${timestamp} ${message}`;
        }
    });
};
const serializeArgs = (args) => {
    const hasObject = args.filter((arg) => arg instanceof Object).length > 0;
    const msg = args.reduce((msg, cur, index) => {
        if (cur instanceof Object) {
            if (index == 0) {
                msg = `${util_1.default.formatWithOptions({ colors: true, compact: true }, "%o", cur)}`;
            }
            else {
                msg = `${msg} ${util_1.default.formatWithOptions({ colors: true, compact: true }, "%o", cur)}`;
            }
        }
        else if (typeof cur == "number") {
            if (index == 0) {
                msg = `${clc.yellow(String(cur))}`;
            }
            else {
                msg = `${msg} ${clc.yellow(String(cur))}`;
            }
        }
        else if (cur == undefined) {
            if (index == 0) {
                msg = `${clc.cyanBright("undefined")}`;
            }
            else {
                msg = `${msg} ${clc.cyanBright("undefined")}`;
            }
        }
        else if (typeof cur == "string") {
            if (index == 0) {
                msg = `${cur}`;
            }
            else {
                msg = `${msg} ${cur}`;
            }
        }
        else {
            if (index == 0) {
                msg = `${cur}`;
            }
            else {
                msg = `${msg} ${cur}`;
            }
        }
        return msg;
    }, "");
    if (hasObject) {
        return `\n${msg}`;
    }
    else {
        return msg;
    }
};
exports.serializeArgs = serializeArgs;
let windstonLogger;
const initLogger = (appName) => {
    windstonLogger = winston_1.default.createLogger({
        format: combine(colorize({}), label({}), winston_1.default.format.json({}), timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }), logFormat(appName)),
        transports: [new winston_1.default.transports.Console()],
    });
};
exports.initLogger = initLogger;
exports.logger = {
    load: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.yellow("InstanceLoader")}] -`, ...args]));
    },
    log: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.yellow("Log")}] -`, ...args]));
    },
    info: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.green("Info")}] -`, ...args]));
    },
    debug: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.cyanBright("Debug")}] -`, ...args]));
    },
    alert: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.magentaBright("Alert")}] -`, ...args]));
    },
    error: (...args) => {
        windstonLogger === null || windstonLogger === void 0 ? void 0 : windstonLogger.info((0, exports.serializeArgs)([`[${clc.red("Error")}] -`, ...args]));
    },
};
