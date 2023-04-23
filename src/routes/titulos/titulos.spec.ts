import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { validToken } from "../../test/variaveis";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { TituloController } from "../../models/titulos/titulo.controller";
import { PrismaService } from "../../database/prisma.service";
import { TitulosController } from "./titulos.controller";
import { AuthService } from "../../auth/auth.service";
import { LoginService } from "../../models/login/login.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../../auth/constants";

describe("TituloController (e2e)", () => {
  let app: INestApplication;
  let tituloController: TituloController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TitulosController],
      providers: [
        TituloController,
        PrismaService,
        AuthService,
        LoginService,
        JwtService,
      ],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: "60s" },
        }),
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mock the JwtAuthGuard to always return true
      .compile();

    const prismaServiceMock = {
      deleteTituloForTests: jest.fn(),
    };

    tituloController = moduleFixture.get<TituloController>(TituloController);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should find many titles", async () => {
    const response = await request(app.getHttpServer())
      .get("/titulos")
      .set("x-access-token", validToken);

    expect(response.status).toBe(200);
  });

  it("should create a title with valid data", async () => {
    jest.spyOn(tituloController, "createTitulos");

    const createTituloDto = {
      valor: 700.0,
      data_vencimento: "2023-03-29T16:30:00Z",
      boleto_codigo: "1234567890",
      boleto_url: "https://exemplo.com/boleto/1234567890",
      curso: "Ciência da Computação",
      favorecido: "Universidade XYZ",
      pix_codigo: "abcd1234",
      pix_url: "https://exemplo.com/pix/abcd1234",
      situacao: "pago",
      senha: "abc123",
      login_id: 13,
      external_code: "teste",
    };

    const response = await request(app.getHttpServer())
      .post("/titulos")
      .set("x-access-token", validToken)
      .send(createTituloDto);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Título adicionado com sucesso!");

    await tituloController.deleteTituloForTests(createTituloDto.external_code);
  });

  // Add more Titulos tests cases here
});
