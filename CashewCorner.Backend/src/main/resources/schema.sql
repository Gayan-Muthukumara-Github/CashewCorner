-- Cashew Corner Schema (H2 Database)
-- Converted from MySQL schema for H2 compatibility

-- Drop existing tables (order matters)
DROP TABLE IF EXISTS product_category_map;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS stock_movements;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS sales_order_items;
DROP TABLE IF EXISTS sales_orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS payrolls;
DROP TABLE IF EXISTS employee_duties;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Roles
CREATE TABLE roles (
  role_id BIGINT AUTO_INCREMENT NOT NULL,
  role_name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  PRIMARY KEY (role_id),
  UNIQUE (role_name)
);

-- Users (system accounts)
CREATE TABLE users (
  user_id BIGINT AUTO_INCREMENT NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role_id BIGINT,
  last_login TIMESTAMP DEFAULT NULL,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (user_id),
  UNIQUE (username),
  UNIQUE (email),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Suppliers
CREATE TABLE suppliers (
  supplier_id BIGINT AUTO_INCREMENT NOT NULL,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(150),
  contact_person VARCHAR(150),
  payment_terms VARCHAR(255),
  is_approved BOOLEAN DEFAULT FALSE,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (supplier_id),
  CONSTRAINT fk_suppliers_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_suppliers_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_suppliers_email ON suppliers(email);

-- Customers
CREATE TABLE customers (
  customer_id BIGINT AUTO_INCREMENT NOT NULL,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  address TEXT,
  type VARCHAR(50),
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (customer_id),
  CONSTRAINT fk_customers_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_customers_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_customers_email ON customers(email);

-- Products
CREATE TABLE products (
  product_id BIGINT AUTO_INCREMENT NOT NULL,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  unit VARCHAR(50),
  cost_price DECIMAL(15,2) DEFAULT 0.00,
  sell_price DECIMAL(15,2) DEFAULT 0.00,
  reorder_level DECIMAL(15,2) DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id),
  UNIQUE (sku),
  CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_sku ON products(sku);

-- Product Categories
CREATE TABLE product_categories (
  category_id BIGINT AUTO_INCREMENT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (category_id),
  UNIQUE (name),
  CONSTRAINT fk_pc_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_pc_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Product <-> Category mapping (many-to-many)
CREATE TABLE product_category_map (
  product_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT fk_pcm_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pcm_category FOREIGN KEY (category_id) REFERENCES product_categories(category_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE INDEX idx_pcm_product ON product_category_map(product_id);
CREATE INDEX idx_pcm_category ON product_category_map(category_id);

-- Purchase Orders
CREATE TABLE purchase_orders (
  purchase_order_id BIGINT AUTO_INCREMENT NOT NULL,
  po_number VARCHAR(100) NOT NULL,
  supplier_id BIGINT NOT NULL,
  created_by BIGINT DEFAULT NULL,
  order_date DATE NOT NULL,
  expected_date DATE DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(18,2) DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (purchase_order_id),
  UNIQUE (po_number),
  CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_po_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_po_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_po_order_date ON purchase_orders(order_date);
CREATE INDEX idx_po_number ON purchase_orders(po_number);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
  purchase_order_item_id BIGINT AUTO_INCREMENT NOT NULL,
  purchase_order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  unit_price DECIMAL(15,2) DEFAULT 0.00,
  line_total DECIMAL(18,2) AS (quantity * unit_price),
  received_quantity DECIMAL(15,4) DEFAULT 0.0000,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (purchase_order_item_id),
  CONSTRAINT fk_poi_purchase_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_poi_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX fk_poi_purchase_order ON purchase_order_items(purchase_order_id);
CREATE INDEX fk_poi_product ON purchase_order_items(product_id);

-- Sales Orders
CREATE TABLE sales_orders (
  sales_order_id BIGINT AUTO_INCREMENT NOT NULL,
  so_number VARCHAR(100) NOT NULL,
  customer_id BIGINT NOT NULL,
  created_by BIGINT DEFAULT NULL,
  order_date DATE NOT NULL,
  delivery_date DATE DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(18,2) DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by BIGINT DEFAULT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (sales_order_id),
  UNIQUE (so_number),
  CONSTRAINT fk_so_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_so_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_so_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_so_order_date ON sales_orders(order_date);
CREATE INDEX idx_so_number ON sales_orders(so_number);

-- Sales Order Items
CREATE TABLE sales_order_items (
  sales_order_item_id BIGINT AUTO_INCREMENT NOT NULL,
  sales_order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  unit_price DECIMAL(15,2) DEFAULT 0.00,
  line_total DECIMAL(18,2) AS (quantity * unit_price),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sales_order_item_id),
  CONSTRAINT fk_soi_sales_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(sales_order_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_soi_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX fk_soi_sales_order ON sales_order_items(sales_order_id);
CREATE INDEX fk_soi_product ON sales_order_items(product_id);

-- Inventory (quick current snapshot per product and location)
CREATE TABLE inventory (
  inventory_id BIGINT AUTO_INCREMENT NOT NULL,
  product_id BIGINT NOT NULL,
  location VARCHAR(150) DEFAULT NULL,
  quantity_on_hand DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
  reserved_quantity DECIMAL(18,4) NOT NULL DEFAULT 0.0000,
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (inventory_id),
  UNIQUE (product_id, location),
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_inventory_product ON inventory(product_id);

-- Stock Movements (ledger)
CREATE TABLE stock_movements (
  movement_id BIGINT AUTO_INCREMENT NOT NULL,
  product_id BIGINT NOT NULL,
  movement_type VARCHAR(50) NOT NULL,
  related_type VARCHAR(50) DEFAULT NULL,
  related_id BIGINT DEFAULT NULL,
  quantity DECIMAL(18,4) NOT NULL,
  balance_after DECIMAL(18,4) DEFAULT NULL,
  movement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT DEFAULT NULL,
  notes TEXT,
  PRIMARY KEY (movement_id),
  CONSTRAINT fk_sm_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_sm_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_sm_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);

-- Employees
CREATE TABLE employees (
  employee_id BIGINT AUTO_INCREMENT NOT NULL,
  user_id BIGINT DEFAULT NULL,
  employee_code VARCHAR(100) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  designation VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(150),
  hire_date DATE DEFAULT NULL,
  salary_base DECIMAL(18,2) DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (employee_id),
  UNIQUE (employee_code),
  CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_employee_code ON employees(employee_code);

-- Employee Duties (assignments)
CREATE TABLE employee_duties (
  duty_id BIGINT AUTO_INCREMENT NOT NULL,
  employee_id BIGINT NOT NULL,
  task_type VARCHAR(100),
  sales_order_id BIGINT DEFAULT NULL,
  purchase_order_id BIGINT DEFAULT NULL,
  start_date TIMESTAMP DEFAULT NULL,
  end_date TIMESTAMP DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'assigned',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (duty_id),
  CONSTRAINT fk_ed_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ed_sales_order FOREIGN KEY (sales_order_id) REFERENCES sales_orders(sales_order_id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_ed_purchase_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(purchase_order_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX fk_ed_employee ON employee_duties(employee_id);
CREATE INDEX fk_ed_sales_order ON employee_duties(sales_order_id);
CREATE INDEX fk_ed_purchase_order ON employee_duties(purchase_order_id);

-- Payrolls
CREATE TABLE payrolls (
  payroll_id BIGINT AUTO_INCREMENT NOT NULL,
  employee_id BIGINT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  gross_pay DECIMAL(18,2) DEFAULT 0.00,
  deductions DECIMAL(18,2) DEFAULT 0.00,
  net_pay DECIMAL(18,2) DEFAULT 0.00,
  payment_date DATE DEFAULT NULL,
  payment_method VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (payroll_id),
  CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX fk_payroll_employee ON payrolls(employee_id);

-- Payments (polymorphic: uses related_type + related_id)
CREATE TABLE payments (
  payment_id BIGINT AUTO_INCREMENT NOT NULL,
  related_type VARCHAR(50) NOT NULL,
  related_id BIGINT NOT NULL,
  amount DECIMAL(18,2) NOT NULL,
  payment_date DATE NOT NULL,
  method VARCHAR(100),
  reference VARCHAR(255),
  created_by BIGINT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (payment_id),
  CONSTRAINT fk_payments_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX idx_payments_related ON payments(related_type, related_id);
CREATE INDEX fk_payments_created_by ON payments(created_by);

-- Reports metadata (using VARCHAR for JSON compatibility)
CREATE TABLE reports (
  report_id BIGINT AUTO_INCREMENT NOT NULL,
  report_type VARCHAR(100),
  parameters VARCHAR(4000) DEFAULT NULL,
  generated_by BIGINT DEFAULT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (report_id),
  CONSTRAINT fk_reports_generated_by FOREIGN KEY (generated_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX fk_reports_generated_by ON reports(generated_by);

-- End of schema

