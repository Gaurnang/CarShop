import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { sendEmail } from "../utils/sendEmail.js";
import { campaignEmailTemplate } from "../utils/campaignEmailTemplate.js";

import {
    markRecipientSent,
    markRecipientFailed,
} from "../repositories/campaignRecipientRepository.js";

const worker = new Worker(
    "campaign",
    async (job) => {

        const { user, campaign } = job.data;

        try {

            await sendEmail({
                to: user.email,
                subject: campaign.title,
                html: campaignEmailTemplate(user, campaign),
            });

            await markRecipientSent(
                campaign.id,
                user.id
            );

        } catch (error) {

            await markRecipientFailed(
                campaign.id,
                user.id,
                error.message
            );

            throw error;
        }
    },
    {
        connection: redis,
    }
);

export default worker;