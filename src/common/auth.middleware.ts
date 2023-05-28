import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import IJWTUser = Express.IJWTUser;

export class AuthMiddleware implements IMiddleware {
	private _secret: string;
	constructor(secret: string) {
		this._secret = secret;
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		const { authorization: authHeader } = req.headers;
		if (!authHeader) return next();

		const token = authHeader.split(" ")[1];
		verify(token, this._secret, (err, payload) => {
			if (err) {
				next();
			} else if (payload) {
				if (typeof payload !== "string" && "email" in payload) {
					req.user = payload as IJWTUser;
				}
				next();
			}
		});
	}
}
