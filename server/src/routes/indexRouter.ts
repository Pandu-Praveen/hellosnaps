import express from "express";
import adminIndexRouter from "./admin/admin-index.js";
import apiIndexRouter from "./api/api-index.js";
import authRouter from "./api/authRouter.js";
import workSpaceRouter from "./api/workspaceRouter.js";
const router = express.Router();

router.use("/admin", adminIndexRouter);
router.use("/api", apiIndexRouter);
router.use("/auth", authRouter);
router.use("/workspaces", workSpaceRouter);
router.use("/sharedworkspace", workSpaceRouter);
router.get("/", (_req, res) => {
  res.render("index");
});

export default router;
