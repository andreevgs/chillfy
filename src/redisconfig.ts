import * as dotenv from 'dotenv';

dotenv.config();
const config = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    tls: {
        rejectUnauthorized: true
    }
};

export default config;
