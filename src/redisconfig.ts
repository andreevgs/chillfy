import * as dotenv from 'dotenv';

dotenv.config();
const config = {
    host: process.env.REDIS_TLS_URL,
    // port: parseInt(process.env.REDIS_PORT),
};

export default config;
