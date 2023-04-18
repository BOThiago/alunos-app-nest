import * as dotenv from 'dotenv';
dotenv.config();

export function getSecretKey(): any {
  const KEYSECRET = process.env.KEYSECRET;
  if (!KEYSECRET) {
    throw new Error('Chave secreta não definida na variável de ambiente!');
  }
  return KEYSECRET;
}

export function getAccessToken(): any {
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    throw new Error('ACCESS_TOKEN não definido');
  }
  return ACCESS_TOKEN;
}
