import express from "express";
import authRouter from "./authRouter.js";
import workspaceRouter from "./workspaceRouter.js";
import mediaRouter from "./mediaRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/workspaces", workspaceRouter);
router.use("/media", mediaRouter);

export default router;