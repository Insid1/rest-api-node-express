import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exception.filter.interface";
import { HttpError } from "./http.error";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../types";

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private logger: LoggerService) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(
				`Ошибка: ${err.statusCode} Сообщение: ${err.message} Контекст: ${err.context}`,
			);
			res.status(err.statusCode).json({ message: err.message, context: err.context });
		} else {
			this.logger.error(err.message);
			res.status(500).json(err.message);
		}
	}
}
