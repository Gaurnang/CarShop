import pool from "../config/db.js";

export const createVariant = async (name, modelId) => {
  const result = await pool.query(
    `
    INSERT INTO car_variants
    (
      name,
      model_id
    )
    VALUES ($1,$2)
    RETURNING *;
    `,
    [name, modelId]
  );

  return result.rows[0];
};

export const getAllVariants = async () => {
  const result = await pool.query(
    `
    SELECT
      v.id,
      v.name,
      v.model_id,
      m.name AS model_name,
      b.id AS brand_id,
      b.name AS brand_name
    FROM car_variants v
    JOIN car_models m
      ON v.model_id = m.id
    JOIN car_brands b
      ON m.brand_id = b.id
    ORDER BY
      b.name,
      m.name,
      v.name;
    `
  );

  return result.rows;
};

export const getVariantById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      v.id,
      v.name,
      v.model_id,
      m.name AS model_name,
      b.id AS brand_id,
      b.name AS brand_name
    FROM car_variants v
    JOIN car_models m
      ON v.model_id = m.id
    JOIN car_brands b
      ON m.brand_id = b.id
    WHERE v.id=$1;
    `,
    [id]
  );

  return result.rows[0];
};

export const getVariantsByModel = async (modelId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      model_id
    FROM car_variants
    WHERE model_id=$1
    ORDER BY name;
    `,
    [modelId]
  );

  return result.rows;
};

export const getVariantByNameAndModel = async (
  name,
  modelId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM car_variants
    WHERE LOWER(name)=LOWER($1)
    AND model_id=$2;
    `,
    [name, modelId]
  );

  return result.rows[0];
};

export const updateVariant = async (
  id,
  name,
  modelId
) => {
  const result = await pool.query(
    `
    UPDATE car_variants
    SET
      name=$1,
      model_id=$2
    WHERE id=$3
    RETURNING *;
    `,
    [name, modelId, id]
  );

  return result.rows[0];
};

export const deleteVariant = async (id) => {
  await pool.query(
    `
    DELETE FROM car_variants
    WHERE id=$1;
    `,
    [id]
  );
};