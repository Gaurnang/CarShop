import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/authRepository.js";

import generateToken from "../utils/generateToken.js";

import dotenv from "dotenv";

dotenv.config();

export const registerUser = async (
  name,
  email,
  password
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const isAdmin =
    email.trim().toLowerCase() ===
    process.env.ADMIN_EMAIL.trim().toLowerCase();

    const role = isAdmin ? "ADMIN" : "CUSTOMER";
  
  const user = await createUser(
    name,
    email,
    hashedPassword,
    role
  );

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

export const loginUser = async (
  email,
  password
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getCurrentUser = async (id) => {
  return await findUserById(id);
};