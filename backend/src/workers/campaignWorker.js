import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(

    "campaign",

    async(job)=>{

        console.log("Job Started");

        console.log(job.data);

        console.log("Job Finished");

    },

    {
        connection:redis
    }

);

worker.on("completed",(job)=>{

    console.log(`Completed ${job.id}`);

});

worker.on("failed",(job,error)=>{

    console.log(error.message);

});

export default worker;