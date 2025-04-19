import { Request, RequestHandler, Response } from "express";

import log from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";


export const createUserHandler: RequestHandler = async (req: Request<{}, {}, CreateUserInput['body']>, res: Response): Promise<void> => {
    try {
        const user =  await createUser(req.body);
        res.status(201).send(user);
    } catch(error: any) {
        log.error(error.message);
        res.status(409).send(error.message);
    }
}