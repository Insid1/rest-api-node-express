import {LoggerService} from "../logger/logger.service";
import {Response} from "express"
import {Router} from "express"
import {IRoute} from "./route.interface";

export abstract class BaseController {
  private readonly _router: Router
  logger: LoggerService

  protected constructor(logger: LoggerService) {
    this._router = Router();
    this.logger = logger;
  }

  getRouter(): Router {
    return this._router;
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public send<T>(res: Response, code: number, message: T) {
    res.status(code);
    return res.json(message);
  }

  public ok<T>(res: Response, message: T) {
    return res.status(200).json(message);
  }

  protected bindRoutes(routes: IRoute[]) {

    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      const handler = route.func.bind(this); // to keep context
      this._router[route.method](route.path, handler);
    }
  }


}
