import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { user } from "../types/globals.js";
import HttpError from "../utils/HttpError.js";

export const isAuthenticated = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const JWT_SECRET = process.env.JWT_SECRET || "";
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new HttpError(401, "Authentication Required");
    }
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = JSON.parse(JSON.stringify(decoded))["user"] as user;
    next();
  };
};
