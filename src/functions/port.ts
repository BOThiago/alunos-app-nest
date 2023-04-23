require("dotenv").config();

export function getPort(): any {
  return process.env.APP_PORT;
}
