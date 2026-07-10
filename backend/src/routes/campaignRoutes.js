import express from "express";

import {
  create,
  getAll,
  getOne,
  remove,
  getEligibleUsersForCampaign,
  sendCampaign
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

export default router;