import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from "zod";

const valiadte = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query:req.query,
            params: req.params
        })
    } catch(error: any) {
        res.status(400).send(error.errors)
    }
} 