import pool from "../config/db.js";


export const getCatalogProducts = async (
    filters,
    variantIds = []
) => {

    const {

        page = 1,

        limit = 10,

        search,

        categoryId,

        minPrice,

        maxPrice,

        sort = "price",

        order = "ASC"

    } = filters;

    let query = `

        SELECT

            p.*,

            c.id AS category_id,

            c.name AS category_name,

            (

                SELECT

                    COALESCE(

                        json_agg(

                            json_build_object(

                                'id', pi.id,

                                'imageUrl', pi.image_url,

                                'displayOrder', pi.display_order

                            )

                            ORDER BY pi.display_order

                        ),

                        '[]'

                    )

                FROM product_images pi

                WHERE pi.product_id = p.id

            ) AS images

        FROM products p

        LEFT JOIN categories c

        ON p.category_id = c.id

        WHERE 1 = 1

    `;

    const values = [];

    let index = 1;

    // Compatibility Filter
    if (variantIds.length > 0) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                WHERE

                    pc.product_id = p.id

                    AND pc.variant_id = ANY($${index}::int[])

            )

        `;

        values.push(variantIds);

        index++;

    }

    // Search
    if (search) {

        query += `

            AND LOWER(p.name)

            LIKE LOWER($${index})

        `;

        values.push(`%${search}%`);

        index++;

    }

    // Category
    if (categoryId) {

        query += `

            AND p.category_id = $${index}

        `;

        values.push(categoryId);

        index++;

    }

    // Minimum Price
    if (minPrice) {

        query += `

            AND p.price >= $${index}

        `;

        values.push(minPrice);

        index++;

    }

    // Maximum Price
    if (maxPrice) {

        query += `

            AND p.price <= $${index}

        `;

        values.push(maxPrice);

        index++;

    }

    const allowedSortFields = [

        "price"

    ];

    const sortField =

        allowedSortFields.includes(sort)

            ? sort

            : "price";

    const sortOrder =

        order.toUpperCase() === "DESC"

            ? "DESC"

            : "ASC";

    query += `

        ORDER BY

            p.${sortField} ${sortOrder}

    `;

    const pageNumber = Number(page);

    const limitNumber = Number(limit);

    const offset =

        (pageNumber - 1) * limitNumber;

    query += `

        LIMIT $${index}

        OFFSET $${index + 1}

    `;

    values.push(limitNumber);

    values.push(offset);

    const result = await pool.query(

        query,

        values

    );

    return result.rows;

};

export const countCatalogProducts = async (
    filters,
    variantIds = []
) => {

    const {

        search,

        categoryId,

        minPrice,

        maxPrice

    } = filters;

    let query = `

        SELECT

            COUNT(*) AS total

        FROM products p

        WHERE 1 = 1

    `;

    const values = [];

    let index = 1;

    // Compatibility Filter
    if (variantIds.length > 0) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                WHERE

                    pc.product_id = p.id

                    AND pc.variant_id = ANY($${index}::int[])

            )

        `;

        values.push(variantIds);

        index++;

    }

    // Search
    if (search) {

        query += `

            AND LOWER(p.name)

            LIKE LOWER($${index})

        `;

        values.push(`%${search}%`);

        index++;

    }

    // Category
    if (categoryId) {

        query += `

            AND p.category_id = $${index}

        `;

        values.push(categoryId);

        index++;

    }

    // Minimum Price
    if (minPrice) {

        query += `

            AND p.price >= $${index}

        `;

        values.push(minPrice);

        index++;

    }

    // Maximum Price
    if (maxPrice) {

        query += `

            AND p.price <= $${index}

        `;

        values.push(maxPrice);

        index++;

    }

    const result = await pool.query(

        query,

        values

    );

    return Number(result.rows[0].total);

};

export const getCatalogProductById = async (id) => {

    const result = await pool.query(

        `

        SELECT

            p.*,

            c.id AS category_id,

            c.name AS category_name,

            (

                SELECT

                    COALESCE(

                        json_agg(

                            json_build_object(

                                'id', pi.id,

                                'imageUrl', pi.image_url,

                                'displayOrder', pi.display_order

                            )

                            ORDER BY pi.display_order

                        ),

                        '[]'

                    )

                FROM product_images pi

                WHERE pi.product_id = p.id

            ) AS images

        FROM products p

        LEFT JOIN categories c

        ON p.category_id = c.id

        WHERE p.id = $1

        `,

        [id]

    );

    return result.rows[0];

};