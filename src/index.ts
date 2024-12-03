import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { ContentModel, LinkModel, shareModel, UserModel } from "./db";
import { ExitStatus } from "typescript";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

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
        message: "Incorrect credentials",
      });
    }
  } else {
    res.status(403).json({
      message: "User not found",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });
  res.json({
    message: "Content added",
  });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content",userMiddleware,async (req, res) => {
  const contentId = req.body.contentId;
  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId : req.userId
  })
  res.json({
    message: "Deleted"
  })
});
app.post("/api/v1/share", userMiddleware,async(req, res) => {
  const shareableLink = req.body.shareableLink;
  if(shareableLink) {
    LinkModel.create({
      userId = req.userId,
      hash:random(10)
    })
  }
  else{
    LinkModel.deleteOne({
      userId = req.userId
    });
  }
  res.json({
    msg:"updated shareable Link"
  })
});
app.get("/api/v1/share",userMiddleware,async (req, res) => {
  const {contentId, shareId} = req.body;
  await shareModel.find({
    shareId,
    //@ts-ignore
    userId: req.UserId

  })
  res.json({
    shareId as String
  })
});
app.listen(3000);
