import "reflect-metadata"
import {Response} from "express"
import {Router} from "express"
import {IRoute} from "./route.interface";
import {ILogger} from "../logger/logger.interface";
import {injectable} from "inversify";

@injectable()
export abstract class BaseController {
  private readonly _router: Router

  constructor(private logger: ILogger) {
    this._router = Router();
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
