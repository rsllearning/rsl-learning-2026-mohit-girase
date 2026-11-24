-- =============================================================================
-- DATABASE SCHEMA CREATION
-- =============================================================================

-- Drop tables if they already exist (in reverse dependency order)
DROP TABLE IF EXISTS Order_Audit;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Customers;

-- 1. Customers Table
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Products Table
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_date DATE NOT NULL
);

-- 3. Orders Table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

-- 4. Order_Audit Table (for automated trigger logging in Section 10)
CREATE TABLE Order_Audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    action_type VARCHAR(50) DEFAULT 'INSERT',
    audit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SAMPLE DATA INSERTION
-- =============================================================================

-- Populate Customers (12 customers, including customers with and without orders)
INSERT INTO Customers (customer_id, customer_name, city, email)
VALUES
    (1, 'Aditya Deshmukh', 'Mumbai', 'aditya.deshmukh@example.com'),
    (2, 'Pooja Kulkarni', 'Pune', 'pooja.kulkarni@example.com'),
    (3, 'Rohan Patil', 'Kolhapur', 'rohan.patil@example.com'),
    (4, 'Snehal Shinde', 'Nashik', 'snehal.shinde@example.com'),
    (5, 'Tanmay Joshi', 'Nagpur', 'tanmay.joshi@example.com'),
    (6, 'Ananya Gaikwad', 'Thane', 'ananya.gaikwad@example.com'),
    (7, 'Siddharth More', 'Chhatrapati Sambhajinagar', 'siddharth.more@example.com'),
    (8, 'Neha Chavan', 'Solapur', 'neha.chavan@example.com'),
    (9, 'Prathamesh Sawant', 'Ratnagiri', 'prathamesh.sawant@example.com'),
    (10, 'Gauri Bhosle', 'Satara', 'gauri.bhosle@example.com'),
    (11, 'Sanket Pawar', 'Amravati', 'sanket.pawar@example.com'),
    (12, 'Sayali Jadhav', 'Sangli', 'sayali.jadhav@example.com');

-- Populate Products (12 products across Electronics, Clothing, and Home Appliances)
INSERT INTO Products (product_id, product_name, category, price, created_date) 
VALUES
    (1, 'Smartphone Pro Max', 'Electronics', 65000.00, '2024-03-15'),
    (2, 'Wireless Noise-Canceling Headphones', 'Electronics', 8500.00, '2024-05-10'),
    (3, '4K Ultra HD Smart TV', 'Electronics', 42000.00, '2024-08-20'),
    (4, 'Mechanical Gaming Keyboard', 'Electronics', 4500.00, '2025-01-12'),
    (5, 'USB-C Fast Charging Cable', 'Electronics', 499.00, '2024-02-18'),
    (6, 'Men Slim Fit Denim Jeans', 'Clothing', 1899.00, '2024-04-10'),
    (7, 'Women Cotton Floral Kurti', 'Clothing', 899.00, '2024-07-22'),
    (8, 'Hooded Winter Fleece Jacket', 'Clothing', 2499.00, '2024-09-05'),
    (9, 'Air Fryer Touch Pro 4L', 'Home Appliances', 5999.00, '2024-06-14'),
    (10, 'Convection Microwave Oven', 'Home Appliances', 11500.00, '2024-11-01'),
    (11, 'Ceramic Electric Kettle 1.8L', 'Home Appliances', 950.00, '2025-02-15'),
    (12, 'Ergonomic Memory Foam Pillow', 'Home Appliances', 1299.00, '2024-10-18');

-- Populate Orders (22 orders placed by customers 1-10; customers 11 & 12 have placed no orders)
INSERT INTO Orders (order_id, customer_id, product_id, quantity, order_date) 
VALUES
    (1, 1, 1, 1, '2024-04-01'),
    (2, 1, 5, 2, '2024-04-15'),
    (3, 2, 2, 1, '2024-06-10'),
    (4, 2, 6, 2, '2024-06-25'),
    (5, 3, 3, 1, '2024-09-05'),
    (6, 3, 4, 1, '2025-02-01'),
    (7, 4, 7, 3, '2024-08-12'),
    (8, 4, 8, 1, '2024-10-02'),
    (9, 5, 9, 1, '2024-07-19'),
    (10, 5, 10, 1, '2024-11-20'),
    (11, 6, 1, 1, '2024-05-18'),
    (12, 6, 6, 1, '2024-06-01'),
    (13, 7, 2, 2, '2024-08-14'),
    (14, 7, 5, 3, '2024-09-01'),
    (15, 8, 8, 2, '2024-10-15'),
    (16, 8, 12, 2, '2024-11-05'),
    (17, 9, 10, 1, '2024-12-01'),
    (18, 9, 11, 2, '2025-03-01'),
    (19, 10, 3, 1, '2024-10-10'),
    (20, 10, 4, 2, '2025-02-14'),
    (21, 1, 2, 1, '2025-01-05'),
    (22, 2, 1, 1, '2025-02-20');


-- =============================================================================
-- SECTION 1: ADVANCED JOINS
-- =============================================================================

-- Task 1: Display each customer along with the products they ordered.
-- Uses an INNER JOIN across Customers, Orders, and Products to show active purchases.
SELECT 
    c.customer_id,
    c.customer_name,
    c.city,
    o.order_id,
    p.product_name,
    p.category,
    p.price,
    o.quantity,
    (p.price * o.quantity) AS total_amount,
    o.order_date
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
INNER JOIN Products p ON o.product_id = p.product_id
ORDER BY c.customer_id, o.order_id;

-- Task 2: Display all possible combinations of customers and products using a CROSS JOIN.
-- Generates a Cartesian product of all customers and all available products.
SELECT 
    c.customer_id,
    c.customer_name,
    c.city,
    p.product_id,
    p.product_name,
    p.category,
    p.price
FROM Customers c
CROSS JOIN Products p
ORDER BY c.customer_id, p.product_id;

-- Task 3: Display all customers and their orders, including customers who have not placed any orders.
-- Uses a LEFT JOIN to ensure customers without orders (e.g., Sanket Pawar, Sayali Jadhav) are retained with NULLs.
SELECT 
    c.customer_id,
    c.customer_name,
    c.city,
    c.email,
    o.order_id,
    p.product_name,
    o.quantity,
    o.order_date
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
LEFT JOIN Products p ON o.product_id = p.product_id
ORDER BY c.customer_id, o.order_id;


-- =============================================================================
-- SECTION 2: SUBQUERIES
-- =============================================================================

-- Task 4: Find products priced above the average product price.
-- Uses a scalar subquery in the WHERE clause to filter products above the catalog average price.
SELECT 
    product_id,
    product_name,
    category,
    price
FROM Products
WHERE price > (
    SELECT AVG(price) 
    FROM Products
)
ORDER BY price DESC;

-- Task 5: Display customers whose total purchase amount is greater than the average customer purchase amount.
-- Aggregates spending per customer and compares each against the platform-wide average spending in a HAVING subquery.
SELECT 
    c.customer_id,
    c.customer_name,
    c.city,
    SUM(p.price * o.quantity) AS total_purchase_amount
FROM Customers c
INNER JOIN Orders o ON c.customer_id = o.customer_id
INNER JOIN Products p ON o.product_id = p.product_id
GROUP BY c.customer_id, c.customer_name, c.city
HAVING total_purchase_amount > (
    SELECT AVG(customer_spend)
    FROM (
        SELECT SUM(p2.price * o2.quantity) AS customer_spend
        FROM Orders o2
        INNER JOIN Products p2 ON o2.product_id = p2.product_id
        GROUP BY o2.customer_id
    ) AS spending_subquery
)
ORDER BY total_purchase_amount DESC;

-- Task 6: Find the highest-priced product in each category using a correlated subquery.
-- The inner subquery references the outer query's p1.category to find the maximum price per category.
SELECT 
    p1.product_id,
    p1.product_name,
    p1.category,
    p1.price
FROM Products p1
WHERE p1.price = (
    SELECT MAX(p2.price)
    FROM Products p2
    WHERE p2.category = p1.category
)
ORDER BY p1.category;


-- =============================================================================
-- SECTION 3: SET OPERATIONS
-- =============================================================================

-- Task 7: Combine products from two different categories using UNION.
-- Combines products from 'Electronics' and 'Clothing' while removing duplicate tuples.
SELECT 
    product_id,
    product_name,
    category,
    price
FROM Products
WHERE category = 'Electronics'
UNION
SELECT 
    product_id,
    product_name,
    category,
    price
FROM Products
WHERE category = 'Clothing'
ORDER BY category, price DESC;

-- Task 8: Write MySQL alternatives for INTERSECT and EXCEPT using INNER JOIN and LEFT JOIN.

-- Set A: Customers who ordered Electronics products
-- Set B: Customers who ordered Clothing products

-- Part 8A: MySQL INTERSECT Alternative using INNER JOIN
-- Finds customers present in BOTH Set A and Set B (ordered both Electronics and Clothing).
SELECT DISTINCT 
    e.customer_id,
    e.customer_name,
    e.city
FROM (
    SELECT DISTINCT c.customer_id, c.customer_name, c.city
    FROM Customers c
    INNER JOIN Orders o ON c.customer_id = o.customer_id
    INNER JOIN Products p ON o.product_id = p.product_id
    WHERE p.category = 'Electronics'
) AS e
INNER JOIN (
    SELECT DISTINCT c.customer_id, c.customer_name, c.city
    FROM Customers c
    INNER JOIN Orders o ON c.customer_id = o.customer_id
    INNER JOIN Products p ON o.product_id = p.product_id
    WHERE p.category = 'Clothing'
) AS cl ON e.customer_id = cl.customer_id
ORDER BY e.customer_id;

-- Part 8B: MySQL EXCEPT Alternative using LEFT JOIN ... WHERE ... IS NULL
-- Finds customers in Set A (ordered Electronics) EXCEPT those who also ordered in Set B (Clothing).
SELECT DISTINCT 
    e.customer_id,
    e.customer_name,
    e.city
FROM (
    SELECT DISTINCT c.customer_id, c.customer_name, c.city
    FROM Customers c
    INNER JOIN Orders o ON c.customer_id = o.customer_id
    INNER JOIN Products p ON o.product_id = p.product_id
    WHERE p.category = 'Electronics'
) AS e
LEFT JOIN (
    SELECT DISTINCT c.customer_id
    FROM Customers c
    INNER JOIN Orders o ON c.customer_id = o.customer_id
    INNER JOIN Products p ON o.product_id = p.product_id
    WHERE p.category = 'Clothing'
) AS cl ON e.customer_id = cl.customer_id
WHERE cl.customer_id IS NULL
ORDER BY e.customer_id;


-- =============================================================================
-- SECTION 4: WINDOW FUNCTIONS
-- =============================================================================

-- Task 9: Rank products by price within each category.
-- Uses RANK() and DENSE_RANK() partitioned by category to demonstrate ranking behaviors.
SELECT 
    product_id,
    product_name,
    category,
    price,
    RANK() OVER (
        PARTITION BY category 
        ORDER BY price DESC
    ) AS price_rank,
    DENSE_RANK() OVER (
        PARTITION BY category 
        ORDER BY price DESC
    ) AS price_dense_rank
FROM Products
ORDER BY category, price_rank;

-- Task 10: Display the previous product price (LAG) and a running total of product prices using window functions.
-- Uses LAG() to access the preceding row price and SUM() OVER (...) for cumulative running total.
SELECT 
    product_id,
    product_name,
    category,
    price,
    LAG(price, 1) OVER (
        ORDER BY price ASC
    ) AS previous_price,
    SUM(price) OVER (
        ORDER BY price ASC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total_price
FROM Products
ORDER BY price ASC;


-- =============================================================================
-- SECTION 5: COMMON TABLE EXPRESSIONS (CTEs)
-- =============================================================================

-- Task 11: Create a CTE to display customers whose total purchase amount is above the average.
-- Modularizes customer aggregated spend and platform average using chained CTEs.
WITH CustomerSpending AS (
    SELECT 
        c.customer_id,
        c.customer_name,
        c.city,
        SUM(p.price * o.quantity) AS total_purchase_amount
    FROM Customers c
    INNER JOIN Orders o ON c.customer_id = o.customer_id
    INNER JOIN Products p ON o.product_id = p.product_id
    GROUP BY c.customer_id, c.customer_name, c.city
),
AverageSpending AS (
    SELECT AVG(total_purchase_amount) AS overall_avg_purchase
    FROM CustomerSpending
)
SELECT 
    cs.customer_id,
    cs.customer_name,
    cs.city,
    cs.total_purchase_amount,
    ROUND(avg_sp.overall_avg_purchase, 2) AS platform_avg_purchase
FROM CustomerSpending cs
CROSS JOIN AverageSpending avg_sp
WHERE cs.total_purchase_amount > avg_sp.overall_avg_purchase
ORDER BY cs.total_purchase_amount DESC;

-- Task 12: Create a recursive CTE to generate a sequence of numbers from 1 to 10.
-- Implements an anchor member and a recursive member incrementing by 1 until termination condition.
WITH RECURSIVE NumberSequence AS (
    -- Anchor member
    SELECT 1 AS num
    UNION ALL
    -- Recursive member
    SELECT num + 1 
    FROM NumberSequence 
    WHERE num < 10
)
SELECT num 
FROM NumberSequence;


-- =============================================================================
-- SECTION 6: VIEWS
-- =============================================================================

-- Task 13: Create a view that displays products priced above ₹1,000 and retrieve data from the view.
CREATE OR REPLACE VIEW HighValueProducts AS
SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM Products
WHERE price > 1000.00;

-- Retrieve and verify data from the newly created view
SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM HighValueProducts
ORDER BY price DESC;


-- =============================================================================
-- SECTION 7: INDEXES AND QUERY PERFORMANCE
-- =============================================================================

-- Task 14: Create an index on the category column of the Products table.
CREATE INDEX idx_products_category ON Products(category);

-- Task 15: Use EXPLAIN to analyze a query that filters products by category.
-- Evaluates query execution plan, index usage (key: idx_products_category), and rows scanned.
EXPLAIN 
SELECT 
    product_id,
    product_name,
    category,
    price
FROM Products
WHERE category = 'Electronics';


-- =============================================================================
-- SECTION 8: STORED PROCEDURES AND FUNCTIONS
-- =============================================================================

-- Task 16: Create a stored procedure to retrieve products by category.
-- Note: Defined as a clean single-statement routine using standard ';' delimiter
-- for universal compatibility across online editors (Programiz, OneCompiler, DB Fiddle)
-- and local MySQL clients.
DROP PROCEDURE IF EXISTS GetProductsByCategory;

CREATE PROCEDURE GetProductsByCategory(IN in_category VARCHAR(50))
SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM Products
WHERE category = in_category
ORDER BY price DESC;

-- Execute the stored procedure for testing
CALL GetProductsByCategory('Electronics');


-- Task 17: Create a function to calculate the total price of an order (price × quantity).
-- Note: Single-expression return function compatible across all MySQL environments.
DROP FUNCTION IF EXISTS CalculateOrderTotal;

CREATE FUNCTION CalculateOrderTotal(unit_price DECIMAL(10, 2), qty INT)
RETURNS DECIMAL(10, 2)
DETERMINISTIC
RETURN unit_price * qty;

-- Execute and verify function calculation across orders
SELECT 
    o.order_id,
    c.customer_name,
    p.product_name,
    p.price AS unit_price,
    o.quantity,
    CalculateOrderTotal(p.price, o.quantity) AS computed_order_total
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
INNER JOIN Products p ON o.product_id = p.product_id
ORDER BY o.order_id;


-- =============================================================================
-- SECTION 9: TRANSACTIONS
-- =============================================================================

-- Task 18: Write a transaction that updates a product's price and demonstrate the use of COMMIT and ROLLBACK.

-- -----------------------------------------------------------------------------
-- Part 18A: Demonstration of ROLLBACK (Aborting uncommitted modifications)
-- -----------------------------------------------------------------------------
START TRANSACTION;

-- Temporarily modify price of product 1
UPDATE Products 
SET price = 99999.00 
WHERE product_id = 1;

-- Verify price reflects updated value inside current transaction scope
SELECT product_id, product_name, price 
FROM Products 
WHERE product_id = 1;

-- Abort transaction, undoing the change
ROLLBACK;

-- Verify price has been restored back to its original value (65000.00)
SELECT product_id, product_name, price 
FROM Products 
WHERE product_id = 1;

-- -----------------------------------------------------------------------------
-- Part 18B: Demonstration of COMMIT (Persisting changes permanently)
-- -----------------------------------------------------------------------------
START TRANSACTION;

-- Increment price of product 1
UPDATE Products 
SET price = 67999.00 
WHERE product_id = 1;

-- Commit transaction to persist modifications permanently
COMMIT;

-- Verify updated price is committed in the database
SELECT product_id, product_name, price 
FROM Products 
WHERE product_id = 1;


-- =============================================================================
-- SECTION 10: SQL TRIGGERS
-- =============================================================================

-- Task 19: Create a trigger that automatically records new orders in an Order_Audit table whenever a new order is inserted.
-- Note: Defined using standard ';' delimiter for universal compatibility across online editors and CLI.
DROP TRIGGER IF EXISTS trg_after_order_insert;

CREATE TRIGGER trg_after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
INSERT INTO Order_Audit (
    order_id,
    customer_id,
    product_id,
    quantity,
    order_date,
    action_type,
    audit_timestamp
)
VALUES (
    NEW.order_id,
    NEW.customer_id,
    NEW.product_id,
    NEW.quantity,
    NEW.order_date,
    'INSERT',
    NOW()
);

-- Test Trigger Execution: Insert a new test order
INSERT INTO Orders (customer_id, product_id, quantity, order_date) 
VALUES (2, 4, 1, '2026-11-24');

-- Verify audit log table recorded the inserted order automatically
SELECT 
    audit_id,
    order_id,
    customer_id,
    product_id,
    quantity,
    order_date,
    action_type,
    audit_timestamp
FROM Order_Audit;


-- =============================================================================
-- SECTION 11: PERFORMANCE TUNING
-- =============================================================================

-- Task 20: Optimize the queries by applying SQL performance tuning best practices:
--
-- Given Inefficient Query:
-- SELECT DISTINCT *
-- FROM Products
-- WHERE YEAR(created_date) = 2024
-- AND category = 'Electronics';
--
-- Applied Improvements:
-- 1. Avoid SELECT *: Replaced wildcard with explicit projection columns to reduce I/O and memory overhead.
-- 2. Remove unnecessary DISTINCT: Primary key guarantees uniqueness; removing DISTINCT eliminates redundant sort/hash deduplication.
-- 3. Avoid functions on indexed columns: Avoided YEAR(created_date) which breaks sargability and prevents index usage.
-- 4. Use an index-friendly query: Implemented range condition (created_date >= '2024-01-01' AND created_date < '2025-01-01')
--    and added a composite index (category, created_date) for index seeks.

-- Step 1: Create composite index supporting the tuned query
CREATE INDEX idx_products_category_created ON Products(category, created_date);

-- Step 2: Optimized query execution
SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM Products
WHERE category = 'Electronics'
  AND created_date >= '2024-01-01'
  AND created_date < '2025-01-01'
ORDER BY product_id;

-- Step 3: Analyze execution plan of optimized query using EXPLAIN
EXPLAIN 
SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM Products
WHERE category = 'Electronics'
  AND created_date >= '2024-01-01'
  AND created_date < '2025-01-01';
