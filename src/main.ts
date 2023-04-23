import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { getPort } from "./functions/port";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import express from "express";
import morganMiddleware from "./middlewares/morgan";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
    }
  );

  app.use(morganMiddleware);
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.set("trust proxy", 1);

  const config = new DocumentBuilder()
    .setTitle("Alunos-app-nest")
    .setDescription("The alunos-app-nest API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.use("/pix", express.static("storage/pix"));
  app.use("/boleto", express.static("storage/pdf"));

  app.enableCors();
  await app.listen(getPort());
}
bootstrap();
