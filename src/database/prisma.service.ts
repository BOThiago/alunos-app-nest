import { PrismaClient } from "@prisma/client";
import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      console.log("Erro ao estabelecer uma conexão com o banco de dados!");
      await app.close();
    });
  }
}
