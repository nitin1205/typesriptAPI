import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from "zod";

import log from '../utils/logger';

export const valiadte = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query:req.query,
            params: req.params
        })
        next()
        return;
    } catch(error: any) {
        log.error('validate error', `ErrMsg:- ${error.message}`);
        res.status(400).send(error.message)
        return
    }
} 