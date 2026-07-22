import pool from "../config/db.js";

export const createCampaignRecipients = async (campaignId, userIds) => {
    if (userIds.length === 0) return;

    const values = [];
    const placeholders = [];

    userIds.forEach((userId, index) => {
        const base = index * 2;

        placeholders.push(`($${base + 1}, $${base + 2})`);

        values.push(campaignId, userId);
    });

    await pool.query(
        `
        INSERT INTO campaign_recipients
        (
            campaign_id,
            user_id
        )
        VALUES
        ${placeholders.join(", ")}
        ON CONFLICT (campaign_id, user_id)
        DO NOTHING;
        `,
        values
    );
};

export const markRecipientSent = async (campaignId, userId) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Sent',
            sent_at = NOW(),
            error_message = NULL,
            updated_at = NOW()
        WHERE campaign_id = $1
        AND user_id = $2;
        `,
        [campaignId, userId]
    );
};

export const markRecipientFailed = async (
    campaignId,
    userId,
    errorMessage
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Failed',
            error_message = $3,
            updated_at = NOW()
        WHERE campaign_id = $1
        AND user_id = $2;
        `,
        [campaignId, userId, errorMessage]
    );
};

export const getCampaignAnalytics = async (campaignId) => {
    const result = await pool.query(
        `
        SELECT

            COUNT(*) AS total_recipients,

            COUNT(*) FILTER (
                WHERE status = 'Sent'
            ) AS sent,

            COUNT(*) FILTER (
                WHERE status = 'Failed'
            ) AS failed,

            COUNT(*) FILTER (
                WHERE status = 'Pending'
            ) AS pending

        FROM campaign_recipients

        WHERE campaign_id = $1;
        `,
        [campaignId]
    );

    return result.rows[0];
};

export const getCampaignRecipients = async (
    campaignId,
    status = null
) => {
    let query = `
        SELECT

            u.id,

            u.full_name,

            u.email,

            cr.status,

            cr.error_message,

            cr.sent_at

        FROM campaign_recipients cr

        JOIN users u
            ON cr.user_id = u.id

        WHERE cr.campaign_id = $1
    `;

    const values = [campaignId];

    if (status) {
        query += ` AND cr.status = $2`;
        values.push(status);
    }

    query += `
        ORDER BY
            u.full_name ASC;
    `;

    const result = await pool.query(query, values);

    return result.rows;
};