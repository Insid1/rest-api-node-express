import { IUserService } from "./user.service.interface";
import { User } from "../user.entity";
import { UserRegisterDto } from "../dto/user-register.dto";
import { UserLoginDto } from "../dto/user-login.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { IConfigService } from "../../config/config.service.interface";
import { IUserRepository } from "../repository/user.repository.interface";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}

	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const user = new User(dto.email, dto.name);

		const salt = this.configService.get("SALT");

		const existingUser = await this.userRepository.find(user.email);

		if (existingUser) return null;

		await user.setPassword(dto.password, Number(salt));
		return this.userRepository.create(user);
	}

	async validateUser(dto: UserLoginDto): Promise<UserModel | null> {
		const userModel = await this.userRepository.find(dto.email);
		const salt = this.configService.get("SALT");
		const JWTSecret = this.configService.get("JWT_SECRET");

		if (!userModel) return null;

		const user = new User(userModel.email, userModel.name, userModel.password);
		const isPasswordCorrect = await user.checkPassword(dto.password);

		if (!isPasswordCorrect) return null;

		return userModel;
	}

	async getUserByEmail(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
