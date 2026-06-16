-- =========================================
-- CAR BRANDS
-- =========================================

INSERT INTO car_brands(name)
VALUES
('Hyundai'),
('Maruti Suzuki'),
('Honda'),
('Tata'),
('Mahindra');

-- =========================================
-- CAR MODELS
-- =========================================

INSERT INTO car_models(brand_id, name)
VALUES
-- Hyundai
(1, 'Creta'),
(1, 'Venue'),

-- Maruti Suzuki
(2, 'Swift'),
(2, 'Baleno'),

-- Honda
(3, 'City'),

-- Tata
(4, 'Nexon'),

-- Mahindra
(5, 'Scorpio N');

-- =========================================
-- CAR VARIANTS
-- =========================================

INSERT INTO car_variants(model_id, name)
VALUES

-- Creta
(1, 'E'),
(1, 'EX'),
(1, 'S'),
(1, 'SX'),
(1, 'SX(O)'),

-- Venue
(2, 'E'),
(2, 'S'),
(2, 'SX'),
(2, 'SX(O)'),

-- Swift
(3, 'LXI'),
(3, 'VXI'),
(3, 'ZXI'),
(3, 'ZXI+'),

-- Baleno
(4, 'Sigma'),
(4, 'Delta'),
(4, 'Zeta'),
(4, 'Alpha'),

-- City
(5, 'SV'),
(5, 'V'),
(5, 'VX'),
(5, 'ZX'),

-- Nexon
(6, 'Smart'),
(6, 'Pure'),
(6, 'Creative'),
(6, 'Fearless'),

-- Scorpio N
(7, 'Z2'),
(7, 'Z4'),
(7, 'Z6'),
(7, 'Z8');