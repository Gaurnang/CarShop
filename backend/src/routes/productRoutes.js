import express from "express";

import {
  create,
  getAll,
  getOne,
  remove,
  update,
  uploadProductImage,
  removeImage,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/", create);

router.put("/:id", update);

router.delete("/:id", remove);

// Upload a single image for a product 
router.post("/:id/images", upload.single("image"), uploadProductImage);

// Remove the product's image
router.delete("/:id/images", removeImage);

export default router;