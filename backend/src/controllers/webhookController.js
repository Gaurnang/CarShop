import { processWebhookEvent } from "../services/webhookService.js";

export const handleResendWebhook = async (req, res) => {
    try {

        await processWebhookEvent(req.body);

        res.sendStatus(200);

    } catch (error) {

        console.error(error);

        res.sendStatus(500);

    }
};