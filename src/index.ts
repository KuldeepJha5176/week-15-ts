import express, { json } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { ContentModel, LinkModel,  UserModel } from "./db";

import dotenv, { config, configDotenv } from 'dotenv';
dotenv.config();

import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const corsOptions = {
  origin: ['http://localhost:517', 'https://your-frontend-domain.com'], // Replace with your frontend's domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // If you need to send cookies or credentials
};

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
        if (!process.env.jwt_secret) {
            throw new Error("JWT_PASSWORD is not defined in the environment variables");
        }

        const token = jwt.sign(
            {
                id: existingUser._id, // Payload
            },
            process.env.jwt_secret, // Secret key
            {
                expiresIn: '1h', // Optional: Set token expiration
            }
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
    title: req.body.title,
    userId: req.userId,
    tags: []
  });
  res.json({
    message: "Content added",
  });
});
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  
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
    
    userId : req.userId
  })
  res.json({
    message: "Deleted"
  })
});
app.post("/api/v1/share", userMiddleware,async(req, res) => {
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
        userId: req.userId
    });

    if (existingLink) {
        res.json({
            hash: existingLink.hash
        })
        return;
    }
    const hash = random(10);
    await LinkModel.create({
        userId: req.userId,
        hash: hash
    })

    res.json({
        hash
    })
} else {
await LinkModel.deleteOne({
    userId: req.userId
});

res.json({
    message: "Removed link"
})
}
})
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
      hash
  });

  if (!link) {
      res.status(411).json({
          message: "Sorry incorrect input"
      })
      return;
  }
  // userId
  const content = await ContentModel.find({
      userId: link.userId
  })

  console.log(link);
  const user = await UserModel.findOne({
      _id: link.userId
  })

  if (!user) {
      res.status(411).json({
          message: "user not found, error should ideally not happen"
      })
      return;
  }

  res.json({
      username: user.username,
      content: content
  })

})
app.listen(3000);
