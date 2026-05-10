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
DROP TABLE IF EXISTS `raw_cashew_stock_movements`;
DROP TABLE IF EXISTS `raw_cashew_inventory`;
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
DROP TABLE IF EXISTS `customer`;
DROP TABLE IF EXISTS `suppliers`;
DROP TABLE IF EXISTS `raw_cashew`;
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
-- TABLE: raw_cashew
-- Description: Raw cashew types and quality classifications
-- ============================================================================
CREATE TABLE `raw_cashew` (
    `cashew_type_id` BIGINT NOT NULL AUTO_INCREMENT,
    `cashew_type` VARCHAR(100) NOT NULL,
    `cashew_quality` VARCHAR(255) DEFAULT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`cashew_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: suppliers
-- Description: Supplier identity and preferred cashew type.
--              Contact details, payment terms, and order-specific cashew data
--              now live on purchase_orders.
-- ============================================================================
CREATE TABLE `suppliers` (
    `supplier_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `address` TEXT DEFAULT NULL,
    `cashew_type_id` BIGINT DEFAULT NULL,
    `distance` DECIMAL(15,2) DEFAULT NULL,
    -- Audit fields
    `created_by` BIGINT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`supplier_id`),
    KEY `fk_suppliers_cashew_type` (`cashew_type_id`),
    CONSTRAINT `fk_suppliers_cashew_type` FOREIGN KEY (`cashew_type_id`) REFERENCES `raw_cashew` (`cashew_type_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: customer
-- Description: Customer information for sales orders
-- ============================================================================
CREATE TABLE `customer` (
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
-- Description: Purchase orders from suppliers. Carries the contact details,
--              payment terms, and cashew-specific fields that were previously
--              on the suppliers table, making each order self-contained.
-- ============================================================================
CREATE TABLE `purchase_orders` (
    `purchase_order_id` BIGINT NOT NULL AUTO_INCREMENT,
    `po_number` VARCHAR(100) NOT NULL,
    `supplier_id` BIGINT NOT NULL,
    `created_by` BIGINT DEFAULT NULL,
    `order_date` DATE NOT NULL,
    `expected_date` DATE DEFAULT NULL,
    -- Contact & payment details (moved from suppliers)
    `phone` VARCHAR(50) DEFAULT NULL,
    `email` VARCHAR(150) DEFAULT NULL,
    `contact_person` VARCHAR(150) DEFAULT NULL,
    `payment_terms` VARCHAR(255) DEFAULT NULL,
    `is_approved` TINYINT(1) DEFAULT 0,
    -- Cashew-specific order details (moved from suppliers)
    `quantity` DECIMAL(18,4) DEFAULT NULL,
    `quality` VARCHAR(100) DEFAULT NULL,
    `cost_per_unit` DECIMAL(15,2) DEFAULT NULL,
    `season` VARCHAR(100) DEFAULT NULL,
    `payment_method` VARCHAR(100) DEFAULT NULL,
    `distance` DECIMAL(15,2) DEFAULT NULL,
    `delivery_method` VARCHAR(100) DEFAULT NULL,
    `delivery_cost` DECIMAL(15,2) DEFAULT NULL,
    `time_taken_to_receive` INT DEFAULT NULL,
    `average_cost_per_unit` DECIMAL(15,2) DEFAULT NULL,
    `average_delivery_time` INT DEFAULT NULL,
    `average_delivery_cost` DECIMAL(15,2) DEFAULT NULL,
    `performances` TEXT DEFAULT NULL,
    -- Order financials & status
    `status` VARCHAR(50) DEFAULT 'pending',
    `total_amount` DECIMAL(18,2) DEFAULT 0.00,
    -- Audit fields
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_by` BIGINT DEFAULT NULL,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`purchase_order_id`),
    UNIQUE KEY `uk_purchase_orders_po_number` (`po_number`),
    KEY `fk_purchase_orders_supplier` (`supplier_id`),
    KEY `fk_po_created_by` (`created_by`),
    KEY `fk_po_updated_by` (`updated_by`),
    CONSTRAINT `fk_purchase_orders_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_po_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_po_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: purchase_order_items
-- Description: Line items for purchase orders (references raw_cashew types)
-- ============================================================================
CREATE TABLE `purchase_order_items` (
    `purchase_order_item_id` BIGINT NOT NULL AUTO_INCREMENT,
    `purchase_order_id` BIGINT NOT NULL,
    `cashew_type_id` BIGINT NOT NULL,
    `quantity` DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
    `unit_price` DECIMAL(15,2) DEFAULT 0.00,
    `received_quantity` DECIMAL(15,4) DEFAULT 0.0000,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`purchase_order_item_id`),
    KEY `fk_poi_purchase_order` (`purchase_order_id`),
    KEY `fk_poi_cashew_type` (`cashew_type_id`),
    CONSTRAINT `fk_poi_purchase_order` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_poi_cashew_type` FOREIGN KEY (`cashew_type_id`) REFERENCES `raw_cashew` (`cashew_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: sales_orders
-- Description: Sales orders to customer
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
    CONSTRAINT `fk_sales_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE
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

-- ============================================================================
-- TABLE: raw_cashew_inventory
-- Description: Current inventory snapshot per raw cashew type and location
-- ============================================================================
CREATE TABLE `raw_cashew_inventory` (
    `raw_cashew_inventory_id` BIGINT NOT NULL AUTO_INCREMENT,
    `cashew_type_id` BIGINT NOT NULL,
    `location` VARCHAR(150) DEFAULT NULL,
    `quantity_on_hand` DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
    `reserved_quantity` DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`raw_cashew_inventory_id`),
    UNIQUE KEY `uk_rci_cashew_location` (`cashew_type_id`, `location`),
    KEY `idx_rci_cashew_type` (`cashew_type_id`),
    CONSTRAINT `fk_rci_cashew_type` FOREIGN KEY (`cashew_type_id`) REFERENCES `raw_cashew` (`cashew_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE: raw_cashew_stock_movements
-- Description: Ledger for raw cashew inventory movements (receives, adjustments, usage)
-- ============================================================================
CREATE TABLE `raw_cashew_stock_movements` (
    `movement_id` BIGINT NOT NULL AUTO_INCREMENT,
    `cashew_type_id` BIGINT NOT NULL,
    `movement_type` VARCHAR(50) NOT NULL,
    `related_type` VARCHAR(50) DEFAULT NULL,
    `related_id` BIGINT DEFAULT NULL,
    `quantity` DECIMAL(18,4) NOT NULL,
    `balance_after` DECIMAL(18,4) DEFAULT NULL,
    `movement_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by` BIGINT DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    PRIMARY KEY (`movement_id`),
    KEY `idx_rcsm_cashew_type` (`cashew_type_id`),
    KEY `idx_rcsm_movement_date` (`movement_date`),
    KEY `fk_rcsm_created_by` (`created_by`),
    CONSTRAINT `fk_rcsm_cashew_type` FOREIGN KEY (`cashew_type_id`) REFERENCES `raw_cashew` (`cashew_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_rcsm_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
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
-- Insert raw cashew types
-- ----------------------------------------------------------------------------
INSERT INTO `raw_cashew` (`cashew_type`, `cashew_quality`, `is_active`, `created_at`, `updated_at`) VALUES
('W180', 'Premium Grade - King Size (180 kernels per pound)', 1, NOW(), NOW()),
('W210', 'Premium Grade - Jumbo (210 kernels per pound)', 1, NOW(), NOW()),
('W240', 'Standard Grade - Large (240 kernels per pound)', 1, NOW(), NOW()),
('W320', 'Standard Grade - Medium (320 kernels per pound)', 1, NOW(), NOW()),
('W450', 'Economy Grade - Small (450 kernels per pound)', 1, NOW(), NOW()),
('SW', 'Scorched Wholes - Slightly discolored', 1, NOW(), NOW()),
('SSW', 'Scorched Wholes Seconds', 1, NOW(), NOW()),
('LWP', 'Large White Pieces', 1, NOW(), NOW()),
('SWP', 'Small White Pieces', 1, NOW(), NOW()),
('BB', 'Baby Bits - Small broken pieces', 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert suppliers
-- Note: phone, email, contact_person, payment_terms, is_approved and all
--       cashew-specific fields now live on purchase_orders, not here.
-- ----------------------------------------------------------------------------
INSERT INTO `suppliers` (`name`, `address`, `cashew_type_id`, `distance`, `is_active`, `created_at`, `updated_at`) VALUES
('Supplier One',       '123 Farm Road, Colombo',         1, 45.50,  1, NOW(), NOW()),
('Supplier Two',       '456 Cashew Avenue, Galle',       4, 120.75, 1, NOW(), NOW()),
('Premium Cashew Farms','789 Plantation Drive, Kandy',   2, 85.00,  1, NOW(), NOW()),
('Budget Nuts Co',     '321 Economy Street, Matara',     5, 210.30, 1, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Insert sample purchase orders (carrying the contact & cashew-specific data)
-- ----------------------------------------------------------------------------
INSERT INTO `purchase_orders` (
    `po_number`, `supplier_id`, `order_date`, `expected_date`,
    `phone`, `email`, `contact_person`, `payment_terms`, `is_approved`,
    `quantity`, `quality`, `cost_per_unit`, `season`, `payment_method`,
    `distance`, `delivery_method`, `delivery_cost`, `time_taken_to_receive`,
    `average_cost_per_unit`, `average_delivery_time`, `average_delivery_cost`,
    `performances`, `status`, `total_amount`, `is_active`, `created_at`, `updated_at`
) VALUES
('PO20260001', 1,
    DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 27 DAY),
    '+1-555-0001', 'supplier1@example.com', 'John Contact', 'Net 30', 1,
    5000.0000, 'Grade A', 18.50, 'Summer', 'Bank Transfer',
    120.50, 'Truck', 350.00, 3,
    18.25, 3, 340.00,
    'Excellent reliability, consistent quality, on-time delivery',
    'completed', 92500.00, 1, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),

('PO20260002', 2,
    DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY),
    '+1-555-0002', 'supplier2@example.com', 'Jane Contact', 'Net 15', 1,
    8000.0000, 'Grade B', 12.75, 'Winter', 'Cash',
    85.00, 'Van', 200.00, 2,
    12.50, 2, 195.00,
    'Good quality, competitive pricing',
    'completed', 102000.00, 1, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),

('PO20260003', 3,
    DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY),
    '+1-555-0003', 'premium@cashewfarms.com', 'Mike Premium', 'Net 45', 1,
    3000.0000, 'Premium Grade AA', 22.00, 'All Year', 'Bank Transfer',
    200.00, 'Refrigerated Truck', 500.00, 5,
    21.75, 4, 480.00,
    'Top quality premium cashews, reliable supplier',
    'pending', 66000.00, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),

('PO20260004', 4,
    DATE_SUB(NOW(), INTERVAL 5 DAY), NOW(),
    '+1-555-0004', 'info@budgetnuts.com', 'Sarah Budget', 'COD', 0,
    15000.0000, 'Economy Grade', 8.50, 'Monsoon', 'Cash on Delivery',
    50.00, 'Local Pickup', 100.00, 1,
    8.75, 1, 95.00,
    'Budget-friendly option, large quantities available',
    'pending', 127500.00, 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW());

-- ----------------------------------------------------------------------------
-- Insert customer
-- ----------------------------------------------------------------------------
INSERT INTO `customer` (`name`, `email`, `phone`, `type`, `is_active`, `created_at`, `updated_at`) VALUES
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
-- Insert inventory (for finished products)
-- ----------------------------------------------------------------------------
INSERT INTO `inventory` (`product_id`, `location`, `quantity_on_hand`, `reserved_quantity`, `last_updated`) VALUES
(1, 'Warehouse A', 100.0000, 10.0000, NOW()),
(2, 'Warehouse A', 200.0000, 20.0000, NOW()),
(3, 'Warehouse B', 150.0000, 15.0000, NOW());

-- ----------------------------------------------------------------------------
-- Insert raw cashew inventory
-- ----------------------------------------------------------------------------
INSERT INTO `raw_cashew_inventory` (`cashew_type_id`, `location`, `quantity_on_hand`, `reserved_quantity`, `last_updated`) VALUES
(1, 'Raw Materials Warehouse', 5000.0000, 500.0000, NOW()),
(2, 'Raw Materials Warehouse', 3500.0000, 200.0000, NOW()),
(3, 'Raw Materials Warehouse', 8000.0000, 1000.0000, NOW()),
(4, 'Raw Materials Warehouse', 12000.0000, 1500.0000, NOW()),
(5, 'Raw Materials Warehouse', 15000.0000, 2000.0000, NOW()),
(6, 'Processing Area', 2000.0000, 0.0000, NOW()),
(7, 'Processing Area', 1500.0000, 0.0000, NOW()),
(8, 'Processing Area', 3000.0000, 500.0000, NOW()),
(9, 'Processing Area', 2500.0000, 300.0000, NOW()),
(10, 'Processing Area', 1000.0000, 0.0000, NOW());

-- ----------------------------------------------------------------------------
-- Insert raw cashew stock movements (sample history)
-- ----------------------------------------------------------------------------
INSERT INTO `raw_cashew_stock_movements` (`cashew_type_id`, `movement_type`, `related_type`, `related_id`, `quantity`, `balance_after`, `movement_date`, `notes`) VALUES
(1, 'RECEIVE', 'PURCHASE_ORDER', 1, 5000.0000, 5000.0000, DATE_SUB(NOW(), INTERVAL 30 DAY), 'Initial stock from Supplier One'),
(2, 'RECEIVE', 'PURCHASE_ORDER', 2, 3500.0000, 3500.0000, DATE_SUB(NOW(), INTERVAL 28 DAY), 'Initial stock from Premium Cashew Farms'),
(3, 'RECEIVE', 'PURCHASE_ORDER', 1, 8000.0000, 8000.0000, DATE_SUB(NOW(), INTERVAL 25 DAY), 'Bulk purchase'),
(4, 'RECEIVE', 'PURCHASE_ORDER', 3, 12000.0000, 12000.0000, DATE_SUB(NOW(), INTERVAL 20 DAY), 'Regular stock replenishment'),
(5, 'RECEIVE', 'PURCHASE_ORDER', 4, 15000.0000, 15000.0000, DATE_SUB(NOW(), INTERVAL 15 DAY), 'Economy grade bulk order'),
(1, 'USAGE', NULL, NULL, 500.0000, 4500.0000, DATE_SUB(NOW(), INTERVAL 10 DAY), 'Used for production batch #101'),
(4, 'USAGE', NULL, NULL, 1500.0000, 10500.0000, DATE_SUB(NOW(), INTERVAL 8 DAY), 'Used for production batch #102'),
(6, 'RECEIVE', 'PURCHASE_ORDER', 2, 2000.0000, 2000.0000, DATE_SUB(NOW(), INTERVAL 7 DAY), 'Scorched wholes for processing'),
(7, 'RECEIVE', 'PURCHASE_ORDER', 3, 1500.0000, 1500.0000, DATE_SUB(NOW(), INTERVAL 5 DAY), 'SSW stock'),
(8, 'RECEIVE', 'PURCHASE_ORDER', 4, 3500.0000, 3500.0000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Large white pieces'),
(8, 'USAGE', NULL, NULL, 500.0000, 3000.0000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Used for cashew butter production'),
(9, 'RECEIVE', 'PURCHASE_ORDER', 1, 2500.0000, 2500.0000, NOW(), 'Small white pieces for snack mix'),
(10, 'RECEIVE', 'PURCHASE_ORDER', 2, 1000.0000, 1000.0000, NOW(), 'Baby bits for confectionery');

-- ============================================================================
-- END OF DUMP
-- ============================================================================

