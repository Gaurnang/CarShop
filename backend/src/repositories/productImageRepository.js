import pool from "../config/db.js";

export const saveProductImage = async (

    productId,

    imageUrl,

    publicId,

    displayOrder

) => {

    const result = await pool.query(

        `
        INSERT INTO product_images
        (
            product_id,
            image_url,
            public_id,
            display_order
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING *;
        `,

        [

            productId,

            imageUrl,

            publicId,

            displayOrder

        ]

    );

    return result.rows[0];

};

export const getProductImages = async (

    productId

) => {

    const result = await pool.query(

        `
        SELECT *

        FROM product_images

        WHERE product_id = $1

        ORDER BY display_order;
        `,

        [

            productId

        ]

    );

    return result.rows;

};

export const getImageById = async (

    imageId

) => {

    const result = await pool.query(

        `
        SELECT *

        FROM product_images

        WHERE id = $1;
        `,

        [

            imageId

        ]

    );

    return result.rows[0];

};

export const deleteImage = async (

    imageId

) => {

    await pool.query(

        `
        DELETE

        FROM product_images

        WHERE id = $1;
        `,

        [

            imageId

        ]

    );

};

export const getMaxDisplayOrder = async (productId) => {

    const result = await pool.query(

        `
        SELECT COALESCE(MAX(display_order),0) AS max_order

        FROM product_images

        WHERE product_id = $1;
        `,

        [productId]

    );

    return Number(result.rows[0].max_order);

};