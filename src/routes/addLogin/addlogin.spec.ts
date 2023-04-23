import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { validToken } from "../../test/variaveis";
import { LoginService } from "../../models/login/login.service";
import { LoginController } from "./login.controller";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../database/prisma.service";

describe("LoginController (e2e)", () => {
  let app: INestApplication;
  let loginController: LoginController;
  let loginService: LoginService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [LoginService, PrismaService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the JwtAuthGuard to always return true
      .compile();

    const prismaServiceMock = {
      removeUserTest: jest.fn(),
    };

    loginController = moduleFixture.get<LoginController>(LoginController);
    loginService = moduleFixture.get<LoginService>(LoginService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should create a new user with valid data", async () => {
    jest.spyOn(loginService, "findByLogin");

    // Arrange
    const addLoginDto = {
      login: "757.688.440-15",
      password: "password123",
      email: "user@example.com",
      // telefone: "12982971725"
    };

    // Act
    const response = await request(app.getHttpServer())
      .post("/login")
      .set("x-access-token", validToken)
      .send(addLoginDto);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      `Usuário ${addLoginDto.email} criado com sucesso!`
    );

    await loginService.removeUserTest(addLoginDto);
  });

  // Add test cases here
});
