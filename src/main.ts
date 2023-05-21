import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExceptionFilter} from "./error/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface";
import {IExceptionFilter} from "./error/exception.filter.interface";
import {TYPES} from "./types";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILoggerService).to(LoggerService)
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
  bind<UserController>(TYPES.UserController).to(UserController)
  bind<App>(TYPES.Application).to(App)
})

function main() {
  const appContainer = new Container();
  appContainer.load(appBindings)

  const app = appContainer.get<App>(TYPES.Application)
  app.init();

  return {app, appContainer}
}

const {app, appContainer} = main();


export {app, appContainer}
