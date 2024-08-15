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
  console.log(1);
  // console.log(id, req.user.name, req.user.id, workspace.dataValues);

  const workspaceimages = await MediaModel.findAll({
    where: { workspace: id },
  });
  console.log(1);
  if (workspace.dataValues.tags) {
    for (const tag of workspace.dataValues.tags) {
      console.log(
        "current",
        `${workspaceimages[0].dataValues.filePath.split("/").slice(-5, -1).join("/").split(".")[0]}/Unique_Faces/${tag}`,
        "end",
      );
      const publicId = `${workspaceimages[0].dataValues.filePath.split("/").slice(-5, -1).join("/").split(".")[0]}/Unique_Faces/${tag}`;
      try {
        await cloudinary.api.delete_resources([publicId]).then(console.log);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("Successfully completed");
      }
    }
  } else {
    console.log("NO Tags Found!!!");
  }
  console.log(1);
  for (const media of workspaceimages) {
    const filePath = media.dataValues.filePath;
    const publicId = filePath.split("/").slice(-5).join("/").split(".")[0];
    // Delete the image from Cloudinary
    await cloudinary.api.delete_resources(publicId).then(console.log);
    // Delete the image from database
    await MediaModel.destroy({
      where: {
        filePath: filePath,
      },
    });
  }
  await cloudinary.api
    .delete_folder(
      `hellosnaps/images/${slugify(req.user.name)}-${req.user.id}/${workspace.dataValues.name}`,
    )
    .then(console.log)
    .catch(console.log);

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
    // pySnap();
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

export const getSharedWorkSpace = bp(async (req: Request, res: Response) => {
  console.log(req.user.email);
  const sharedworkspaces = await WorkSpaceModel.findAll({
    where: {
      email: {
        [Op.contains]: [req.user.email],
      },
    },
    order: [["updatedAt", "desc"]],
    include: [{ model: MediaModel, attributes: ["id"] }],
  });
  console.log(sharedworkspaces);
  res.status(200).send(sharedworkspaces);
});

export const setSharedemail = bp(async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { emails } = req.body;

    // Validate the input
    if (
      !emails ||
      !Array.isArray(emails) ||
      !emails.every((email) => typeof email === "string")
    ) {
      return res.status(400).send({ message: "Invalid email list" });
    }

    // Find the workspace by ID
    const workspace = await WorkSpaceModel.findByPk(id);

    if (!workspace) {
      return res.status(404).send({ message: "Workspace not found" });
    }
    console.log(workspace);
    // Get the current email list or initialize as an empty array
    const currentEmails = workspace.dataValues.email || [];

    // Merge current emails with new emails and remove duplicates
    const updatedEmails = Array.from(new Set([...currentEmails, ...emails]));

    // Update the workspace's email,shared field
    await workspace.update({
      email: updatedEmails,
      shared: true,
    });
    console.log(workspace);

    res.status(200).send({ message: "Emails added successfully" });
  } catch (error) {
    console.error("Error updating workspace emails:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
