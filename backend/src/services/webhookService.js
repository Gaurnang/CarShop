import {
    markRecipientDelivered,
    markRecipientBounced,
    markRecipientComplained,
    markRecipientDelayed,
    markRecipientOpened,
    markRecipientClicked,
} from "../repositories/campaignRecipientRepository.js";

export const processWebhookEvent = async (payload) => {

    const { type, data } = payload;

    switch (type) {

        case "email.delivered":

            await markRecipientDelivered(data.email_id);

            break;

        case "email.bounced":

            await markRecipientBounced(
                data.email_id,
                data.bounce?.reason || null
            );

            break;

        case "email.complained":

            await markRecipientComplained(data.email_id);

            break;

        case "email.delivery_delayed":

            await markRecipientDelayed(data.email_id);

            break;

        case "email.opened":

            await markRecipientOpened(data.email_id);

            break;

        case "email.clicked":

            await markRecipientClicked(data.email_id);

            break;

        default:

            console.log(`Unhandled webhook event: ${type}`);

    }

};