import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const {
  PUBLIC_CLOUDINARY_CLOUD_NAME,
  PUBLIC_CLOUDINARY_API_KEY,
  PUBLIC_CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: PUBLIC_CLOUDINARY_API_KEY,
  api_secret: PUBLIC_CLOUDINARY_API_SECRET,
});

export const getWorkspacePhotos = async (workspaceID: string) => {
  const response = await cloudinary.api.resources_by_asset_folder(workspaceID);
  return response.resources;
};

export default cloudinary;
