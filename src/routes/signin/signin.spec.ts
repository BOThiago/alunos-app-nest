import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../app.module";
import {
  validLogin,
  invalidLogin,
  validPassword,
  invalidPassword,
} from "../../test/variaveis";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/signin (POST)", () => {
    it("should return a valid JWT token on successful authentication", async () => {
      const response = await request(app.getHttpServer())
        .post("/signin")
        .send({ login: validLogin, password: validPassword })
        .expect(HttpStatus.OK);

      // Verify the response contains a valid JWT token
      expect(response.body.acess_token);

      authToken = response.body.token;
    });

    it("should return an error message on failed authentication", async () => {
      const response = await request(app.getHttpServer())
        .post("/signin")
        .send({ login: invalidLogin, password: invalidPassword })
        .expect(HttpStatus.UNAUTHORIZED);

      // Verify the response contains an error message
      expect(response.body);
      expect(response.body).toEqual({
        message: "Usuário ou senha inválidos!",
      });
    });
  });
});
