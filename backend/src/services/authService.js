import bcrypt from "bcrypt";
import {
    createUser,
    findUserByEmail,
    findUserById
} from "../repositories/authRepository.js";

import generateToken from "../utils/generateToken.js";

export const registerUser = async (
    name,
    email,
    password
) => {

    const existingUser =
        await findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user =
        await createUser(
            name,
            email,
            hashedPassword
        );

    const token = generateToken(user);

    return {
        user,
        token
    };
};

export const loginUser = async (
    email,
    password
) => {

    const user =
        await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export const getCurrentUser = async (id) => {

    return await findUserById(id);

};