import { Request, Response } from "express";
import MediaModel from "../models/MediaModel.js";
import bp from "../utils/bigPromise.js";
import { nanoid } from "nanoid";

export const addMedia = bp(async (req: Request, res: Response) => {
  const { workspace, filePath } = req.body;
  const media = await MediaModel.create({
    id: nanoid(),
    workspace,
    filePath,
  });
  res.status(201).json({ media });
});
