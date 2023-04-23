import jwt from "jsonwebtoken";
import { getSecretKey } from "../functions/key";

export function verifyJWT(req: any, res: any, next: any) {
  const token = req.headers["x-access-token"];
  const tokenString = Array.isArray(token) ? token.join(",") : token || "";

  jwt.verify(tokenString, getSecretKey(), (err: any, decoded: any) => {
    if (err) return res.status(401).end();
    res.locals.userID = decoded.userID;
    res.locals.guid = decoded.guid;
    res.locals.login = decoded.login;
    res.locals.ies = decoded.ies;
    next();
  });
}
