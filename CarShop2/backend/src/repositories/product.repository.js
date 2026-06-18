import pool from "../config/db.js";

const getProducts = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM products
    WHERE id = $1
    `, [id]
  );

  return result.rows[0];
};

const createProduct = async ({name, description, price, stock, image_url}) => {
  const result = await pool.query(
    `
    INSERT INTO products(name, description, price, stock, image_url)    
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, description, price, stock, image_url]
  );

  return result.rows[0];
};

const updateProduct = async (id,  productData) => {
  const {name, description, price} = productData;

  const result = await pool.query(
    `
    UPDATE products
    SET
      name = $1,
      description = $2,
      price = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      name,
      description,
      price,
      id,
    ]
  );

  return result.rows[0];
};

const deleteProduct = async ( id ) => {
  const result = await pool.query(
    `
    DELETE FROM products
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};