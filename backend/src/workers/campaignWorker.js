import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(
  "campaign-email",

  async (job) => {

    console.log(job.data);

    // Resend integration comes here later

  },

  {
    connection: redis
  }
);

export default worker;