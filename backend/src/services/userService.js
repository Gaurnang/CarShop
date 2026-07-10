import { fetchAllUsers, fetchUserById } from "../repositories/userRepository.js";

export const getAllUsersService = async() => {
    return await fetchAllUsers();
}

export const getUserByIdService = async(userId) => {

    const user = await fetchUserById(userId);

    if(!user) {
        throw new Error(`User not found`);
    }

    return user;
}   
