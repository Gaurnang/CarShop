import pool from "../config/db.js";

export const createCampaign = async (
  title,
  subject,
  content
) => {
  const result = await pool.query(
    `
    INSERT INTO campaigns
    (
        title,
        subject,
        content
    )
    VALUES ($1,$2,$3)
    RETURNING *;
    `,
    [title, subject, content]
  );

  return result.rows[0];
};

export const addCampaignProduct = async (
  campaignId,
  productId
) => {
  await pool.query(
    `
    INSERT INTO campaign_products
    (
        campaign_id,
        product_id
    )
    VALUES ($1,$2);
    `,
    [campaignId, productId]
  );
};

export const getCampaigns = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM campaigns
    ORDER BY created_at DESC;
    `
  );

  return result.rows;
};

export const getCampaignById = async (
  id
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM campaigns
    WHERE id=$1;
    `,
    [id]
  );

  return result.rows[0];
};

export const getCampaignProducts = async (
  campaignId
) => {
  const result = await pool.query(
    `
    SELECT

        p.id,
        p.name,
        p.price

    FROM campaign_products cp

    JOIN products p
        ON cp.product_id = p.id

    WHERE cp.campaign_id = $1;
    `,
    [campaignId]
  );

  return result.rows;
};

export const deleteCampaign = async (
  id
) => {
  await pool.query(
    `
    DELETE
    FROM campaigns
    WHERE id=$1;
    `,
    [id]
  );
};

export const getEligibleUsers = async (campaignId) => {

    const result = await pool.query(

        `
        SELECT DISTINCT

            u.id,
            u.name,
            u.email

        FROM campaign_products cp

        JOIN product_compatibility pc
        ON cp.product_id = pc.product_id

        JOIN user_saved_cars usc
        ON pc.variant_id = usc.variant_id

        JOIN users u
        ON usc.user_id = u.id

        WHERE cp.campaign_id = $1
        `,

        [campaignId]

    );

    return result.rows;

};