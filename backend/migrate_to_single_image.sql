-- Migration: Migrate from multiple product_images to single product image_url
-- 1. Add image_url and image_public_id columns to products table if they don't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_public_id VARCHAR(255);

-- 2. Populate products.image_url and products.image_public_id with the first image from product_images
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'product_images') THEN
        UPDATE products p
        SET 
            image_url = pi.image_url,
            image_public_id = pi.public_id
        FROM (
            SELECT DISTINCT ON (product_id) product_id, image_url, public_id
            FROM product_images
            ORDER BY product_id, display_order ASC, id ASC
        ) pi
        WHERE p.id = pi.product_id AND (p.image_url IS NULL OR p.image_url = '');

        -- 3. Drop product_images table
        DROP TABLE IF EXISTS product_images CASCADE;
    END IF;
END $$;
