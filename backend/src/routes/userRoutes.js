import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {getAllUsers, getUserById} from "../controllers/userController.js";

const app = express();
const router = express.Router();


app.get("/", authMiddleware, adminMiddleware, getAllUsers);
app.get("/:id", authMiddleware, adminMiddleware, getUserById);
    
export default router;