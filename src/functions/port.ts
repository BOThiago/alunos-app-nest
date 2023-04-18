require("dotenv").config();

export function getPort(): any {
  return process.env.PORTenv;
}
