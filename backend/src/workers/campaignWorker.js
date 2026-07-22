import { Worker } from "bullmq";
import redis from "../config/redis.js";
import resend from "../config/resend.js";
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
            await resend.emails.send({
                from: "CarShop <onboarding@resend.dev>",
                to: user.email,
                subject: campaign.subject,
                html: campaignEmailTemplate(user, campaign),
            });

            await markRecipientSent(
                campaign.id,
                user.id
            );

            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            // Mark as failed only after the final retry
            const isLastAttempt =
                job.attemptsMade + 1 >= (job.opts.attempts || 1);

            if (isLastAttempt) {
                await markRecipientFailed(
                    campaign.id,
                    user.id,
                    error.message?.substring(0, 500) || "Unknown error"
                );
            }

            throw error; // Allow BullMQ to retry
        }
    },
    {
        connection: redis,
    }
);

export default worker;