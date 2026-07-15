import express from "express";

import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

import {
    getCatalog,
    getCatalogProductById

} from "../controllers/catalogController.js";

const router = express.Router();

router.get("/", optionalAuthMiddleware, getCatalog);

router.get("/:id", getCatalogProductById);

export default router;