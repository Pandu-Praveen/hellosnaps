import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { user } from "../types/globals.js";
import HttpError from "../utils/HttpError.js";

export const isAuthenticated = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const accessToken = req.cookies.accessToken;
    // console.log(accessToken);
    if (!accessToken) {
      throw new HttpError(401, "Authentication Required");
    }
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = JSON.parse(JSON.stringify(decoded))["user"] as user;
    // console.log("🚀 ~ return ~ req.user:", req.user);
    // req.user = {
    //   username: "pandu",
    //   id: "Hq3UWiw05jTsjhI_igy7h",
    //   name: "Praveen S",
    //   email: "pandukrjp1119@gmail.com",
    //   emailVerified: false,
    //   phone: "null",
    //   role: "user",
    //   last_sign_in: new Date("2024-08-09T08:33:43.776Z"),
    // };
    next();
  };
};
