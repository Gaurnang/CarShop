import pool from "../config/db.js";

export const getBrands = async () => {
  const result = await pool.query(
    "SELECT * FROM car_brands ORDER BY name"
  );

  return result.rows;
};

export const getModelsByBrandId = async (brandId) => {
  const result = await pool.query(
    `
      SELECT id, name
      FROM car_models
      WHERE brand_id = $1
      ORDER BY name
    `,
    [brandId]
  );

  return result.rows;
};

export const getVariantsByModelId = async (modelId) => {
  const result = await pool.query(
    `
    SELECT id, name
    FROM car_variants
    WHERE model_id = $1
    ORDER BY name
    `,
    [modelId]
  );

  return result.rows;
};