import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { validToken } from "../../test/variaveis";
import { LoginService } from "../../models/login/login.service";
import { PasswordController } from "./password.controller";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../database/prisma.service"; // Import the PrismaModule

describe("PasswordController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PasswordController],
      providers: [
        LoginService,
        PrismaService, // Add the PrismaService to the providers array
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the JwtAuthGuard to always return true
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should change the password with valid data", async () => {
    // Arrange
    const newPassword = {
      newPassword: "123",
    };

    // Act
    const response = await request(app.getHttpServer())
      .post("/password")
      .set("x-access-token", validToken)
      .send(newPassword);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Senha atualizada com sucesso!");
  });

  // Add more test cases here
});
