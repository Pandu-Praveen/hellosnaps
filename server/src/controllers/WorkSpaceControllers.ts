import { Request, response, Response } from "express";
import bp from "../utils/bigPromise.js";
import WorkSpaceModel from "../models/WorkSpaceModel.js";
import { nanoid } from "nanoid";
import MediaModel from "../models/MediaModel.js";
import HttpError from "../utils/HttpError.js";
import QueueModel from "../models/QueueModel.js";
import { Op } from "sequelize";
import { pySnap } from "../utils/pysnap.js";
import cloudinary from "../config/cloudinary.js";
import { slugify } from "../utils/misc.js";

export const createWorkSpace = bp(async (req: Request, res: Response) => {
  const { name } = req.body;
  // console.log(name);
  cloudinary.api
    .create_folder(
      `hellosnaps/images/${slugify(req.user.name)}-${req.user.id}/${name}`,
    )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  const workspace = await WorkSpaceModel.create({
    id: nanoid(),
    name,
    owner: req.user.id,
  });
  res.status(201).json({ workspace });
});

export const getUserWorkSpaces = bp(async (req: Request, res: Response) => {
  const owner = req.user.id;
  const workspaces = await WorkSpaceModel.findAll({
    where: { owner },
    order: [["updatedAt", "desc"]],
    include: [{ model: MediaModel, attributes: ["id"] }],
  });
  res.status(200).json({ workspaces });
});

export const getUserWorkspaceById = bp(async (req: Request, res: Response) => {
  const id = req.params.id;
  const workspace = await WorkSpaceModel.findByPk(id, {
    include: [
      { model: MediaModel, order: [["filePath", "asc"]] },
      { model: QueueModel, order: [["updatedAt", "desc"]] },
    ],
  });
  res.status(200).json({ workspace });
});

export const deleteWorkspaceById = bp(async (req: Request, res: Response) => {
  const id = req.params.id;
  const workspace = await WorkSpaceModel.findByPk(id);
  if (!workspace) {
    throw new HttpError(404, "Workspace Not Found");
  }
  // console.log(id,req.user.name,req.user.id,workspace.dataValues.name);
  
  const workspaceimages = await MediaModel.findAll({
    where: { workspace:id },
  });
  // console.log(workspaceimages)
  for (const media of workspaceimages) {
    const filePath = media.dataValues.filePath;
    const publicId = filePath.split("/").slice(-5).join("/").split(".")[0];
    // Delete the image from Cloudinary
    cloudinary.api.delete_resources(publicId).then(console.log);
    // Delete the image from database
    await MediaModel.destroy({
      where: {
        filePath: filePath,
      },
    });
  }
  cloudinary.api
  .delete_folder(`hellosnaps/images/${slugify(req.user.name)}-${req.user.id}/${workspace.dataValues.name}`)
  .then(console.log)
  .catch(console.log)

  // if (await deleteS3Folder(id)) {
  //   const workspace = await WorkSpaceModel.findByPk(id);
  //   if (!workspace) {
  //     throw new HttpError(404, "Workspace Not Found");
  //   }
  // await workspace.destroy();
  //   res.status(204).send();
  // }


  await workspace.destroy();
  res.send("pass " + id);
});

export const analyzeWorkspace = bp(async (req: Request, res: Response) => {
  const workspace = req.params.id;
  const isEnqueued = await QueueModel.findOne({
    where: { workspace, status: { [Op.or]: ["queued", "running"] } },
  });

  if (isEnqueued) {
    pySnap();
    throw new HttpError(400, "Already in Queue");
  }

  const status = await QueueModel.create({
    workspace,
    status: "queued",
    user: req.user.id,
    response,
  });

  res.status(201).json({ status });
});
