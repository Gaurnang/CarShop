CREATE TABLE car_brands (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE car_models (
    id BIGSERIAL PRIMARY KEY,

    brand_id BIGINT NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    UNIQUE(brand_id, name)
);

CREATE TABLE car_variants (
    id BIGSERIAL PRIMARY KEY,

    model_id BIGINT NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    UNIQUE(model_id, name)
);

CREATE TABLE categories (

    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,

    category_id BIGINT REFERENCES categories(id),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    price NUMERIC(10,2) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    public_id VARCHAR(255) NOT NULL,

    image_url TEXT NOT NULL,

    display_order INT DEFAULT 1
);

CREATE TABLE product_compatibility (
    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT NOT NULL REFERENCES products(id)  ON DELETE CASCADE,

    variant_id BIGINT NOT NULL REFERENCES car_variants(id)  ON DELETE CASCADE,

    UNIQUE(product_id, variant_id)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) CHECK(role IN ('ADMIN', 'CUSTOMER')) DEFAULT 'CUSTOMER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_saved_cars (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    variant_id BIGINT NOT NULL REFERENCES car_variants(id) ON DELETE CASCADE,

    nickname VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, variant_id)
);


CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    subject VARCHAR(255) NOT NULL,

    content TEXT NOT NULL,

    created_by BIGINT REFERENCES users(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaign_products (
    campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,

    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,

    PRIMARY KEY(campaign_id, product_id)
);

