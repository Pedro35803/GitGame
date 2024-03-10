import express from "express";

export const router = express.Router();

router.get("/hello", (req, res) => res.send("Hello World!"));
