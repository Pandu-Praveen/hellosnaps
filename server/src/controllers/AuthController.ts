import { Request, Response } from "express";
import bp from "../utils/bigPromise.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../models/UserModel.js";
import Tokens from "../models/TokensModel.js";
import { NOW, Op } from "sequelize";
import HttpError from "../utils/HttpError.js";
import { user } from "../types/globals.js";
import cloudinary from "../config/cloudinary.js";
import { slugify } from "../utils/misc.js";

const { JWT_SECRET } = process.env;

export const Signup = bp(async (req: Request, res: Response) => {
  console.log("gotsign");
  const { name, email, password } = req.body;
  console.log(name, email);
  const userExist = await User.findOne({
    where: { email },
  });
  if (userExist) {
    throw new HttpError(400, "User Already Exists");
  }
  const user = await User.create({ name, email, password });
  cloudinary.api
    .create_folder(
      `hellosnaps/images/${user.dataValues.id}-${slugify(user.dataValues.name)}`,
    )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  res.status(201).json({ user });
});

export const Login = bp(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: { include: ["password"] },
  });

  if (!user) {
    throw new HttpError(404, "User Doesn't Exist");
  }

  if (bcrypt.compareSync(password, (user.get("password") as string) || "")) {
    await user.update({ last_sign_in: new Date() });
    const thisUser: user = user?.toJSON() as user;
    delete thisUser.password;
    const refreshToken = await Tokens.create({
      user: thisUser.id,
      tokenType: "refresh",
      tokenValue: nanoid(64),
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365), // 1 year
    });

    const accessToken = jwt.sign({ user: thisUser }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60, // 1 Hour
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken.get("tokenValue"), {
      expires: refreshToken.get("expiresAt") as Date,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ user: thisUser, refreshToken, accessToken });
  } else {
    throw new HttpError(401, "User or Password doesn't match");
  }
  const refreshTokens = await Tokens.findAll({
    where: { user: user.get("id"), tokenType: "refresh" },
    order: ["createdAt"],
  });
  if (refreshTokens.length === 5) {
    await refreshTokens[0].destroy();
  }
});

export const Logout = (_req: Request, res: Response) => {
  // Todo : Invalidate Refresh Token
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure: true,
  });
  res.clearCookie("refreshToken", {
    sameSite: "none",
    secure: true,
  });
  res.json({
    message: "Logged Out Successfully",
  });
};

export const Refresh = bp(async (req: Request, res: Response) => {
  const tokenValue = req.cookies.refreshToken || req.body.refreshToken;
  if (!tokenValue) {
    throw new HttpError(401, "No Refresh Token");
  }
  const refreshToken = await Tokens.findOne({
    where: { tokenValue },
    include: [{ model: User }],
  });
  if (!refreshToken || (refreshToken.get("expiresAt") as Date) < new Date()) {
    throw new HttpError(401, "Refresh Token Expired");
  }
  const user = refreshToken.get("User");
  const accessToken = jwt.sign({ user }, JWT_SECRET as string, {
    expiresIn: "1h",
  });

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60, // 1 Hour
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", refreshToken.get("tokenValue"), {
    expires: refreshToken.get("expiresAt") as Date,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ user, refreshToken, accessToken });
});

export const Status = (req: Request, res: Response) => {
  res.json({ user: req.user });
};

export const ForgotPassword = bp(async (req: Request, res: Response) => {
  const { login } = req.body;
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: login }, { username: login }],
    },
    attributes: { include: ["password"] },
  });
  if (!user) {
    throw new HttpError(404, "User Doesn't Exist");
  }
  const forgotPasswordToken = await Tokens.findOrCreate({
    where: {
      user: user.get("id"),
      tokenType: "forgot",
      expiresAt: {
        [Op.gt]: NOW(),
      },
    },
    defaults: {
      tokenValue: nanoid(64),
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 15).toUTCString(),
    },
  });
  if ((forgotPasswordToken[0].get("expiresAt") as Date) < new Date()) {
    forgotPasswordToken[0].set(
      "expiresAt",
      new Date(new Date().getTime() + 1000 * 60 * 15),
    );
  }
  console.log(forgotPasswordToken);
  res.status(200).json({ message: "Check Your Email For The Link " });
});

export const ResetPassword = bp(async (req: Request, res: Response) => {
  const tokenValue = req.query.token;
  const { password } = req.body;
  const forgotPasswordToken = await Tokens.findOne({ where: { tokenValue } });
  if (
    !forgotPasswordToken ||
    (forgotPasswordToken.get("expiresAt") as Date) < new Date()
  ) {
    throw new HttpError(401, "Invalid Token or Token Expired");
  }
  const user = await User.findOne({
    where: { id: forgotPasswordToken.get("user") },
  });
  if (!user) {
    throw new HttpError(500, "Some Error Occured");
  }
  await user.update({ password });
  await forgotPasswordToken.destroy();
  res.status(200).json({ message: "Password Reset Successful" });
});

// TODO: CRON Everyday to Purge all Expired Tokens
