import express from "express";
import { addMedia } from "../../controllers/MediaControllers.js";

const router = express.Router();

router.post("/", addMedia);

export default router;