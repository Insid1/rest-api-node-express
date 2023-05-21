import {BaseController} from "../common/base-controller";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../error/http.error";
import {inject, injectable} from "inversify";
import {ILogger} from "../logger/logger.interface";
import "reflect-metadata"
import {TYPES} from "../types";

@injectable()
export class UserController extends BaseController {
  constructor(@inject(TYPES.ILoggerService) private loggerService: ILogger) {
    super(loggerService);

    this.bindRoutes([
        {
          path: "/login",
          method: "post",
          func: this.login,
        },
        {
          path: "/register",
          method: "post",
          func: this.register,
        },
      ]
    )
  }

  login(req: Request, res: Response, next: NextFunction) {
    throw new HttpError(401, "not authorized")
    // this.ok(res, "login!")
  }

  register(req: Request, res: Response, next: NextFunction) {
    throw new Error("ERROR register")
    // this.ok(res, "register!")
  }
}
