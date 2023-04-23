import morgan from "morgan";
import { logger } from "../functions/logger";

const stream = {
  // Use the http severity
  write: (message: string) => logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

morgan.token("login", function login(req, res) {
  return res.locals.login;
});

morgan.token("ies", function ies(req, res) {
  return res.locals.ies;
});

const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ":remote-addr :method :url :status :res[content-length] - :response-time ms :ies :login :user-agent",
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip }
);

morgan.token("login", function login(req, res) {
  return res.locals.login;
});

export default morganMiddleware;
