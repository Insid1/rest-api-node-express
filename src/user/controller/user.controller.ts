import { BaseController } from "../../common/base-controller";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../error/http.error";
import { inject, injectable } from "inversify";
import { ILogger } from "../../logger/logger.interface";
import "reflect-metadata";
import { TYPES } from "../../types";
import { IUserController } from "../user.interface";
import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";
import { IUserService } from "../service/user.service.interface";
import { ValidateMiddleware } from "../../common/validate.middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: "/login",
				method: "post",
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: "/register",
				method: "post",
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		console.log(req.body);
		throw new HttpError(401, "not authorized");
		// this.ok(res, "login!")
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, "user already exists"));
		}

		this.ok(res, { email: result.email });
	}
}
