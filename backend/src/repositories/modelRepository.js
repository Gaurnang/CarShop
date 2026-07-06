import pool from "../config/db.js";

export const createModel = async (name, brandId) => {
  const result = await pool.query(
    `
    INSERT INTO car_models (name, brand_id)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, brandId]
  );

  return result.rows[0];
};

export const getAllModels = async () => {
  const result = await pool.query(
    `
    SELECT
      m.id,
      m.name,
      m.brand_id,
      b.name AS brand_name
    FROM car_models m
    JOIN car_brands b
      ON m.brand_id = b.id
    ORDER BY b.name, m.name;
    `
  );

  return result.rows;
};

export const getModelById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      m.id,
      m.name,
      m.brand_id,
      b.name AS brand_name
    FROM car_models m
    JOIN car_brands b
      ON m.brand_id = b.id
    WHERE m.id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

export const getModelsByBrand = async (brandId) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      brand_id
    FROM car_models
    WHERE brand_id = $1
    ORDER BY name;
    `,
    [brandId]
  );

  return result.rows;
};

export const getModelByNameAndBrand = async (
  name,
  brandId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM car_models
    WHERE LOWER(name)=LOWER($1)
    AND brand_id=$2;
    `,
    [name, brandId]
  );

  return result.rows[0];
};

export const updateModel = async (
  id,
  name,
  brandId
) => {
  const result = await pool.query(
    `
    UPDATE car_models
    SET
      name=$1,
      brand_id=$2
    WHERE id=$3
    RETURNING *;
    `,
    [name, brandId, id]
  );

  return result.rows[0];
};

export const deleteModel = async (id) => {
  await pool.query(
    `
    DELETE FROM car_models
    WHERE id=$1;
    `,
    [id]
  );
};