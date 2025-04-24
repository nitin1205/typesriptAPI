import { Request, Response, RequestHandler } from "express";
import config from 'config';

import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import { CreateSessionInput } from "../schema/session.schema";

export const createUserSessionHandler: RequestHandler = async (req: Request<{}, {}, CreateSessionInput['body']>, res: Response): Promise<void> =>{
    const user = await validatePassword(req.body);
    if(!user){
        res.status(401).send('Invalid email or password') 
        return;  
    } 
    
    if(user){
        const session = await createSession(user._id as unknown as string, req.get('user-agent') || '');
        const accessToken = signJwt(
            { ...user, session: session._id },
            { expiresIn: config.get('accessTokenTtl') } // 15 min accessTokenTTl
        )
        
        const refreshToken = signJwt(
            { ...user, session: session._id },
            { expiresIn: config.get('refreshTokenTtl') } // 1 yr refreshTokenTTl
        )

        res.send({ accessToken, refreshToken });
        return;
    }
};


export const getUserSessionsHandler: RequestHandler = async(req: Request, res: Response): Promise<void> => {
  const userId = res.locals.user._id;
  const session = await findSessions({user: userId, valid: true })

  res.send(session);
  return;
}

export const deleteSessionHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const sessionId = res.locals.user.session;
    await updateSession({ _id: sessionId }, { valid: false })
    
    res.send({
        accessToken: null,
        refreshToken: null
    });
    return;
}