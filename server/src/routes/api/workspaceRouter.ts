import express from "express";
import {
  analyzeWorkspace,
  createWorkSpace,
  deleteWorkspaceById,
  getUserWorkSpaces,
  getUserWorkspaceById,
  getSharedWorkSpace,
  setSharedemail,
} from "../../controllers/WorkSpaceControllers.js";
import { isAuthenticated } from "../../config/middlewares.js";

const router = express.Router();

router.use(isAuthenticated());

router.post("/", createWorkSpace);
router.get("/", getUserWorkSpaces);
router.get("/:id", getUserWorkspaceById);
router.delete("/:id", deleteWorkspaceById);
router.post("/:id/analyze", analyzeWorkspace);
router.post("/shared",getSharedWorkSpace)
router.post("/:id/sharedemail",setSharedemail)
export default router;
