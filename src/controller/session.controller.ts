import { Request, Response, RequestHandler } from "express";
import config from 'config';

import { validatePassword } from "../service/user.service";
import { createSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import { CreateSessionInput } from "../schema/session.schema";

export const createUserSessionHandler: RequestHandler = async (req: Request<{}, {}, CreateSessionInput['body']>, res: Response): Promise<void> =>{
    const user = await validatePassword(req.body);
    if(!user) res.status(401).send('Invalid email or password');
     
    if(user){
        const session = await createSession(user._id as unknown as string, req.get('user-agent') || '');
        const accessToken = signJwt(
            { ...user, session: session._id },
            { expiresIn: config.get('accessTokenTtl') } // 15 min accessTokenTTl
        )
        
        const refreshToken = signJwt(
            { ...user, session: session._id },
            { expiresIn: config.get('refershTokenTtl') } // 1 yr refreshTokenTTl
        )

        res.send({ accessToken, refreshToken });


    } 
}