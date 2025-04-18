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
    } catch(error: any) {
        console.log('validate error')
        log.error(error.message);
        res.status(400).send(error.message)
    }
} 