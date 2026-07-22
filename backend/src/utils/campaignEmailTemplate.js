export const campaignEmailTemplate = (user, campaign) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${campaign.name}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
                <td align="center">

                    <table width="600" cellpadding="0" cellspacing="0"
                        style="background:#ffffff;border-radius:8px;padding:40px;">

                        <tr>
                            <td align="center">
                                <h1 style="margin:0;color:#222;">
                                    🚗 CarShop
                                </h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top:30px;">
                                <h2 style="margin:0;">
                                    Hello ${user.full_name},
                                </h2>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top:20px;">
                                <p style="font-size:16px;line-height:26px;color:#555;">
                                    ${campaign.description}
                                </p>
                            </td>
                        </tr>

                        ${
                            campaign.image_url
                                ? `
                            <tr>
                                <td align="center" style="padding:30px 0;">
                                    <img
                                        src="${campaign.image_url}"
                                        alt="${campaign.name}"
                                        style="max-width:100%;border-radius:8px;"
                                    />
                                </td>
                            </tr>
                        `
                                : ""
                        }

                        ${
                            campaign.cta_url
                                ? `
                            <tr>
                                <td align="center" style="padding-top:20px;">
                                    <a
                                        href="${campaign.cta_url}"
                                        style="
                                            display:inline-block;
                                            background:#2563eb;
                                            color:white;
                                            text-decoration:none;
                                            padding:14px 30px;
                                            border-radius:6px;
                                            font-weight:bold;
                                        ">
                                        View Offer
                                    </a>
                                </td>
                            </tr>
                        `
                                : ""
                        }

                        <tr>
                            <td style="padding-top:40px;">
                                <hr>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top:10px;">
                                <p
                                    style="
                                        color:#888;
                                        font-size:13px;
                                        text-align:center;
                                    ">
                                    Thank you for choosing CarShop ❤️
                                </p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `;
};