import express, { Express } from "express";
import { Server } from "http";
import { ILogger } from "./logger/logger.interface";
import { inject, injectable } from "inversify";
import { json } from "body-parser";
import "reflect-metadata";
import { TYPES } from "./types";
import { IUserController } from "./user/controller/user.controller.interface";
import { IExceptionFilter } from "./error/exception.filter.interface";
import { IConfigService } from "./config/config.service.interface";
import { PrismaService } from "./db/prisma.service";
import { AuthMiddleware } from "./common/auth.middleware";

@injectable()
export class App {
	port: number;
	app: Express;
	server: Server;

	constructor(
		@inject(TYPES.LoggerService) private logger: ILogger,
		@inject(TYPES.UserController) private userController: IUserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		port = 7070,
	) {
		this.app = express();
		this.port = port;
	}

	useMiddleware(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get("JWT_SECRET"));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use("/user", this.userController.getRouter());
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();

		this.server = this.app.listen(this.port);
		this.logger.log(
			`Server started on port ${this.port}. GO to http://localhost:${this.port}`,
		);
	}

	public close(): void {
		this.server.close();
	}
}
