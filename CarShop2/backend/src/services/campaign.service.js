import {
  createCampaign,
  addCampaignProducts,
  getCampaigns,
  getCampaignById,
} from "../repositories/campaign.repository.js";

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

    return campaign;
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