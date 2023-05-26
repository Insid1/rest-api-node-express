import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		console.log("body", body);
		const instance = plainToInstance(this.classToValidate, body);
		console.log("instance", instance);
		validate(instance)
			.then((errors) => {
				console.log("Errors", errors);
				if (errors.length > 0) {
					res.status(422).send(errors);
				} else {
					next();
				}
			})
			.catch((e) => {
				console.log("ERROR", e);
			});
	}
}
