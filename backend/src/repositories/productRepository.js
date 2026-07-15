import pool from "../config/db.js";

export const createProduct = async (
    name,
    description,
    price,
    categoryId
) => {

    const result = await pool.query(

        `
        INSERT INTO products
        (
            name,
            description,
            price,
            category_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *;
        `,

        [
            name,
            description,
            price,
            categoryId
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

            ) AS images,

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

    isActive

) => {

    const result = await pool.query(

        `
        UPDATE products

        SET

            name=$1,

            description=$2,

            price=$3,

            is_active=$4,

            updated_at=CURRENT_TIMESTAMP

        WHERE id=$5

        RETURNING *;
        `,

        [

            name,

            description,

            price,

            isActive,

            id

        ]

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