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

export const saveMessageId = async (
    campaignId,
    userId,
    messageId
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            message_id = $3,
            sent_at = NOW(),
            updated_at = NOW()
        WHERE campaign_id = $1
        AND user_id = $2;
        `,
        [campaignId, userId, messageId]
    );
};

export const markRecipientSent = async (messageId) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Sent',
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId]
    );
};

export const markRecipientBounced = async (
    messageId,
    errorMessage = null
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Bounced',
            error_message = $2,
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId, errorMessage]
    );
};

export const markRecipientDelivered = async (
    messageId,
    errorMessage = null
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Delivered',
            error_message = $2,
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId, errorMessage]
    );
};

export const markRecipientComplained = async (
    messageId
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Complained',
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId]
    );
};

export const markRecipientDelayed = async (
    messageId
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            status = 'Delayed',
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId]
    );
};

export const markRecipientOpened = async (
    messageId
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            opened_at = COALESCE(opened_at, NOW()),
            open_count = open_count + 1,
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId]
    );
};

export const markRecipientClicked = async (
    messageId
) => {
    await pool.query(
        `
        UPDATE campaign_recipients
        SET
            clicked_at = COALESCE(clicked_at, NOW()),
            click_count = click_count + 1,
            updated_at = NOW()
        WHERE message_id = $1;
        `,
        [messageId]
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

            COUNT(*) AS total,

            COUNT(*) FILTER (
                WHERE status = 'Pending'
            ) AS pending,

            COUNT(*) FILTER (
                WHERE status = 'Sent'
            ) AS sent,

            COUNT(*) FILTER (
                WHERE status = 'Bounced'
            ) AS bounced,

            COUNT(*) FILTER (
                WHERE status = 'Complained'
            ) AS complained,

            COUNT(*) FILTER (
                WHERE status = 'Delayed'
            ) AS delayed,

            COUNT(*) FILTER (
                WHERE status = 'Failed'
            ) AS failed,

            SUM(open_count) AS opens,

            SUM(click_count) AS clicks

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

            cr.sent_at,

            cr.open_count,

            cr.click_count,

            cr.opened_at,

            cr.clicked_at

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