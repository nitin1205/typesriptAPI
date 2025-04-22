import { Express, Request, Response } from "express";

import { createUserHandler } from "./controller/user.controller";
import { valiadte } from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { createProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";

function routes(app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) => {
        res.sendStatus(200);
    })

    app.post('/api/users', valiadte(createUserSchema) ,createUserHandler);

    app.post('/api/sessions', valiadte(createSessionSchema), createUserSessionHandler);

    app.get('/api/sessions', requireUser, getUserSessionsHandler);
    
    app.delete('/api/sessions', requireUser, deleteSessionHandler);

    app.post('/api/products', [requireUser, valiadte(createProductSchema)], createProductHandler);

    app.put('/api/products/:productId', [requireUser, valiadte(updateProductSchema)], updateProductHandler);

    app.get('/api/products/:productId', valiadte(getProductSchema), getProductHandler);

    app.delete('/api/products/:productId', [requireUser, valiadte(getProductSchema)], deleteProductHandler);
}

export default routes;