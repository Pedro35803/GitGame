import express from "express";
import "express-async-errors";
import cors from "cors";

import { PORT } from "./env";
import { router } from "./router";
import { handleError } from "./middleware/handleError";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);
app.use(handleError);

const port = PORT || 3000;

app.listen(port, () => console.log(`Aplication running in port ${port}`));
