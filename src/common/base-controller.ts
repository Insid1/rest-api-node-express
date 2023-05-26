import "reflect-metadata";
import { Response, Router } from "express";
import { IRoute } from "./route.interface";
import { ILogger } from "../logger/logger.interface";
import { injectable } from "inversify";

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	getRouter(): Router {
		return this._router;
	}

	public created(res: Response): ReturnType<typeof res.sendStatus> {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): ReturnType<typeof res.json> {
		res.status(code);
		return res.json(message);
	}

	public ok<T>(res: Response, message: T): ReturnType<typeof res.json> {
		return res.status(200).json(message);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const handler = route.func.bind(this); // to keep context
			const middleware = route.middlewares?.map((m) => m.execute.bind(this)); // to keep context
			const pipe = middleware ? [...middleware, handler] : [handler];
			console.log(pipe);
			this._router[route.method](route.path, pipe);
		}
	}
}
