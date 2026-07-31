import express from "express";
import { handleResendWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/resend", handleResendWebhook);

export default router;