import {BaseController} from "../common/base-controller";
import {LoggerService} from "../logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {HttpError} from "../error/http.error";

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
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
