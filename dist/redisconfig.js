"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const config = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
};
exports.default = config;
//# sourceMappingURL=redisconfig.js.map