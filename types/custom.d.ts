declare namespace Express {
	import { JwtPayload } from "jsonwebtoken";
	export interface IJWTUser extends JwtPayload {
		email: string;
	}
	export interface Request {
		user?: IJWTUser;
	}
}
