import {getAllUsersService, getUserByIdService} from "../services/userService.js";


export const getAllUsers = async (req, res) => {
    
    try {
     
        const users = await getAllUsersService();

        return res.status(201).json({
            success: true,
            data: users
        });

    }catch(error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};



export const getUserById = async(req, res) => {
 
    try {
        const id = req.params.id;
        const user = await getUserByIdService(id);

        return res.status(201).json({
            success: true,
            data: user
        });

    }catch(error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }

}