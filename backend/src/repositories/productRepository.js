import pool from "../config/db.js";

export const createProduct = async (
    name,
    description,
    price,
    categoryId,
    imageUrl = null,
    imagePublicId = null
) => {

    const result = await pool.query(

        `
        INSERT INTO products
        (
            name,
            description,
            price,
            category_id,
            image_url,
            image_public_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        RETURNING *;
        `,

        [
            name,
            description,
            price,
            categoryId,
            imageUrl,
            imagePublicId
        ]

    );

    return result.rows[0];

};

export const getProductByName = async (
    name
) => {

    const result = await pool.query(

        `
        SELECT *

        FROM products

        WHERE LOWER(name)=LOWER($1);
        `,

        [

            name

        ]

    );

    return result.rows[0];

};

export const getProducts = async (filters = {}) => {

    const {

        page = 1,

        limit = 10,

        search,

        categoryId,

        brandId,

        modelId,

        variantId,

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

            p.image_url AS "imageUrl",

            CASE
                WHEN p.image_url IS NOT NULL THEN
                    json_build_array(
                        json_build_object(
                            'id', p.id,
                            'imageUrl', p.image_url
                        )
                    )
                ELSE '[]'::json
            END AS images

        FROM products p

        LEFT JOIN categories c

        ON p.category_id = c.id

        WHERE 1 = 1

    `;

    const values = [];

    let index = 1;

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

    // Brand
    if (brandId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                JOIN car_variants v

                ON pc.variant_id = v.id

                JOIN car_models m

                ON v.model_id = m.id

                JOIN car_brands b

                ON m.brand_id = b.id

                WHERE pc.product_id = p.id

                AND b.id = $${index}

            )

        `;

        values.push(brandId);

        index++;

    }

    // Model
    if (modelId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                JOIN car_variants v

                ON pc.variant_id = v.id

                JOIN car_models m

                ON v.model_id = m.id

                WHERE pc.product_id = p.id

                AND m.id = $${index}

            )

        `;

        values.push(modelId);

        index++;

    }

    // Variant
    if (variantId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                WHERE pc.product_id = p.id

                AND pc.variant_id = $${index}

            )

        `;

        values.push(variantId);

        index++;

    }

    // Min Price
    if (minPrice) {

        query += `

            AND p.price >= $${index}

        `;

        values.push(minPrice);

        index++;

    }

    // Max Price
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

export const countProducts = async (
    filters = {}
) => {

    const {

        search,

        categoryId,

        brandId,

        modelId,

        variantId,

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

    // Brand
    if (brandId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                JOIN car_variants v
                ON pc.variant_id = v.id

                JOIN car_models m
                ON v.model_id = m.id

                JOIN car_brands b
                ON m.brand_id = b.id

                WHERE pc.product_id = p.id

                AND b.id = $${index}

            )

        `;

        values.push(brandId);

        index++;

    }

    // Model
    if (modelId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                JOIN car_variants v
                ON pc.variant_id = v.id

                JOIN car_models m
                ON v.model_id = m.id

                WHERE pc.product_id = p.id

                AND m.id = $${index}

            )

        `;

        values.push(modelId);

        index++;

    }

    // Variant
    if (variantId) {

        query += `

            AND EXISTS (

                SELECT 1

                FROM product_compatibility pc

                WHERE pc.product_id = p.id

                AND pc.variant_id = $${index}

            )

        `;

        values.push(variantId);

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

export const getProductById = async (id) => {

    const result = await pool.query(

        `

        SELECT

            p.*,

            c.id AS category_id,

            c.name AS category_name,

            p.image_url AS "imageUrl",

            CASE
                WHEN p.image_url IS NOT NULL THEN
                    json_build_array(
                        json_build_object(
                            'id', p.id,
                            'imageUrl', p.image_url
                        )
                    )
                ELSE '[]'::json
            END AS images,

            (

                SELECT

                    COALESCE(

                        json_agg(

                            json_build_object(

                                'brandId', b.id,

                                'brand', b.name,

                                'modelId', m.id,

                                'model', m.name,

                                'variantId', v.id,

                                'variant', v.name

                            )

                            ORDER BY

                                b.name,

                                m.name,

                                v.name

                        ),

                        '[]'

                    )

                FROM product_compatibility pc

                JOIN car_variants v

                ON pc.variant_id = v.id

                JOIN car_models m

                ON v.model_id = m.id

                JOIN car_brands b

                ON m.brand_id = b.id

                WHERE pc.product_id = p.id

            ) AS compatibleCars

        FROM products p

        LEFT JOIN categories c

        ON p.category_id = c.id

        WHERE p.id = $1

        `,

        [id]

    );

    return result.rows[0];

};

export const updateProduct = async (

    id,

    name,

    description,

    price,

    isActive,

    imageUrl,

    imagePublicId

) => {

    const result = await pool.query(

        `
        UPDATE products

        SET

            name = COALESCE($1, name),

            description = COALESCE($2, description),

            price = COALESCE($3, price),

            is_active = COALESCE($4, is_active),

            image_url = CASE WHEN $5::text IS NOT NULL THEN $5 ELSE image_url END,

            image_public_id = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE image_public_id END,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $7

        RETURNING *;
        `,

        [

            name,

            description,

            price,

            isActive,

            imageUrl !== undefined ? imageUrl : null,

            imagePublicId !== undefined ? imagePublicId : null,

            id

        ]

    );

    return result.rows[0];

};

export const updateProductImage = async (
    id,
    imageUrl,
    imagePublicId = null
) => {

    const result = await pool.query(

        `
        UPDATE products

        SET

            image_url = $1,

            image_public_id = $2,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $3

        RETURNING *;
        `,

        [

            imageUrl,

            imagePublicId,

            id

        ]

    );

    return result.rows[0];

};

export const deleteProductImage = async (
    id
) => {

    const result = await pool.query(

        `
        UPDATE products

        SET

            image_url = NULL,

            image_public_id = NULL,

            updated_at = CURRENT_TIMESTAMP

        WHERE id = $1

        RETURNING *;
        `,

        [id]

    );

    return result.rows[0];

};

export const deleteProduct = async (
    id
) => {

    await pool.query(

        `
        DELETE

        FROM products

        WHERE id=$1;
        `,

        [

            id

        ]

    );

};