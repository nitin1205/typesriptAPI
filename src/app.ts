import express , { Request, Response, NextFunction } from 'express';
import config from 'config';

import connectToDB from './utils/connect';
import log from './utils/logger';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';


const app = express();

const port = config.get<number>('port');

app.use(express.json())

app.use(deserializeUser)

routes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction ) => {
    log.error(err.stack);
    res.status(500).send({ statusCode: err.statusCode, type: err.type });
})

app.listen(port, async () => {
    log.info(`listenig to ${port}`)
    await connectToDB();
});