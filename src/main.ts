import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExceptionFilter} from "./error/exception.filter";

const main = async () => {
  const logger = new LoggerService();
  const exceptionFilter = new ExceptionFilter(logger);
  const userController = new UserController(logger);
  const app = new App(7070, logger, userController, exceptionFilter);
  await app.init();
}

main()
