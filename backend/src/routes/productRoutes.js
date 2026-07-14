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

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);

router.post("/:id/images", upload.array("images", 10),  uploadProductImages);

export default router;