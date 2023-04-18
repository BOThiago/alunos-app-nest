import { Injectable } from "@nestjs/common";
import { getPort } from "./functions/port";

@Injectable()
export class AppService {
  getHello(): string {
    return `API Runing on port ${getPort()}!`;
  }
}
