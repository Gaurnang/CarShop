import pool from "../config/db.js";

export const getCatalog = async (userId) => {
  const result = await pool.query(
    `
    SELECT DISTINCT

        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_active

    FROM user_saved_cars usc

    JOIN product_compatibility pc
        ON usc.variant_id = pc.variant_id

    JOIN products p
        ON pc.product_id = p.id

    WHERE usc.user_id = $1
    AND p.is_active = true

    ORDER BY p.name;
    `,
    [userId]
  );

  return result.rows;
};

export const getCatalogBySavedCar = async (
  userId,
  savedCarId
) => {
  const result = await pool.query(
    `
    SELECT DISTINCT

        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_active

    FROM user_saved_cars usc

    JOIN product_compatibility pc
        ON usc.variant_id = pc.variant_id

    JOIN products p
        ON pc.product_id = p.id

    WHERE usc.user_id = $1
    AND usc.id = $2
    AND p.is_active = true

    ORDER BY p.name;
    `,
    [userId, savedCarId]
  );

  return result.rows;
};