import express from "express";
import {
  Login,
  logOut,
  signUp,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter = express.Router();

// Public user registration & sign-in
authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.post("/login", Login);

// Strict Admin authentication
authRouter.post("/admin-login", adminLogin);
authRouter.get("/admin-me", isAuth, getAdminProfile);
authRouter.put("/admin-profile", isAuth, updateAdminProfile);
authRouter.put("/admin-me", isAuth, updateAdminProfile);

// Sign-out endpoints (supports both GET and POST)
authRouter.get("/logout", logOut);
authRouter.post("/logout", logOut);

export default authRouter;
