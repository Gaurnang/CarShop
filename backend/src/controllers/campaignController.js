import {
  createNewCampaign,
  fetchCampaigns,
  fetchCampaign,
  removeCampaign,
  getCampaignAnalyticsService,
  getCampaignRecipientsService
} from "../services/campaignService.js";

import * as campaignService from "../services/campaignService.js";

import {
  fetchEligibleUsers
} from "../services/campaignService.js";

export const create = async (
  req,
  res
) => {

  try {

    const {
      title,
      subject,
      content,
      productIds
    } = req.body;

    const campaign =
      await createNewCampaign(
        title,
        subject,
        content,
        productIds
      );

    res.status(201).json({
      success: true,
      data: campaign
    });

  }
  catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const getAll = async (
  req,
  res
) => {

  const campaigns =
    await fetchCampaigns();

  res.json({
    success: true,
    data: campaigns
  });

};

export const getOne = async (
  req,
  res
) => {

  try {

    const campaign =
      await fetchCampaign(
        req.params.id
      );

    res.json({
      success: true,
      data: campaign
    });

  }
  catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

export const remove = async (
  req,
  res
) => {

  try {

    await removeCampaign(
      req.params.id
    );

    res.json({
      success: true,
      message:
      "Campaign deleted successfully"
    });

  }
  catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

export const getEligibleUsersForCampaign = async (
  req,
  res
) => {

  try {

    const users =
      await fetchEligibleUsers(
        req.params.id
      );

    res.json({
      success: true,
      data: users
    });

  }
  catch (error) {

    res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

export const sendCampaign = async (req, res) => {

  try {
    const total = await campaignService.sendCampaign(req.params.id);

    res.status(200).json({
      success: true,
      message: `${total} jobs added to queue.`,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCampaignAnalytics = async (req, res, next) => {
    try {
        const { id } = req.params;

        const analytics = await getCampaignAnalyticsService(id);

        res.status(200).json({
            success: true,
            message: "Campaign analytics fetched successfully.",
            analytics,
        });
    } catch (error) {
        next(error);
    }
};

export const getCampaignRecipients = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        const recipients = await getCampaignRecipientsService(
            id,
            status
        );

        res.status(200).json({
            success: true,
            message: "Campaign recipients fetched successfully.",
            recipients,
        });
    } catch (error) {
        next(error);
    }
};