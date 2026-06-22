import express from "express";

import {
  createAndSendCampaign,
  getCampaigns,
  getCampaignById,
} from "../controllers/campaign.controller.js";

import protect from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.post(
  "/send",
  protect,
  isAdmin,
  createAndSendCampaign
);

router.get(
  "/",
  protect,
  isAdmin,
  getCampaigns
);

router.get(
  "/:campaignId",
  protect,
  isAdmin,
  getCampaignById
);

export default router;