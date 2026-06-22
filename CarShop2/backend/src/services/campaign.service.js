import {
  createCampaign,
  addCampaignProducts,
  getCampaigns,
  getCampaignById,
  getRecipientsByCampaignId,
} from "../repositories/campaign.repository.js";

import {
  queueEmail,
} from "./queue.service.js";

const sendCampaign =
  async (
    campaignData
  ) => {

    const {
      title,
      subject,
      content,
      productIds,
    } = campaignData;

    const campaign =
      await createCampaign(
        title,
        subject,
        content
      );

    await addCampaignProducts(
      campaign.id,
      productIds
    );

    const recipients =
      await getRecipientsByCampaignId(
        campaign.id
      );

    for (
      const recipient
      of recipients
    ) {

      await queueEmail(
        recipient.email,
        subject,
        content
      );

    }

    return {
      ...campaign,
      recipientCount:
        recipients.length,
    };

  };

const fetchCampaigns =
  async () => {

    return await getCampaigns();

  };

const fetchCampaignById =
  async (
    campaignId
  ) => {

    return await getCampaignById(
      campaignId
    );

  };

export {
  sendCampaign,
  fetchCampaigns,
  fetchCampaignById,
};