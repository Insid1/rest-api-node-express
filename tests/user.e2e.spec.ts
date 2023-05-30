import { App } from "../src/app";
import { appData } from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async () => {
	const { app } = await appData;
	application = app;
});

describe("users e2e", () => {
	it("should not register user without all fields provided", async () => {
		const res = await request(application.app).post("/user/register").send({
			email: "a@a.ru",
			password: "1",
		});
		expect(res.statusCode).toBe(422);
	});

	it.skip("should register user", async () => {
		const res = await request(application.app).post("/user/register").send({
			email: "a@a.ru",
			name: "test",
			password: "1",
		});
		expect(res.statusCode).toBe(200);
	});

	let token: string;
	// на логин
	it("should login to existing account", async () => {
		const res = await request(application.app).post("/user/login").send({
			email: "a@a.ru",
			password: "1",
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		expect(res?.body?.accessToken).toBeTruthy();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
		token = res?.body?.accessToken;
		expect(res.statusCode).toBe(200);
	});
	it("should not login to unexisting account", async () => {
		const res = await request(application.app).post("/user/login").send({
			email: "a2112312@123213a.ru",
			password: "1",
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		expect(res?.body.accessToken).toBeFalsy();
		expect(res.statusCode).toBe(400);
	});
	it("should not login to with incorrect data", async () => {
		const res = await request(application.app).post("/user/login").send({
			email: "a@a.ru",
			password: "123",
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		expect(res?.body?.accessToken).toBeFalsy();
		expect(res.statusCode).toBe(400);
	});

	// на получение информации
	it("should provide user data if token passed", async () => {
		const res = await request(application.app)
			.get("/user/info")
			.set({ Authorization: `Bearer ${token}` });
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		expect(res?.body.email).toBe("a@a.ru");
		expect(res.statusCode).toBe(200);
	});
	it("should not provide data if token not passed", async () => {
		const res = await request(application.app).get("/user/info");
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		expect(res?.body).toStrictEqual({});
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
