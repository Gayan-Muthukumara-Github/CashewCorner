-- ============================================================================
-- Cashew Corner - MySQL Database Schema and Seed Data
-- ============================================================================
-- This SQL file is compatible with MySQL 5.7+ and MariaDB 10.2+
-- Can be imported directly via phpMyAdmin or MySQL command line
-- 
-- Usage:
--   mysql -u username -p database_name < cashew-corner-mysql-dump.sql
--   OR import via phpMyAdmin
-- ============================================================================

-- Set character encoding
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

-- Disable foreign key checks during import
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- ============================================================================
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `payrolls`;
DROP TABLE IF EXISTS `employee_duties`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `stock_movements`;
DROP TABLE IF EXISTS `inventory`;
DROP TABLE IF EXISTS `sales_order_items`;
DROP TABLE IF EXISTS `sales_orders`;
DROP TABLE IF EXISTS `purchase_order_items`;
DROP TABLE IF EXISTS `purchase_orders`;
DROP TABLE IF EXISTS `product_category_map`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `product_categories`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `suppliers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

-- ============================================================================
-- TABLE: roles
-- Description: User roles in the system (e.g., ADMIN, USER, MANAGER)
-- ============================================================================
CREATE TABLE `roles` (
    `role_id` BIGINT NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`role_id`),
    UNIQUE KEY `uk_roles_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: users
-- Description: System users with authentication credentials
-- ============================================================================
CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `first_name` VARCHAR(100) DEFAULT NULL,
    `last_name` VARCHAR(100) DEFAULT NULL,
    `role_id` BIGINT DEFAULT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_users_username` (`username`),
    UNIQUE KEY `uk_users_email` (`email`),
    KEY `fk_users_role` (`role_id`),
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: suppliers
-- Description: Supplier information for purchase orders
-- ============================================================================
CREATE TABLE `suppliers` (
    `supplier_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `address` TEXT DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `contact_person` VARCHAR(150) DEFAULT NULL,
    `payment_terms` VARCHAR(255) DEFAULT NULL,
    `is_approved` TINYINT(1) DEFAULT 0,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: customers
-- Description: Customer information for sales orders
-- ============================================================================
CREATE TABLE `customers` (
    `customer_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `address` TEXT DEFAULT NULL,
    `type` VARCHAR(50) DEFAULT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: product_categories
-- Description: Product category classifications
-- ============================================================================
CREATE TABLE `product_categories` (
    `category_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`category_id`),
    UNIQUE KEY `uk_product_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: products
-- Description: Product catalog with pricing information
-- ============================================================================
CREATE TABLE `products` (
    `product_id` BIGINT NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(100) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `unit` VARCHAR(50) DEFAULT NULL,
    `cost_price` DECIMAL(15,2) DEFAULT 0.00,
    `sell_price` DECIMAL(15,2) DEFAULT 0.00,
    `reorder_level` DECIMAL(15,2) DEFAULT 0.00,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`product_id`),
    UNIQUE KEY `uk_products_sku` (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: product_category_map
-- Description: Many-to-many relationship between products and categories
-- ============================================================================
CREATE TABLE `product_category_map` (
    `product_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    PRIMARY KEY (`product_id`, `category_id`),
    KEY `fk_pcm_category` (`category_id`),
    CONSTRAINT `fk_pcm_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pcm_category` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: inventory
-- Description: Product inventory tracking by location
-- ============================================================================
CREATE TABLE `inventory` (
    `inventory_id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `quantity_on_hand` DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
    `reserved_quantity` DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`inventory_id`),
    KEY `fk_inventory_product` (`product_id`),
    CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: stock_movements
-- Description: Stock movement history for audit trail
-- ============================================================================
CREATE TABLE `stock_movements` (
    `movement_id` BIGINT NOT NULL AUTO_INCREMENT,
    `product_id` BIGINT NOT NULL,
    `movement_type` VARCHAR(50) NOT NULL,
    `related_type` VARCHAR(50) DEFAULT NULL,
    `related_id` BIGINT DEFAULT NULL,
    `quantity` DECIMAL(18,4) NOT NULL,
    `balance_after` DECIMAL(18,4) DEFAULT NULL,
    `movement_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` BIGINT DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    PRIMARY KEY (`movement_id`),
    KEY `fk_stock_movements_product` (`product_id`),
    CONSTRAINT `fk_stock_movements_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: purchase_orders
-- Description: Purchase orders from suppliers
-- ============================================================================
CREATE TABLE `purchase_orders` (
    `purchase_order_id` BIGINT NOT NULL AUTO_INCREMENT,
    `po_number` VARCHAR(100) NOT NULL,
    `supplier_id` BIGINT NOT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `order_date` DATE NOT NULL,
    `expected_date` DATE DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT 'pending',
    `total_amount` DECIMAL(18,2) DEFAULT 0.00,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`purchase_order_id`),
    UNIQUE KEY `uk_purchase_orders_po_number` (`po_number`),
    KEY `fk_purchase_orders_supplier` (`supplier_id`),
    CONSTRAINT `fk_purchase_orders_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: purchase_order_items
-- Description: Line items for purchase orders
-- ============================================================================
CREATE TABLE `purchase_order_items` (
    `purchase_order_item_id` BIGINT NOT NULL AUTO_INCREMENT,
    `purchase_order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    `unit_price` DECIMAL(15,2) DEFAULT 0.00,
    `received_quantity` DECIMAL(15,4) DEFAULT 0.0000,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`purchase_order_item_id`),
    KEY `fk_poi_purchase_order` (`purchase_order_id`),
    KEY `fk_poi_product` (`product_id`),
    CONSTRAINT `fk_poi_purchase_order` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_poi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: sales_orders
-- Description: Sales orders to customers
-- ============================================================================
CREATE TABLE `sales_orders` (
    `sales_order_id` BIGINT NOT NULL AUTO_INCREMENT,
    `so_number` VARCHAR(100) NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `order_date` DATE NOT NULL,
    `delivery_date` DATE DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT 'pending',
    `total_amount` DECIMAL(18,2) DEFAULT 0.00,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`sales_order_id`),
    UNIQUE KEY `uk_sales_orders_so_number` (`so_number`),
    KEY `fk_sales_orders_customer` (`customer_id`),
    CONSTRAINT `fk_sales_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: sales_order_items
-- Description: Line items for sales orders
-- ============================================================================
CREATE TABLE `sales_order_items` (
    `sales_order_item_id` BIGINT NOT NULL AUTO_INCREMENT,
    `sales_order_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    `unit_price` DECIMAL(15,2) DEFAULT 0.00,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`sales_order_item_id`),
    KEY `fk_soi_sales_order` (`sales_order_id`),
    KEY `fk_soi_product` (`product_id`),
    CONSTRAINT `fk_soi_sales_order` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`sales_order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_soi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: employees
-- Description: Employee information
-- ============================================================================
CREATE TABLE `employees` (
    `employee_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT DEFAULT NULL,
    `employee_code` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(100) DEFAULT NULL,
    `last_name` VARCHAR(100) DEFAULT NULL,
    `designation` VARCHAR(100) DEFAULT NULL,
    `department` VARCHAR(100) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `hire_date` DATE DEFAULT NULL,
    `salary_base` DECIMAL(18,2) DEFAULT 0.00,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`employee_id`),
    UNIQUE KEY `uk_employees_employee_code` (`employee_code`),
    KEY `fk_employees_user` (`user_id`),
    CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: employee_duties
-- Description: Task assignments for employees
-- ============================================================================
CREATE TABLE `employee_duties` (
    `duty_id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT NOT NULL,
    `task_type` VARCHAR(100) DEFAULT NULL,
    `sales_order_id` BIGINT DEFAULT NULL,
    `purchase_order_id` BIGINT DEFAULT NULL,
    `start_date` DATETIME DEFAULT NULL,
    `end_date` DATETIME DEFAULT NULL,
    `status` VARCHAR(50) DEFAULT 'assigned',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`duty_id`),
    KEY `fk_duties_employee` (`employee_id`),
    KEY `fk_duties_sales_order` (`sales_order_id`),
    KEY `fk_duties_purchase_order` (`purchase_order_id`),
    CONSTRAINT `fk_duties_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_duties_sales_order` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`sales_order_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_duties_purchase_order` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: payrolls
-- Description: Employee payroll records
-- ============================================================================
CREATE TABLE `payrolls` (
    `payroll_id` BIGINT NOT NULL AUTO_INCREMENT,
    `employee_id` BIGINT NOT NULL,
    `period_start` DATE NOT NULL,
    `period_end` DATE NOT NULL,
    `gross_pay` DECIMAL(18,2) DEFAULT 0.00,
    `deductions` DECIMAL(18,2) DEFAULT 0.00,
    `net_pay` DECIMAL(18,2) DEFAULT 0.00,
    `payment_date` DATE DEFAULT NULL,
    `payment_method` VARCHAR(100) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`payroll_id`),
    KEY `fk_payrolls_employee` (`employee_id`),
    CONSTRAINT `fk_payrolls_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: reports
-- Description: Generated report records
-- ============================================================================
CREATE TABLE `reports` (
    `report_id` BIGINT NOT NULL AUTO_INCREMENT,
    `report_type` VARCHAR(100) DEFAULT NULL,
    `parameters` VARCHAR(4000) DEFAULT NULL,
    `generated_by` BIGINT DEFAULT NULL,
    `generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `file_path` VARCHAR(500) DEFAULT NULL,
    PRIMARY KEY (`report_id`),
    KEY `fk_reports_user` (`generated_by`),
    CONSTRAINT `fk_reports_user` FOREIGN KEY (`generated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Insert roles
-- ----------------------------------------------------------------------------
INSERT INTO `roles` (`role_name`, `description`) VALUES
('ADMIN', 'Administrator role with full access'),
('USER', 'Regular user role'),
('MANAGER', 'Manager role with limited admin access');

-- ----------------------------------------------------------------------------
-- Insert users
-- Password: admin123 (BCrypt hashed with strength 10)
-- Password: cashew@123 (BCrypt hashed with strength 10)
-- Password: user123 (BCrypt hashed with strength 10)
-- Password: manager123 (BCrypt hashed with strength 10)
-- ----------------------------------------------------------------------------
INSERT INTO `users` (`username`, `password_hash`, `email`, `first_name`, `last_name`, `role_id`, `is_active`, `created_at`, `updated_at`) VALUES
('admin', '$2a$10$z3R1nDm.9RE44GsLfY8x/OgeD5WvvgqwLmEZPUM47dP45/q7O02SW', 'admin@cashewcorner.com', 'Admin', 'User', 1, 1, NOW(), NOW()),
('techadmin', '$2a$10$adn.i02TUql1eCCmSLTBlOqKSbHWOaYR/Uzv1rlCri4w0wfasNi1q', 'techadmin@cashewcorner.com', 'Tech', 'Admin', 1, 1, NOW(), NOW()),
('user', '$2a$10$CfUIhGo2Ky0cqgn9L2jREOhlegDHnbih7.3oUoj6ICIiw/1z5ZI.u$2a$10$WcS5QeZOPo6o6w.diLr.fOaYoyNmUatcq651ztlsM0fCT0LbnMXYO', 'user@cashewcorner.com', 'John', 'Doe', 2, 1, NOW(), NOW()),
('manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRjk38', 'manager@cashewcorner.com', 'Jane', 'Smith', 3, 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert suppliers
-- ----------------------------------------------------------------------------
INSERT INTO `suppliers` (`name`, `email`, `phone`, `contact_person`, `is_active`, `created_at`, `updated_at`) VALUES
('Supplier One', 'supplier1@example.com', '+1-555-0001', 'John Contact', 1, NOW(), NOW()),
('Supplier Two', 'supplier2@example.com', '+1-555-0002', 'Jane Contact', 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert customers
-- ----------------------------------------------------------------------------
INSERT INTO `customers` (`name`, `email`, `phone`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
('Customer One', 'customer1@example.com', '+1-555-1001', 'retail', 1, NOW(), NOW()),
('Customer Two', 'customer2@example.com', '+1-555-1002', 'wholesale', 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert product categories
-- ----------------------------------------------------------------------------
INSERT INTO `product_categories` (`name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
('Raw Cashews', 'Raw cashew nuts', 1, NOW(), NOW()),
('Roasted Cashews', 'Roasted cashew nuts', 1, NOW(), NOW()),
('Cashew Butter', 'Cashew butter products', 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert products
-- ----------------------------------------------------------------------------
INSERT INTO `products` (`sku`, `name`, `description`, `unit`, `cost_price`, `sell_price`, `reorder_level`, `is_active`, `created_at`, `updated_at`) VALUES
('SKU-001', 'Raw Cashew Nuts 1kg', 'Premium raw cashew nuts', 'kg', 500.00, 750.00, 10.00, 1, NOW(), NOW()),
('SKU-002', 'Roasted Cashew Nuts 500g', 'Roasted and salted cashew nuts', 'g', 300.00, 450.00, 20.00, 1, NOW(), NOW()),
('SKU-003', 'Cashew Butter 250ml', 'Pure cashew butter', 'ml', 200.00, 350.00, 15.00, 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Map products to categories
-- ----------------------------------------------------------------------------
INSERT INTO `product_category_map` (`product_id`, `category_id`) VALUES
(1, 1),
(2, 2),
(3, 3);

-- ----------------------------------------------------------------------------
-- Insert inventory
-- ----------------------------------------------------------------------------
INSERT INTO `inventory` (`product_id`, `location`, `quantity_on_hand`, `reserved_quantity`, `last_updated`) VALUES
(1, 'Warehouse A', 100.0000, 10.0000, NOW()),
(2, 'Warehouse A', 200.0000, 20.0000, NOW()),
(3, 'Warehouse B', 150.0000, 15.0000, NOW());

-- ============================================================================
-- END OF DUMP
-- ============================================================================

