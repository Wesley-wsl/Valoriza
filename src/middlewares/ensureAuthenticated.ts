import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface iPayload {
    sub: string;
}


export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub} = verify(token, "f0b2ca6ac926b858b754f102240d29e6") as iPayload;
        request.user_id = sub

        return next()
    } catch (err) {
        return response.status(401).end();
    }

}
