import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/controller/user.controller.interface";
import { ExceptionFilter } from "./error/exception.filter";
import { Container, ContainerModule, interfaces } from "inversify";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./error/exception.filter.interface";
import { TYPES } from "./types";
import { IUserController } from "./user/controller/user.interface";
import { IUserService } from "./user/service/user.service.interface";
import { UserService } from "./user/service/user.service";
import { IConfigService } from "./config/config.service.interface";
import { ConfigService } from "./config/config.service";
import { PrismaService } from "./db/prisma.service";
import { IUserRepository } from "./user/repository/user.repository.interface";
import { UserRepository } from "./user/repository/user.repository";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

interface IMainReturn {
	app: App;
	appContainer: Container;
}

function main(): IMainReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	void app.init();

	return { app, appContainer };
}

const { app, appContainer } = main();

export { app, appContainer };
