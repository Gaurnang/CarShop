import pool from "../config/db.js";

export const addCompatibility = async (
  productId,
  variantId
) => {
  const result = await pool.query(
    `
    INSERT INTO product_compatibility
    (
        product_id,
        variant_id
    )
    VALUES ($1,$2)
    RETURNING *;
    `,
    [productId, variantId]
  );

  return result.rows[0];
};

export const compatibilityExists = async (
  productId,
  variantId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM product_compatibility
    WHERE product_id=$1
    AND variant_id=$2;
    `,
    [productId, variantId]
  );

  return result.rows[0];
};

export const removeCompatibility = async (
  productId,
  variantId
) => {
  await pool.query(
    `
    DELETE
    FROM product_compatibility
    WHERE product_id=$1
    AND variant_id=$2;
    `,
    [productId, variantId]
  );
};

export const getCompatibleVariants = async (
  productId
) => {

  const result = await pool.query(
    `
    SELECT

        pc.variant_id,

        v.name AS variant_name,

        m.id AS model_id,

        m.name AS model_name,

        b.id AS brand_id,

        b.name AS brand_name

    FROM product_compatibility pc

    JOIN car_variants v
        ON pc.variant_id=v.id

    JOIN car_models m
        ON v.model_id=m.id

    JOIN car_brands b
        ON m.brand_id=b.id

    WHERE pc.product_id=$1

    ORDER BY
        b.name,
        m.name,
        v.name;
    `,
    [productId]
  );

  return result.rows;

};