import express from "express";

import {
    addVariants,
    getVariants,
    removeVariant
}
from "../controllers/productCompatibilityController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
    "/:productId/compatibility",
    authMiddleware,
    adminMiddleware,
    addVariants
);

router.get(
    "/:productId/compatibility",
    getVariants
);

router.delete(
    "/:productId/compatibility/:variantId",
    authMiddleware,
    adminMiddleware,
    removeVariant
);

export default router;