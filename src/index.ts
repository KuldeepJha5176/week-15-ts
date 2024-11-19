import express from "express";
import mongoose from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { UserModel } from "./db";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });
    res.json({
      msg: "User signed up",
    });
  } catch (e) {
    res.status(411).json({
      msg: "User already exists",
    });
  }
});
app.post("/api/v1/signin", (req, res) => {});
app.post("/api/v1/content", (req, res) => {});
app.get("/api/v1/content", (req, res) => {});
app.delete("/api/v1/content", (req, res) => {});
app.post("/api/v1/share", (req, res) => {});
app.get("/api/v1/share", (req, res) => {});
app.listen(3000);