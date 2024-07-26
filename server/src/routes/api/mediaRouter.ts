import express from "express";
import { uploadFiles, deleteFile } from "../../controllers/MediaControllers.js";
// import cloudinary from "../../config/cloudinary.js";
import multer from "multer";
const router = express.Router();
const decoder = multer({ storage: multer.memoryStorage() });

/** Temporary testing enmpodints */
// router.get("/create-dolfer", (req, res) => {
//   cloudinary.api
//     .create_folder("/jummaa")
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));
//   res.send("ok");
// });
router.post("/:id/upload", decoder.array("fi"), uploadFiles);
router.post("/delete", deleteFile);
export default router;
