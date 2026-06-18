import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../repositories/auth.repository.js";

const register = async (
  userData
) => {

  const {
    name,
    email,
    password,
  } = userData;

  const existingUser =
    await getUserByEmail(email);

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  return await createUser(
    name,
    email,
    hashedPassword
  );
};

const login = async (
  email,
  password
) => {

  const user =
    await getUserByEmail(email);

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};

const fetchCurrentUser =
  async (userId) => {

    return await getUserById(
      userId
    );

  };

export {
  register,
  login,
  fetchCurrentUser,
};