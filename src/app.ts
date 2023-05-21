import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./user/user.controller";
import { ExceptionFilter } from "./error/exception.filter";
import { ILogger } from "./logger/logger.interface";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";

@injectable()
export class App {
	port: number;
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
		port = 7070,
	) {
		this.app = express();
		this.port = port;
	}

	useRoutes() {
		this.app.use("/user", this.userController.getRouter());
	}

	useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this));
	}

	public async init() {
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(
			`Server started on port ${this.port}. GO to http://localhost:${this.port}`,
		);
	}
}
