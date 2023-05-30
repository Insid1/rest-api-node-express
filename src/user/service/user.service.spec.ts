import "reflect-metadata";
import { Container } from "inversify";
import { IConfigService } from "../../config/config.service.interface";
import { IUserRepository } from "../repository/user.repository.interface";
import { IUserService } from "./user.service.interface";
import { TYPES } from "../../types";
import { UserService } from "./user.service";
import { User } from "../user.entity";
import { UserModel } from "@prisma/client";

const configServiceMock: IConfigService = {
	get: jest.fn(),
};
const userRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(configServiceMock);
	container
		.bind<IUserRepository>(TYPES.UserRepository)
		.toConstantValue(userRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	userRepository = container.get<IUserRepository>(TYPES.UserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

describe("User service", () => {
	it("create user ", async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		userRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				id: 1,
				email: user.email,
				name: user.name,
				password: user.password,
			};
		});
		const createdUser = await userService.createUser({
			email: " test@test.com",
			name: "name",
			password: "123",
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual("123");
	});

	it("Should validate user successfully", async () => {
		userRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				id: 1,
				email: user.email,
				name: user.name,
				password: user.password,
			};
		});
		const createdUser = await userService.createUser({
			email: "test@test.com",
			name: "name",
			password: "123",
		});

		configService.get = jest.fn().mockReturnValueOnce(1);
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const validUser = await userService.validateUser({
			email: "test@test.com",
			password: "123",
		});

		expect(validUser).toBeTruthy();
	});
	it("should do not validate user due to error in password", async () => {
		userRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
			return {
				id: 1,
				email: user.email,
				name: user.name,
				password: user.password,
			};
		});
		const createdUser = await userService.createUser({
			email: "test@test.com",
			name: "name",
			password: "000",
		});

		configService.get = jest.fn().mockReturnValueOnce(1);
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const validUser = await userService.validateUser({
			email: "test@test.com",
			password: "123",
		});

		expect(validUser).toBeFalsy();
	});
	it("should do not validate user due to unexciting user", async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		userRepository.find = jest.fn().mockReturnValueOnce(null);

		const validUser = await userService.validateUser({
			email: "test@test.com",
			password: "123",
		});

		expect(validUser).toBeFalsy();
	});
});
