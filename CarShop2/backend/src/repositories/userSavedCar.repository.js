import pool from "../config/db.js";

const saveCar = async (userId, variantId, nickname, isPrimary = false ) => {
  const result = await pool.query(
    `
    INSERT INTO user_saved_cars
    (
      user_id,
      variant_id,
      nickname,
      is_primary
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
    `,
    [
      userId,
      variantId,
      nickname,
      isPrimary,
    ]
  );

  return result.rows[0];
};

const getSavedCarsByUserId = async (
  userId
) => {
  const result = await pool.query(
    `
    SELECT
      usc.id,
      usc.nickname,
      usc.is_primary,

      cb.name AS brand,
      cm.name AS model,
      cv.name AS variant,
      cv.id AS variant_id

    FROM user_saved_cars usc

    JOIN car_variants cv
      ON usc.variant_id = cv.id

    JOIN car_models cm
      ON cv.model_id = cm.id

    JOIN car_brands cb
      ON cm.brand_id = cb.id

    WHERE usc.user_id = $1

    ORDER BY usc.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

const deleteSavedCar = async (
  savedCarId
) => {
  const result = await pool.query(
    `
    DELETE FROM user_saved_cars
    WHERE id = $1
    RETURNING *
    `,
    [savedCarId]
  );

  return result.rows[0];
};

export {
  saveCar,
  getSavedCarsByUserId,
  deleteSavedCar,
};