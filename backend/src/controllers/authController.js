import {
    registerUser,
    loginUser,
    getCurrentUser
} from "../services/authService.js";

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const result =
            await registerUser(
                name,
                email,
                password
            );

        res.status(201).json(result);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const result =
            await loginUser(
                email,
                password
            );

        res.json(result);

    } catch (error) {

        res.status(401).json({
            message: error.message
        });

    }

};

export const me = async (req, res) => {

    try {

        const user =
            await getCurrentUser(req.user.id);

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};