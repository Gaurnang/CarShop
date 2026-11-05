import IORedis from "ioredis";

const redisUrl =
  process.env.REDIS_URL ||
  (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? `rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN.trim()}@${process.env.UPSTASH_REDIS_REST_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}:6379`
    : null);

const redis = redisUrl
  ? new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: {
        rejectUnauthorized: false,
      },
      retryStrategy(times) {
        return Math.min(times * 500, 3000);
      },
    })
  : new IORedis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        return Math.min(times * 500, 3000);
      },
    });

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

export default redis;