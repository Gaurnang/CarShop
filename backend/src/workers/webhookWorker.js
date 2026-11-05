import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { processWebhookEvent } from "../services/webhookService.js";

const webhookWorker = new Worker(
    "webhook",
    async (job) => {
        await processWebhookEvent(job.data);
    },
    {
        connection: redis,
    }
);

webhookWorker.on("error", (err) => {
    console.error("Webhook worker error:", err.message);
});

export default webhookWorker;