import campaignQueue from "../queues/campaignQueue.js";

export const queueCampaign = async (
    user,
    campaign
) => {

    await campaignQueue.add(

        "campaign",

        {

            user,

            campaign

        },

        {

            attempts: 3,

            backoff: {

                type: "exponential",

                delay: 5000

            },

            removeOnComplete: true

        }

    );

};