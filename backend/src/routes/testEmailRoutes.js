import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const testEmailFxn = async (req, res) => {
    try {
        const response = await resend.emails.send({
            from: "CarShop <onboarding@resend.dev>",
            to: "gauranggoel58@gmail.com",
            subject: "Test",
            text: "This is a test email."
        });

        console.log(response);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

router.get("/", testEmailFxn);

export default router;