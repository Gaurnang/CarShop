import { Worker } from "bullmq";
import redis from "../config/redis.js";
import resend from "../config/resend.js";
import deadLetterQueue from "../queues/deadLetterQueue.js";
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

            await markRecipientSent(campaign.id, user.id);

            console.log(`Email sent to ${user.email}`);
        } catch (error) {
            const isLastAttempt =
                job.attemptsMade + 1 >= (job.opts.attempts || 1);

            if (isLastAttempt) {
                await markRecipientFailed(
                    campaign.id,
                    user.id
                );

                // Move to Dead Letter Queue
                await deadLetterQueue.add("failed-email", {
                    originalJobId: job.id,
                    campaign,
                    user,
                    error: error.message,
                    failedAt: new Date().toISOString(),
                });
            }

            throw error;
        }
    },
    {
        connection: redis,
    }
);

export default worker;