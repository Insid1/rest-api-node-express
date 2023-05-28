import { inject, injectable } from "inversify";
import { PrismaClient } from "@prisma/client";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";

@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.LoggerService) private loggerService: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log("Database successfully connected!");
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error("Unable to connect to database. Error:", e.message);
			} else {
				this.loggerService.error(e);
			}
		}
	}
	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
