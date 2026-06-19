import pool from "../config/db.js";

const createCampaign = async (
  title,
  subject,
  content
) => {

  const result =
    await pool.query(
      `
      INSERT INTO campaigns
      (
        title,
        subject,
        content
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING *
      `,
      [
        title,
        subject,
        content,
      ]
    );

  return result.rows[0];
};

const addCampaignProducts =
  async (
    campaignId,
    productIds
  ) => {

    for (
      const productId
      of productIds
    ) {

      await pool.query(
        `
        INSERT INTO campaign_products
        (
          campaign_id,
          product_id
        )
        VALUES
        (
          $1,
          $2
        )
        `,
        [
          campaignId,
          productId,
        ]
      );

    }

  };

const getCampaigns =
  async () => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM campaigns
        ORDER BY created_at DESC
        `
      );

    return result.rows;
  };

const getCampaignById =
  async (
    campaignId
  ) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM campaigns
        WHERE id = $1
        `,
        [campaignId]
      );

    return result.rows[0];
  };

export {
  createCampaign,
  addCampaignProducts,
  getCampaigns,
  getCampaignById,
};