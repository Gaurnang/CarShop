import {
  createCampaign,
  addCampaignProduct,
  getCampaigns,
  getCampaignById,
  getCampaignProducts,
  deleteCampaign
} from "../repositories/campaignRepository.js";

import {
  getProductById
} from "../repositories/productRepository.js";

export const createNewCampaign = async (
  title,
  subject,
  content,
  productIds
) => {

  const campaign =
    await createCampaign(
      title,
      subject,
      content
    );

  for (const productId of productIds) {

    const product =
      await getProductById(productId);

    if (!product) {
      throw new Error(
        `Product ${productId} not found`
      );
    }

    await addCampaignProduct(
      campaign.id,
      productId
    );

  }

  return campaign;

};

export const fetchCampaigns =
async () => {

  return await getCampaigns();

};

export const fetchCampaign =
async (id) => {

  const campaign =
    await getCampaignById(id);

  if (!campaign) {
    throw new Error(
      "Campaign not found"
    );
  }

  const products =
    await getCampaignProducts(id);

  return {
    ...campaign,
    products
  };

};

export const removeCampaign =
async (id) => {

  const campaign =
    await getCampaignById(id);

  if (!campaign) {
    throw new Error(
      "Campaign not found"
    );
  }

  await deleteCampaign(id);

};