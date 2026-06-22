import {
  sendCampaign,
  fetchCampaigns,
  fetchCampaignById,
} from "../services/campaign.service.js";

const createAndSendCampaign =
  async (req, res) => {

    try {

      const campaign =
        await sendCampaign(
          req.body
        );

      res.status(201).json({
        success: true,
        data: campaign,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

const getCampaigns =
  async (req, res) => {

    try {

      const campaigns =
        await fetchCampaigns();

      res.status(200).json({
        success: true,
        data: campaigns,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

const getCampaignById =
  async (req, res) => {

    try {

      const campaign =
        await fetchCampaignById(
          req.params.campaignId
        );

      res.status(200).json({
        success: true,
        data: campaign,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

export {
  createAndSendCampaign,
  getCampaigns,
  getCampaignById,
};