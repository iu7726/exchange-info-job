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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.computeHmac = exports.fromBase64Url = void 0;
const crypto = __importStar(require("crypto"));
const fromBase64Url = (base64url) => {
    const unpadded = base64url.replace(/\=/g, '');
    if (Buffer.from(unpadded, 'base64url').toString('base64url') !== unpadded) {
        throw new Error('Invalid encoding. String must be base64url encoded string.');
    }
    const buff = Buffer.from(unpadded, 'base64url');
    return buff;
};
exports.fromBase64Url = fromBase64Url;
const compareBuffers = (a, b) => {
    return crypto.timingSafeEqual(a, b);
};
const computeHmac = (input, key, algo = 'sha256') => {
    return crypto.createHmac(algo, key).update(input).digest();
};
exports.computeHmac = computeHmac;
const checkKey = (key) => {
    try {
        const buffer = fromBase64Url(key);
        if (buffer.length !== 32) {
            throw new Error('Key must be 32-byte long base64url encoded string.');
        }
    }
    catch (error) {
        throw new Error('Key must be 32-byte long base64url encoded string.');
    }
};
const aesDecrypt = (cipherText, key, iv, algo = 'aes-128-cbc') => {
    const decipher = crypto.createDecipheriv(algo, key, iv);
    let decrypted = decipher.update(cipherText);
    return Buffer.concat([decrypted, decipher.final()]);
};
const decrypt = (token, key) => {
    try {
        checkKey(key);
        const keyBuffer = fromBase64Url(key);
        const signingKey = keyBuffer.subarray(0, 16);
        const encryptionKey = keyBuffer.subarray(16, 32);
        const tokenBuffer = fromBase64Url(token);
        if (tokenBuffer.length < 73 ||
            (tokenBuffer.length - (1 + 8 + 16 + 32)) % 16 !== 0) {
            throw new Error('Fernet token has invalid length.');
        }
        const version = tokenBuffer.subarray(0, 1);
        if (!compareBuffers(version, Buffer.from([0x80]))) {
            throw new Error('Fernet version must be 0x80');
        }
        const timestamp = tokenBuffer.subarray(1, 9);
        const iv = tokenBuffer.subarray(9, 25);
        const cipherText = tokenBuffer.subarray(25, tokenBuffer.length - 32);
        const hmac = tokenBuffer.subarray(tokenBuffer.length - 32, tokenBuffer.length);
        const toVerify = tokenBuffer.subarray(0, tokenBuffer.length - 32);
        const computedHmac = computeHmac(toVerify, signingKey);
        const isVerified = compareBuffers(hmac, computedHmac);
        if (!isVerified) {
            throw new Error('Invalid signature. Signature did not match digest.');
        }
        const decrypted = aesDecrypt(cipherText, encryptionKey, iv);
        return decrypted.toString('utf-8');
    }
    catch (err) {
        throw err;
    }
};
exports.decrypt = decrypt;
