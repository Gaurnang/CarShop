import pool from "../config/db.js";

export const saveCar = async (
  userId,
  variantId,
  nickname
) => {
  const result = await pool.query(
    `
    INSERT INTO user_saved_cars
    (
        user_id,
        variant_id,
        nickname
    )
    VALUES ($1,$2,$3)
    RETURNING *;
    `,
    [userId, variantId, nickname]
  );

  return result.rows[0];
};

export const getSavedCar = async (
  userId,
  variantId
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM user_saved_cars
    WHERE user_id=$1
    AND variant_id=$2;
    `,
    [userId, variantId]
  );

  return result.rows[0];
};

export const getUserCars = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT

        usc.id,

        usc.nickname,

        usc.created_at,

        b.id AS brand_id,
        b.name AS brand_name,

        m.id AS model_id,
        m.name AS model_name,

        v.id AS variant_id,
        v.name AS variant_name

    FROM user_saved_cars usc

    JOIN car_variants v
        ON usc.variant_id = v.id

    JOIN car_models m
        ON v.model_id = m.id

    JOIN car_brands b
        ON m.brand_id = b.id

    WHERE usc.user_id = $1

    ORDER BY usc.created_at DESC;
    `,
    [userId]
  );

  return result.rows;
};

export const getSavedCarById = async (
  id
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM user_saved_cars
    WHERE id=$1;
    `,
    [id]
  );

  return result.rows[0];
};

export const updateSavedCar = async (
  id,
  variantId,
  nickname
) => {

  const result = await pool.query(
    `
    UPDATE user_saved_cars
    SET
        variant_id = $1,
        nickname = $2
    WHERE id = $3
    RETURNING *;
    `,
    [
      variantId,
      nickname,
      id
    ]
  );

  return result.rows[0];

};

export const deleteSavedCar = async (
  id
) => {
  await pool.query(
    `
    DELETE
    FROM user_saved_cars
    WHERE id=$1;
    `,
    [id]
  );
};