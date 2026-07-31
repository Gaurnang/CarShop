import { Queue } from "bullmq";
import redis from "../config/redis.js";

const deadLetterQueue = new Queue("campaign-dead-letter", {
    connection: redis,
});

export default deadLetterQueue;