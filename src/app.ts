import express from 'express';
import config from 'config';

import connectToDB from './utils/connect';
import log from './utils/logger';
import routes from './routes';

const app = express();

const port = config.get<number>('port');

app.use(express.json())

routes(app);

app.listen(port, async () => {
    log.info(`listenig to ${port}`)
    await connectToDB();
});