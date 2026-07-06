import express from "express";

import {
  create,
  getAll,
  getByModel,
  getOne,
  remove,
  update,
} from "../controllers/variantController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAll);

router.get("/model/:modelId", getByModel);

router.get("/:id", getOne);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  create
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  update
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  remove
);

export default router;