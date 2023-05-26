import { IUserService } from "./user.service.interface";
import { User } from "../user.entity";
import { UserRegisterDto } from "../dto/user-register.dto";
import { UserLoginDto } from "../dto/user-login.dto";
import { injectable } from "inversify";

@injectable()
export class UserService implements IUserService {
	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const user = new User(dto.email, dto.name);
		await user.setPassword(dto.password);
		// проверка на то, что он есть, если есть - ошибка
		// если нету - создаем и возвращаем пользователя
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return false;
	}
}
