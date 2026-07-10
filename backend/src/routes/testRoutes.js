import express from "express";
import campaignQueue from "../queues/campaignQueue.js";

const router = express.Router();

router.post("/", async (req, res) => {
  await campaignQueue.add("email", {
    email: "abc@gmail.com",
    name: "John",
  });

  res.status(200).json({
    success: true,
    message: "Job added to queue",
  });
});

export default router;