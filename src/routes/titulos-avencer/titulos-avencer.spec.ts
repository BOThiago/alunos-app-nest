import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { validToken } from "../../test/variaveis";
import { TitulosAvencerController } from "./titulos-avencer.controller";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { TituloController } from "../../models/titulos/titulo.controller";
import { PrismaService } from "../../database/prisma.service";

describe("TitulosAvencerController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TitulosAvencerController],
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

  it("should find titles to expire", async () => {
    const response = await request(app.getHttpServer())
      .get("/vencer")
      .set("x-access-token", validToken);

    expect(response.status).toBe(200);
  });

  // Add more test cases here
});
