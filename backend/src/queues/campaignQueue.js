import { Queue } from "bullmq";
import redis from "../config/redis.js";

const campaignQueue = new Queue(

    "campaign",

    {
        connection: redis
    }

);

export default campaignQueue;