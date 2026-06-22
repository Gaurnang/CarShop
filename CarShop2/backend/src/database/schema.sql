CREATE TABLE car_brands (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE car_models (
    id BIGSERIAL PRIMARY KEY,
    brand_id BIGINT NOT NULL REFERENCES car_brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE car_variants (
    id BIGSERIAL PRIMARY KEY,
    model_id BIGINT NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_compatibility (
    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT NOT NULL,

    variant_id BIGINT NOT NULL,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (variant_id)
        REFERENCES car_variants(id)
        ON DELETE CASCADE,

    UNIQUE(product_id, variant_id)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_saved_cars (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    variant_id BIGINT NOT NULL,

    nickname VARCHAR(100),

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (variant_id)
        REFERENCES car_variants(id)
        ON DELETE CASCADE,
    UNIQUE(user_id, variant_id)
);

CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    subject VARCHAR(255) NOT NULL,

    content TEXT NOT NULL,

    status VARCHAR(20)
    DEFAULT 'DRAFT',

    total_recipients INTEGER
    DEFAULT 0,

    sent_at TIMESTAMP,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE campaign_products (
    campaign_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    PRIMARY KEY (
      campaign_id,
      product_id
    ),

    FOREIGN KEY (campaign_id)
      REFERENCES campaigns(id)
      ON DELETE CASCADE,

    FOREIGN KEY (product_id)
      REFERENCES products(id)
      ON DELETE CASCADE
);