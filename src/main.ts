import { App } from "./app";
import { LoggerService } from "./logger/logger.service";
import { UserController } from "./user/controller/user.controller";
import { ExceptionFilter } from "./error/exception.filter";
import { Container, ContainerModule, interfaces } from "inversify";
import { ILogger } from "./logger/logger.interface";
import { IExceptionFilter } from "./error/exception.filter.interface";
import { TYPES } from "./types";
import { IUserController } from "./user/user.interface";
import { IUserService } from "./user/service/user.service.interface";
import { UserService } from "./user/service/user.service";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.LoggerService).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.Application).to(App);
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
