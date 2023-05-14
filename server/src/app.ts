import express from "express";
import config from "config";
import swaggerUi from "swagger-ui-express";
import log from "./logger";
import connect from "./db/connect";
import routes from "./routes";
import deserializeAttendee from "./middleware/deserializeUser";
import * as swggerDoc from "../swagger.json";

const port = Number(process.env.PORT) || config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use(deserializeAttendee);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swggerDoc)
);


app.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();

  routes(app);
});
