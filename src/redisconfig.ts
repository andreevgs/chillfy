import * as dotenv from 'dotenv';

dotenv.config();
const config = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {
        rejectUnauthorized: false
    }
};

export default config;
