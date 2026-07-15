import { Worker } from "bullmq";
import redis from "../config/redis.js";
import resend from "../config/resend.js";
import { campaignEmailTemplate } from "../utils/emailTemplate.js";

const worker = new Worker(

    "campaign",

    async (job) => {

        const {

            user,

            campaign

        } = job.data;

        await resend.emails.send({

            from: "CarShop <onboarding@resend.dev>",

            to: user.email,

            subject: campaign.subject,

            html: campaignEmailTemplate(
                user,
                campaign
            )

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