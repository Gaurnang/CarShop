import pool from "../config/db.js";

const addCompatibility = async (
  productId,
  variantIds
) => {
  const values = [];
  const placeholders = [];

  variantIds.forEach((variantId, index) => {
    const start = index * 2;

    placeholders.push(
      `($${start + 1}, $${start + 2})`
    );

    values.push(productId, variantId);
  });

  const result = await pool.query(
    `
    INSERT INTO product_compatibility
    (
      product_id,
      variant_id
    )
    VALUES
    ${placeholders.join(",")}
    ON CONFLICT DO NOTHING
    RETURNING *
    `,
    values
  );

  return result.rows;
};

const getCompatibilityByProductId = async (
  productId
) => {
  const result = await pool.query(
    `
    SELECT
      cb.name AS brand,
      cm.name AS model,
      cv.name AS variant
    FROM product_compatibility pc

    JOIN car_variants cv
      ON pc.variant_id = cv.id

    JOIN car_models cm
      ON cv.model_id = cm.id

    JOIN car_brands cb
      ON cm.brand_id = cb.id

    WHERE pc.product_id = $1

    ORDER BY
      cb.name,
      cm.name,
      cv.name
    `,
    [productId]
  );

  return result.rows;
};

const removeCompatibility =
  async (
    productId,
    variantId
  ) => {

    const result =
      await pool.query(
        `
        DELETE FROM product_compatibility
        WHERE product_id = $1
        AND variant_id = $2
        RETURNING *
        `,
        [
          productId,
          variantId,
        ]
      );

    return result.rows[0];
  };

export {
  addCompatibility,
  getCompatibilityByProductId,
  removeCompatibility,
};
