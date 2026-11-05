import IORedis from "ioredis";

const redis = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    return Math.min(times * 500, 3000);
  },
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

export default redis;