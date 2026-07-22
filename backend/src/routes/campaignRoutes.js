import express from "express";

import {
  create,
  getAll,
  getOne,
  remove,
  getEligibleUsersForCampaign,
  sendCampaign,
  getCampaignAnalytics,
  getCampaignRecipients
} from "../controllers/campaignController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(
  authMiddleware,
  adminMiddleware
);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.delete("/:id", remove);

router.get("/:id/users", getEligibleUsersForCampaign)

router.post("/:id/send", sendCampaign);

router.get("/:id/analytics", authMiddleware, adminMiddleware, getCampaignAnalytics);

router.get("/:id/recipients", authMiddleware, adminMiddleware, getCampaignRecipients);

export default router;