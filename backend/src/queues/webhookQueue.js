import { Queue } from "bullmq";
import redis from "../config/redis.js";

const webhookQueue = new Queue("webhook", {
    connection: redis,
});

export default webhookQueue;