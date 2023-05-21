import {BaseController} from "../common/base-controller";
import {NextFunction, Request, Response} from "express";

export interface IUserController extends BaseController {

  login(req: Request, res: Response, next: NextFunction): void

  register(req: Request, res: Response, next: NextFunction): void

}
