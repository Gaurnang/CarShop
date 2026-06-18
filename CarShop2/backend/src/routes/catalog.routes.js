import express from "express";

import {
  getCatalog,
} from "../controllers/catalog.controllers.js";

const router = express.Router();

router.get("/:userId", getCatalog);

export default router;