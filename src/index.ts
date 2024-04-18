import express from "express";
import "express-async-errors";
import cors from "cors";

import { PORT } from "./env";
import { handleError } from "./middleware/handleError";

import { router as routerAuth } from "./router/auth";
import { router as routerGame } from "./router/game";
import { router as routerProgress } from "./router/progress";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", routerAuth);
app.use("/api/v1", routerGame);
app.use("/api/v1", routerProgress);
app.use(handleError);

const port = PORT || 3000;

app.listen(port, () => console.log(`Aplication running in port ${port}`));
