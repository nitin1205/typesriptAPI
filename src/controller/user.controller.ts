import { Request, Response } from "express";

import log from "../utils/logger";


export async function(req: Request, res: Response) {
    try {

    } catch(error) {
        log.error(error);
        res.status(409);
    }
}