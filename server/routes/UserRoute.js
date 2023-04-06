import express from "express";
import {
  allUsers,
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  UnFollowUser,
  updateUser,
} from "../controllers/UserController.js";
import authMiddleware from "../Middleware/authMiddleWare.js";
const router = express.Router();

router.get("/", allUsers);
router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/:id/follow", authMiddleware, followUser);
router.put("/:id/unfollow", authMiddleware, UnFollowUser);

export default router;
