import express from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./router";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

const port = process.env.PORT;

app.listen(port, () => console.log("Aplication running in port 3000"));
