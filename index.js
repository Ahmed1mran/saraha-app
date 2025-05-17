import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join("./src/config/.env.prod") });
import bootstrap from "./src/app.controller.js";
import express from "express";

const app = express();
const port = process.env.PORT || 3031;

bootstrap(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
