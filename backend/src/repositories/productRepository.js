import pool from "../config/db.js";

export const createProduct = async (
  name,
  description,
  price,
  imageUrl
) => {
  const result = await pool.query(
    `
    INSERT INTO products
    (
        name,
        description,
        price
    )
    VALUES ($1,$2,$3)
    RETURNING *;
    `,
    [name, description, price]
  );

  return result.rows[0];
};

export const getProductByName = async (name) => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE LOWER(name)=LOWER($1);
    `,
    [name]
  );

  return result.rows[0];
};

export const getAllProducts = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    ORDER BY created_at DESC;
    `
  );

  return result.rows;
};

export const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE id=$1;
    `,
    [id]
  );

  return result.rows[0];
};

export const updateProduct = async (
  id,
  name,
  description,
  price,
  isActive
) => {
  const result = await pool.query(
    `
    UPDATE products
    SET
        name=$1,
        description=$2,
        price=$3,
        is_active=$5,
        updated_at=CURRENT_TIMESTAMP
    WHERE id=$6
    RETURNING *;
    `,
    [
      name,
      description,
      price,
      isActive,
      id,
    ]
  );

  return result.rows[0];
};

export const deleteProduct = async (id) => {
  await pool.query(
    `
    DELETE FROM products
    WHERE id=$1;
    `,
    [id]
  );
};