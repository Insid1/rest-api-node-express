import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			next();
			return;
		}
		res.sendStatus(401);
	}
}
