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

export const createBrand = async (name) => {
  const result = await pool.query(
    `
    INSERT INTO car_brands (name)
    VALUES ($1)
    RETURNING *
    `,
    [name]
  );

  return result.rows[0];
};

export const updateBrand = async (
  brandId,
  name
) => {
  const result = await pool.query(
    `
    UPDATE car_brands
    SET name = $1
    WHERE id = $2
    RETURNING *
    `,
    [name, brandId]
  );

  return result.rows[0];
};

export const deleteBrand = async (
  brandId
) => {
  await pool.query(
    `
    DELETE FROM car_brands
    WHERE id = $1
    `,
    [brandId]
  );
};

export const createModel = async (
  brandId,
  name
) => {

  const result = await pool.query(
    `
    INSERT INTO car_models
    (
      brand_id,
      name
    )
    VALUES
    (
      $1,
      $2
    )
    RETURNING *
    `,
    [
      brandId,
      name,
    ]
  );

  return result.rows[0];
};

export const updateModel = async (
  modelId,
  name
) => {

  const result = await pool.query(
    `
    UPDATE car_models
    SET name = $1
    WHERE id = $2
    RETURNING *
    `,
    [
      name,
      modelId,
    ]
  );

  return result.rows[0];
};

export const deleteModel = async (
  modelId
) => {

  await pool.query(
    `
    DELETE FROM car_models
    WHERE id = $1
    `,
    [modelId]
  );

};

export const createVariant = async (
  modelId,
  name
) => {

  const result = await pool.query(
    `
    INSERT INTO car_variants
    (
      model_id,
      name
    )
    VALUES
    (
      $1,
      $2
    )
    RETURNING *
    `,
    [
      modelId,
      name,
    ]
  );

  return result.rows[0];
};

export const updateVariant = async (
  variantId,
  name
) => {

  const result = await pool.query(
    `
    UPDATE car_variants
    SET name = $1
    WHERE id = $2
    RETURNING *
    `,
    [
      name,
      variantId,
    ]
  );

  return result.rows[0];
};

export const deleteVariant = async (
  variantId
) => {

  await pool.query(
    `
    DELETE FROM car_variants
    WHERE id = $1
    `,
    [variantId]
  );

};