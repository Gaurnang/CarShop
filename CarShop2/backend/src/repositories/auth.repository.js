import pool from "../config/db.js";

const createUser = async (
  name,
  email,
  password
) => {

  const result = await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password
    )
    VALUES
    (
      $1,
      $2,
      $3
    )
    RETURNING
    id,
    name,
    email,
    role
    `,
    [
      name,
      email,
      password,
    ]
  );

  return result.rows[0];
};

const getUserByEmail = async (
  email
) => {

  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

const getUserById = async (
  id
) => {

  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      role
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

export {
  createUser,
  getUserByEmail,
  getUserById,
};