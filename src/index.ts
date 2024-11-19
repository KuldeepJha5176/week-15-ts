import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { UserModel } from "./db";
import { ExitStatus } from "typescript";
import { JWT_PASSWORD } from "./config";

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
app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await UserModel.findOne({
    username,
    
  });

  if (existingUser && existingUser.password) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: existingUser._id,
        },
        JWT_PASSWORD
      );

      res.json({
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrrect credentials",
      });
    }
  } else {
    res.status(403).json({
      message: "User not found",
    });
  }
});

app.post("/api/v1/content", (req, res) => {});
app.get("/api/v1/content", (req, res) => {});
app.delete("/api/v1/content", (req, res) => {});
app.post("/api/v1/share", (req, res) => {});
app.get("/api/v1/share", (req, res) => {});
app.listen(3000);
