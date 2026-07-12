import express from "express";

import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
    uploadProductImages
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/", authMiddleware, adminMiddleware, create);

router.put("/:id", authMiddleware, adminMiddleware, update);

router.delete("/:id", authMiddleware, adminMiddleware, remove);

router.post("/:id/images", authMiddleware, adminMiddleware, upload.array("images", 10),  uploadProductImages);

export default router;