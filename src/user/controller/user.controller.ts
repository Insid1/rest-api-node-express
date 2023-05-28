import { BaseController } from "../../common/base-controller";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../error/http.error";
import { inject, injectable } from "inversify";
import { ILogger } from "../../logger/logger.interface";
import "reflect-metadata";
import { TYPES } from "../../types";
import { IUserController } from "./user.controller.interface";
import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";
import { IUserService } from "../service/user.service.interface";
import { ValidateMiddleware } from "../../common/validate.middleware";
import { sign } from "jsonwebtoken";
import { IConfigService } from "../../config/config.service.interface";
import { AuthGuard } from "../../common/auth.guard";
import IJWTUser = Express.IJWTUser;

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.LoggerService) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: "/login",
				method: "post",
				// eslint-disable-next-line @typescript-eslint/unbound-method
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: "/register",
				method: "post",
				// eslint-disable-next-line @typescript-eslint/unbound-method
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: "/info",
				method: "get",
				// eslint-disable-next-line @typescript-eslint/unbound-method
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		const user = req.user as IJWTUser;

		const userModel = await this.userService.getUserByEmail(user.email);
		if (!userModel) {
			res.sendStatus(404);
			return;
		}

		const { email, name, id } = userModel;

		this.send(res, 200, { id, email, name });
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.userService.validateUser(body);
		if (!isValid) {
			return next(new HttpError(400, "invalid data provided"));
		}

		const JWTSecret = this.configService.get("JWT_SECRET");
		const accessToken = await this.signJWT(body.email, JWTSecret);

		this.ok(res, { accessToken });
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
		const { email, id } = result;

		this.ok(res, { email, id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now()) / 1000 },
				secret,
				{ algorithm: "HS256" },
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				},
			);
		});
	}
}
