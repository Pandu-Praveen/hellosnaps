import express from "express";
import {
  ForgotPassword,
  Login,
  Logout,
  Refresh,
  ResetPassword,
  Signup,
  Status,
} from "../../controllers/AuthController.js";
import { isAuthenticated } from "../../config/middlewares.js";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/refresh", Refresh);
router.get("/status", isAuthenticated(), Status);
router.all("/logout", isAuthenticated(), Logout);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

export default router;
