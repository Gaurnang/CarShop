import webhookQueue from "../queues/webhookQueue.js";


export const handleResendWebhook = async (req, res, next) => {
    try {
        await webhookQueue.add(
            "resend-event",
            req.body,
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: 100,
                removeOnFail: 50,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Webhook received.",
        });

    } catch (error) {
        next(error);
    }
};