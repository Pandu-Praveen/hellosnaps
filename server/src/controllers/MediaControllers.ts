import { Request, Response } from "express";
import MediaModel from "../models/MediaModel.js";
import bp from "../utils/bigPromise.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/UserModel.js";
import { nanoid } from "nanoid";
import { slugify } from "../utils/misc.js";
import WorkSpaceModel from "../models/WorkSpaceModel.js";
import Readable from "stream";
import streamifier from "streamifier";

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    // handle file upload via cloudinary
    const id = await req.body.id;
    const workspace = req.body.workspaceId;
    const files = req.files;
    // console.log(id);
    const user = await User.findOne({
      where: { id },
    });
    const workspaceName = await WorkSpaceModel.findOne({
      where: { id: workspace },
    });
    const userName = slugify(user?.dataValues.name);
    const userId = user?.dataValues.id;

    const cloudinaryFolderPath = `hellosnaps/images/${userName}-${userId}/${workspaceName?.dataValues.name}`;
    console.log(cloudinaryFolderPath);

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    for (const file of files) {
      console.log(file);

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: cloudinaryFolderPath },
        async (error, result) => {
          if (error) {
            console.error("Upload to Cloudinary failed:", error);
            return res
              .status(500)
              .json({ error: "Failed to upload file to Cloudinary." });
          }
          console.log("Upload result:", result);
          const filePath = `${workspace}/${file.originalname}`;
          await MediaModel.create({
            id: nanoid(),
            workspace,
            filePath: result?.secure_url,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  const { filePath } = req.body;

  try {
    // Extract the public ID from the filePath
    const publicId = filePath.split("/").slice(-5).join("/").split(".")[0];
    console.log(publicId, filePath);

    // Delete the image from Cloudinary
    cloudinary.api.delete_resources(publicId).then(console.log);

    // Delete the image entry from the database
    await MediaModel.destroy({
      where: {
        filePath: filePath,
      },
    });

    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Failed to delete photo", error });
  }
};

export const uploadTags = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    console.log("🚀 ~ uploadTags ~ workspaceId:", workspaceId);

    const META_DATA = req.body;
    console.log("🚀 ~ uploadTags ~ META_DATA:", META_DATA);
    const media = await MediaModel.findAll({
      where: {
        workspace: workspaceId,
      },
    });
    console.log("🚀 ~ uploadTags ~ media:", media);
    // const tags = [];
    for (const key of media) {
      const uniqueImagePath = key.dataValues.filePath
        .split("/")
        .at(-1)
        .split(".")
        .at(0);

      const totalTags = [];
      for (const tags in META_DATA) {
        const itrTags = META_DATA[tags];
        console.log(tags);
        for (const tag of itrTags) {
          console.log(tag, uniqueImagePath);
          const val = tag.split("/").at(-1);
          console.log("🚀 ~ uploadTags ~ val:", val);

          if (val == uniqueImagePath) {
            totalTags.push(tags);
            break;
          }
        }
      }
      await key.update({ tags: totalTags });
      console.log(totalTags);
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating tags.",
    });
  }
};
