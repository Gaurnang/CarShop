import { Queue } from "bullmq";
import redis from "../config/redis.js";

const campaignQueue = new Queue(
  "campaign-email",
  {
    connection: redis
  }
);

export default campaignQueue;