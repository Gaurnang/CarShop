import pool from "../config/db.js";

export const createBrand = async (name) => {
  const result = await pool.query(
    `
    INSERT INTO car_brands(name)
    VALUES($1)
    RETURNING *;
    `,
    [name]
  );

  return result.rows[0];
};

export const getAllBrands = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM car_brands
    ORDER BY name ASC;
    `
  );

  return result.rows;
};

export const getBrandById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM car_brands
    WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

export const getBrandByName = async (name) => {
  const result = await pool.query(
    `
    SELECT *
    FROM car_brands
    WHERE LOWER(name) = LOWER($1);
    `,
    [name]
  );

  return result.rows[0];
};

export const updateBrand = async (id, name) => {
  const result = await pool.query(
    `
    UPDATE car_brands
    SET name = $1
    WHERE id = $2
    RETURNING *;
    `,
    [name, id]
  );

  return result.rows[0];
};

export const deleteBrand = async (id) => {
  await pool.query(
    `
    DELETE FROM car_brands
    WHERE id = $1;
    `,
    [id]
  );
};