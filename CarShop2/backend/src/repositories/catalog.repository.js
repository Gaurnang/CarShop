import pool from "../config/db.js";

export const getCatalogByUserId =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT DISTINCT
          p.id,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.image_url
        FROM products p

        INNER JOIN product_compatibility pc
          ON p.id = pc.product_id

        INNER JOIN user_saved_cars usc
          ON pc.variant_id = usc.variant_id

        WHERE usc.user_id = $1
          AND p.is_active = TRUE

        ORDER BY p.name
        `,
        [userId]
      );

    return result.rows;
  };