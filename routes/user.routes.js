import express from "express";
import {
  getCurrentUser,
  getAllUsers,
  createAdmin,
  updateUserRole,
  deleteUser,
  saveSelection,
  getAllSelections,
  updateSelectionStatus,
  deleteSelection,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

// Current user profile
userRouter.get("/current", isAuth, getCurrentUser);

// User management (Admin)
userRouter.get("/all", getAllUsers);
userRouter.post("/create-admin", createAdmin);
userRouter.put("/:id/role", updateUserRole);
userRouter.delete("/:id", deleteUser);

// Artwork selections & inquiries
userRouter.post("/selections", saveSelection);
userRouter.get("/selections", getAllSelections);
userRouter.put("/selections/:id/status", updateSelectionStatus);
userRouter.delete("/selections/:id", deleteSelection);

export default userRouter;
