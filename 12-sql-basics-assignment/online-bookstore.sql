-----------------------------------------------------------
---         CREATION OF BOOKSTORE DATABASE              ---
-----------------------------------------------------------

-- Authors Table

CREATE TABLE Authors (
    author_id INT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    country VARCHAR(50)
);

-- Books Table

CREATE TABLE Books (
    book_id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author_id INT,
    category VARCHAR(50),
    price DECIMAL(10,2),
    published_year INT,
    FOREIGN KEY (author_id) REFERENCES Authors(author_id)
);

-- Inserting data in Authors Table

INSERT INTO Authors (author_id, author_name, country)
VALUES
    (101, 'Amish Tripathi', 'India'),
    (102, 'Dan Brown', 'United States of America'),
    (103, 'J. K. Rowling', 'United States of America'),
    (104, 'J. R. Tolkien', 'United States of America'),
    (105, 'Shakespeare', 'United Kingdom'),
    (106, 'Robert C. Martin', 'United States of America'),
    (107, 'Yuval Noah Harari', 'Israel');

-- Inserting data in Books Table

INSERT INTO Books (book_id, title, author_id, category, price, published_year)
VALUES
    (01, 'Harry Potter - Order of the Phoenix', 103, 'Fantasy', 599, 2003),
    (02, 'Da Vinci Code', 102, 'Mystery', 359, 2003),
    (03, 'The Immortals of Meluha', 101, 'Mythological Fiction', 299, 2010),
    (04, 'The Lord of the Rings - The Fellowship of the Ring', 104, 'Fantasy', 699, 1954),
    (05, 'Romeo and Juliet', 105, 'Tragedy', 499, 1597),
    (06, 'Harry Potter and the Deathly Hallows', 103, 'Fantasy', 559, 2007),
    (07, 'Digital Fortress', 102, 'Thriller', 359, 1998),
    (08, 'Immortal India', 101, 'Non-fiction', 272, 2017),
    (09, 'The Hobbit', 104, 'Fantasy', 599, 1937),
    (10, 'A Midsummer Night''s Dream', 105, 'Comedy', 299, 1595),
    (11, 'Clean Code', 106, 'Programming', 899, 2008),
    (12, 'Sapiens', 107, 'History', 799, 2011),
    (13, 'The Future of Humanity', 107, 'Science', 749, 2024);


-----------------------------------------------------------
---                       TASKS                         ---
-----------------------------------------------------------

--- SECTION 1 - BASIC QUERIES ---

-- Task 1: Display all books

SELECT * 
FROM Books;

-- Task 2: Display only the book title and price.

SELECT title, price
FROM Books;

-- Task 3: Display the book title as Book Name and price as Book Price using column aliases.

SELECT title AS 'Book Name', price AS 'Book Price'
FROM Books;

-- Task 4: Display all unique book categories.

SELECT DISTINCT(category) AS 'Book Categories'
FROM Books;


--- SECTION 2: FILTERING DATA ---

-- Task 5: Display books priced above ₹700.

SELECT * 
FROM Books
WHERE price > 700;

-- Task 6: Display books priced between ₹500 and ₹800.

SELECT * 
FROM Books
WHERE price BETWEEN 500 AND 800; --- Inclusive 

-- Task 7: Display books that belong to the Programming category.

SELECT * 
FROM Books 
WHERE category = 'Programming';

-- Task 8: Display books whose titles start with the letter S.

SELECT *
FROM Books
WHERE title LIKE 'S%';

-- Task 9: Display books published after 2020.

SELECT * 
FROM Books
WHERE published_year > 2020;


---  SECTION 3: SORTING AND LIMITING RESULTS --- 

-- Task 10: Display books sorted by price in descending order.

SELECT *
FROM Books
ORDER BY price DESC;

-- Task 11: Display the top 3 most expensive books.

SELECT *
FROM Books
ORDER BY price DESC
LIMIT 3;


--- SECTION 4: AGGREGATE FUNCTIONS ---

-- Task 12: Find: 
    -- 1. Total number of books
    -- 2. Total price of all books
    -- 3. Average book price
    -- 4. Highest book price
    -- 5. Lowest book price

SELECT 
    COUNT(*) AS 'Total Number of Books', 
    SUM(price) AS 'Total Price of All Books',
    ROUND(AVG(price),2) AS 'Average Book Price',
    MAX(price) AS 'Highest Book Price',
    MIN(price) AS 'Lowest Book Price'
FROM 
    Books;


--- SECTION 5: `GROUP BY` AND `HAVING` --- 

-- Task 13: Display the average book price for each category.

SELECT category as 'Category', AVG(price) AS 'Average Price'
FROM Books
GROUP BY category;

-- Task 14: Display only those categories whose average book price is greater than ₹650.

SELECT category as 'Category', AVG(price) AS 'Average Price'
FROM Books
GROUP BY category
HAVING AVG(price) > 650;


--- SECTION 6: JOINS ---

-- Task 15: Display each book along with its author's name using an INNER JOIN.

SELECT b.title AS 'Book Title', a.author_name AS 'Author Name'
FROM Books AS b
INNER JOIN Authors AS a
ON b.author_id = a.author_id;

-- Task 16: Display all authors along with the books they have written using a LEFT JOIN.

SELECT a.author_name AS 'Author Name', b.title AS 'Book Name' 
FROM Authors AS a
LEFT JOIN Books AS b
ON a.author_id = b.author_id;

-- Task 17: Display all books along with their author details using a RIGHT JOIN.

SELECT b.title AS 'Book Title', a.author_name AS 'Author Name', a.country AS 'Author''s Country'
FROM Books AS b
RIGHT JOIN Authors AS a
ON b.author_id = a.author_id;


--- SECTION 7: DATA MANIPULATION

-- Task 18: Insert a new book into the Books table.

INSERT INTO Books (book_id, title, author_id, category, price, published_year)
VALUES (14, 'The Secret of Nagas', 101, 'Mythological Fiction', 459, 2011);

-- Task 19: Update the price of the book you inserted.

UPDATE Books
SET price = 549
WHERE book_id = 14;

-- Task 20: Delete the book record that you inserted.

DELETE FROM Books
WHERE book_id = 14;

--- SECTION 8: CREATING TABLES AND CONSTRAINTS

-- Task 21: Create a new table named Publishers with the following columns:
    -- 1. publisher_id
    -- 2. publisher_name
    -- 3. country
    -- 4. established_year
    -- Apply the following constraints:
        -- PRIMARY KEY
        -- NOT NULL
        -- UNIQUE
        -- DEFAULT

CREATE TABLE Publishers (
    publisher_id INT PRIMARY KEY,
    publisher_name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    established_year INT DEFAULT 2000
);
