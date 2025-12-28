-- Test data initialization for Cashew Corner
-- This file is loaded after schema.sql to populate test data

-- Insert test roles
INSERT INTO roles (role_name, description) VALUES ('ADMIN', 'Administrator role with full access');
INSERT INTO roles (role_name, description) VALUES ('USER', 'Regular user role');
INSERT INTO roles (role_name, description) VALUES ('MANAGER', 'Manager role with limited admin access');

-- Insert test users
-- Password: admin123 (BCrypt hashed with strength 10)
INSERT INTO users (username, password_hash, email, first_name, last_name, role_id, is_active, created_at, updated_at)
VALUES ('admin', '$2a$10$z3R1nDm.9RE44GsLfY8x/OgeD5WvvgqwLmEZPUM47dP45/q7O02SW', 'admin@cashewcorner.com', 'Admin', 'User', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Password: cashew@123 (BCrypt hashed with strength 10)
INSERT INTO users (username, password_hash, email, first_name, last_name, role_id, is_active, created_at, updated_at)
VALUES ('techadmin', '$2a$10$adn.i02TUql1eCCmSLTBlOqKSbHWOaYR/Uzv1rlCri4w0wfasNi1q', 'techadmin@cashewcorner.com', 'Tech', 'Admin', 1, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Password: user123 (BCrypt hashed with strength 10)
INSERT INTO users (username, password_hash, email, first_name, last_name, role_id, is_active, created_at, updated_at)
VALUES ('user', '$2a$10$CfUIhGo2Ky0cqgn9L2jREOhlegDHnbih7.3oUoj6ICIiw/1z5ZI.u$2a$10$WcS5QeZOPo6o6w.diLr.fOaYoyNmUatcq651ztlsM0fCT0LbnMXYO', 'user@cashewcorner.com', 'John', 'Doe', 2, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Password: manager123 (BCrypt hashed with strength 10)
INSERT INTO users (username, password_hash, email, first_name, last_name, role_id, is_active, created_at, updated_at)
VALUES ('manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRjk38', 'manager@cashewcorner.com', 'Jane', 'Smith', 3, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test suppliers
INSERT INTO suppliers (name, email, phone, contact_person, is_active, created_at, updated_at)
VALUES ('Supplier One', 'supplier1@example.com', '+1-555-0001', 'John Contact', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO suppliers (name, email, phone, contact_person, is_active, created_at, updated_at)
VALUES ('Supplier Two', 'supplier2@example.com', '+1-555-0002', 'Jane Contact', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test customers
INSERT INTO customers (name, email, phone, type, is_active, created_at, updated_at)
VALUES ('Customer One', 'customer1@example.com', '+1-555-1001', 'retail', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO customers (name, email, phone, type, is_active, created_at, updated_at)
VALUES ('Customer Two', 'customer2@example.com', '+1-555-1002', 'wholesale', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test product categories
INSERT INTO product_categories (name, description, is_active, created_at, updated_at)
VALUES ('Raw Cashews', 'Raw cashew nuts', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_categories (name, description, is_active, created_at, updated_at)
VALUES ('Roasted Cashews', 'Roasted cashew nuts', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_categories (name, description, is_active, created_at, updated_at)
VALUES ('Cashew Butter', 'Cashew butter products', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test products
INSERT INTO products (sku, name, description, unit, cost_price, sell_price, reorder_level, is_active, created_at, updated_at)
VALUES ('SKU-001', 'Raw Cashew Nuts 1kg', 'Premium raw cashew nuts', 'kg', 500.00, 750.00, 10.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (sku, name, description, unit, cost_price, sell_price, reorder_level, is_active, created_at, updated_at)
VALUES ('SKU-002', 'Roasted Cashew Nuts 500g', 'Roasted and salted cashew nuts', 'g', 300.00, 450.00, 20.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO products (sku, name, description, unit, cost_price, sell_price, reorder_level, is_active, created_at, updated_at)
VALUES ('SKU-003', 'Cashew Butter 250ml', 'Pure cashew butter', 'ml', 200.00, 350.00, 15.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Map products to categories
INSERT INTO product_category_map (product_id, category_id) VALUES (1, 1);
INSERT INTO product_category_map (product_id, category_id) VALUES (2, 2);
INSERT INTO product_category_map (product_id, category_id) VALUES (3, 3);

-- Insert test inventory
INSERT INTO inventory (product_id, location, quantity_on_hand, reserved_quantity, last_updated)
VALUES (1, 'Warehouse A', 100.00, 10.00, CURRENT_TIMESTAMP);

INSERT INTO inventory (product_id, location, quantity_on_hand, reserved_quantity, last_updated)
VALUES (2, 'Warehouse A', 200.00, 20.00, CURRENT_TIMESTAMP);

INSERT INTO inventory (product_id, location, quantity_on_hand, reserved_quantity, last_updated)
VALUES (3, 'Warehouse B', 150.00, 15.00, CURRENT_TIMESTAMP);

