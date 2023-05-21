import express, {Express} from "express";
import {Server} from "http"
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";

export class App {
  port: number;
  app: Express;
  server: Server;
  logger: LoggerService;
  userController: UserController;

  constructor(port = 7070, logger: LoggerService) {
    this.app = express();
    this.logger = logger;
    this.port = port;
    this.userController = new UserController(logger);

  }

  useRoutes() {
    this.app.use("/user", this.userController.getRouter());
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port)
    this.logger.log(`Server started on port ${this.port}. GO to http://localhost:${this.port}`)

  }
}
