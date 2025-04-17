import mongoose from "mongoose";
import config from 'config';

import log from "./logger";


async function connectToDB() {
    const dbURL = config.get<string>('dbURL');
    try {
        await mongoose.connect(dbURL);
        log.info('connected to DB');
    } catch (error) {
        log.error('DB connection failed');
        process.exit(1);
    }
}

export default connectToDB;