import express, {Express} from "express";
import {Server} from "http"
import {UserController} from "./user/user.controller";
import {ExceptionFilter} from "./error/exception.filter";
import {ILogger} from "./logger/logger.interface";

export class App {
  port: number;
  app: Express;
  server: Server;
  logger: ILogger;
  userController: UserController;
  exceptionFilter: ExceptionFilter;

  constructor(
    port = 7070,
    logger: ILogger,
    userController: UserController,
    exceptionFilter: ExceptionFilter
  ) {
    this.app = express();
    this.logger = logger;
    this.port = port;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;

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
    this.logger.log(`Server started on port ${this.port}. GO to http://localhost:${this.port}`);

  }
}
