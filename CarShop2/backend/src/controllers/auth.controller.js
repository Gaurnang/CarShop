import {
  register,
  login,
  fetchCurrentUser,
} from "../services/auth.service.js";

const registerUser =
  async (req, res) => {

    try {

      const user =
        await register(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  };

const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const result =
        await login(
          email,
          password
        );

      res.status(200).json({
        success: true,
        ...result,
      });

    } catch (error) {

      res.status(401).json({
        success: false,
        message: error.message,
      });

    }
  };

const getMe =
  async (req, res) => {

    try {

      const user =
        await fetchCurrentUser(
          req.user.id
        );

      res.status(200).json({
        success: true,
        data: user,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

export {
  registerUser,
  loginUser,
  getMe,
};