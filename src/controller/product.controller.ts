import { RequestHandler, Request, Response } from "express";

import { CreateProductInput, UpdateProductInput } from "../schema/product.schema";
import { createProduct, deleteProduct, findAndUpdateProduct, findProduct } from "../service/product.service";

export const createProductHandler: RequestHandler = async(
    req: Request<{}, {}, CreateProductInput['body']>,
    res: Response
): Promise<void> => {
    const userId = res.locals.user._id;
    const body = req.body;

    const product = await createProduct({ ...body, user: userId });

    res.send(product);
}


export const updateProductHandler: RequestHandler<UpdateProductInput['params']> = async(
    req: Request<UpdateProductInput['params']>,
    res: Response  
): Promise<void> => {
    const userId = res.locals.user._id;
    const productId = req.params.productId;
    const update = req.body;

    const product = await findProduct({ productId });

    if(!product) res.sendStatus(404);

    if(String(product?.user) !== userId) res.sendStatus(403);

    const updatedProduct = await findAndUpdateProduct({ productId }, update, { new: true });

    res.send(updatedProduct);
}


export const getProductHandler: RequestHandler<UpdateProductInput['params']> = async(
    req: Request<UpdateProductInput['params']>,
    res: Response
): Promise<void> => {
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if(!product) res.sendStatus(404);

    res.send(product);
}


export const deleteProductHandler: RequestHandler<UpdateProductInput['params']> = async(
    req: Request<UpdateProductInput['params']>,
    res: Response
): Promise<void> => {
    const userId = res.locals.user._id;
    const productId = req.params.productId;

    const product = await findProduct({ productId });

    if(!product) res.sendStatus(404);

    if(String(product?.user) !== userId) res.sendStatus(403);

    await deleteProduct({ productId });

    res.sendStatus(200);
}