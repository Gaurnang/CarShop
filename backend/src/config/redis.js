import IORedis from "ioredis";

const redis = new IORedis({
    host: "redis",
    port: 6379,
    maxRetriesPerRequest: null
});

export default redis;