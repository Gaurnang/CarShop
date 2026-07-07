import express from "express";

import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/savedCarController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", create);

router.get("/", getAll);

router.put("/:id", update);

router.delete("/:id", remove);

export default router;