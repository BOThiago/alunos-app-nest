import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../app.module";
import request from "supertest";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import {
  validCic,
  validToken,
  invalidCic,
  validCicWithDontHaveTitulos,
} from "../../test/variaveis";

describe("BotController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  it("/GET /:cic", async () => {
    const response = await request(app.getHttpServer())
      .get(`/${validCic}/proximo_titulo`)
      .set("x-access-token", validToken)
      .expect(200);

    expect(response.body.títulos);
  });

  it("should return 404 when login not found", async () => {
    const response = await request(app.getHttpServer())
      .get(`/${invalidCic}/proximo_titulo`)
      .set("x-access-token", validToken)
      .expect(404);

    expect(response.body.erro).toBe(404);
    expect(response.body.cic).toBe(invalidCic);
    expect(response.body.mensagem).toBe("Aluno não encontrado");
  });

  it("should return 404 when no pending title found", async () => {
    const response = await request(app.getHttpServer())
      .get(`/${validCicWithDontHaveTitulos}/proximo_titulo`)
      .set("x-access-token", validToken)
      .expect(404);

    expect(response.body.cic).toBe(validCicWithDontHaveTitulos);
    expect(response.body.message).toBe("Titulo pendente não encontrado");
  });
});
