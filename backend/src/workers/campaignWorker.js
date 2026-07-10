import { Worker } from "bullmq";
import redis from "../config/redis.js";
import resend from "../config/resend.js";

const worker = new Worker(

    "campaign",

    async (job) => {

        const {

            user,

            campaign

        } = job.data;

        await resend.emails.send({

            from: "CarShop <onboarding@resend.dev>",

            to: process.env.ADMIN_EMAIL,

            subject: campaign.subject,

            html: campaign.content

        });

        console.log(

            `Email sent to ${user.email}`

        );

    },

    {

        connection: redis

    }

);

export default worker;