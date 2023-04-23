import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { validToken } from "../../test/variaveis";
import { TitulosPagosController } from "./titulos-pagos.controller";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { TituloController } from "../../models/titulos/titulo.controller"; // Import the TituloController
import { PrismaService } from "../../database/prisma.service"; // Import the PrismaService

describe("TitulosPagosController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TitulosPagosController],
      providers: [TituloController, PrismaService],
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

  it("should find paid titles", async () => {
    const response = await request(app.getHttpServer())
      .get("/pagos")
      .set("x-access-token", validToken);

    expect(response.status).toBe(200);
  });

  // Add more test cases here
});
