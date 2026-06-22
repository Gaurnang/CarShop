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
        content,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        'QUEUED'
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

const getRecipientsByCampaignId =
  async (
    campaignId
  ) => {

    const result =
      await pool.query(
        `
        SELECT DISTINCT
          u.id,
          u.email,
          u.name

        FROM campaigns c

        JOIN campaign_products cp
          ON cp.campaign_id = c.id

        JOIN product_compatibility pc
          ON pc.product_id = cp.product_id

        JOIN user_saved_cars usc
          ON usc.variant_id = pc.variant_id

        JOIN users u
          ON u.id = usc.user_id

        WHERE c.id = $1
        `,
        [campaignId]
      );

    return result.rows;
  };

export {
  createCampaign,
  addCampaignProducts,
  getCampaigns,
  getCampaignById,
  getRecipientsByCampaignId,
};