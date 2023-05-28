import { IUserService } from "./user.service.interface";
import { User } from "../user.entity";
import { UserRegisterDto } from "../dto/user-register.dto";
import { UserLoginDto } from "../dto/user-login.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IConfigService } from "../../config/config.service.interface";

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const user = new User(dto.email, dto.name);

		const salt = this.configService.get("SALT");

		await user.setPassword(dto.password, Number(salt));
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return false;
	}
}
