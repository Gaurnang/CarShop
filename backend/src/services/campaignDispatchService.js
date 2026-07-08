import campaignQueue from "../queues/campaignQueue.js";

export const dispatchCampaign = async (
  users,
  campaign
) => {

  for (const user of users) {

    await campaignQueue.add(
      "send-email",

      {
        user,
        campaign
      },

      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 3000
        },

        removeOnComplete: true
      }
    );

  }

};