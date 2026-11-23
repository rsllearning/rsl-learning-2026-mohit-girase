# SQL (Basic) Assignment - Online Bookstore

## Assignment Overview
This project implements the database schema and query solutions for an online bookstore management system. It covers core SQL operations including table creation with constraints, sample data population, data querying, filtering, sorting, aggregate functions, grouping, joins, and data manipulation across 21 structured tasks.

---

## Database Schema

### 1. Authors Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `author_id` | INT | PRIMARY KEY | Unique identifier for author |
| `author_name` | VARCHAR(100) | NOT NULL | Name of author |
| `country` | VARCHAR(50) | - | Country of author |

### 2. Books Table
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `book_id` | INT | PRIMARY KEY | Unique identifier for book |
| `title` | VARCHAR(100) | NOT NULL | Title of the book |
| `author_id` | INT | FOREIGN KEY (`Authors.author_id`) | References `Authors(author_id)` |
| `category` | VARCHAR(50) | - | Genre / Category |
| `price` | DECIMAL(10,2) | - | Book price |
| `published_year` | INT | - | Year of publication |

*Relationship: `Authors` (1) to `Books` (N) via `author_id`.*

### 3. Publishers Table (Task 21)
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `publisher_id` | INT | PRIMARY KEY | Unique publisher identifier |
| `publisher_name` | VARCHAR(100) | NOT NULL, UNIQUE | Unique publisher name |
| `country` | VARCHAR(50) | NOT NULL | Publisher country |
| `established_year` | INT | DEFAULT 2000 | Year of establishment |

---

## Steps to Execute the SQL Script

### Option 1: Using Online SQL Editor (Programiz) — Recommended
1. Open the [Programiz Online SQL Editor](https://www.programiz.com/sql/online-compiler/).
2. Copy and paste the queries from [`online-bookstore.sql`](online-bookstore.sql) into the editor window.
3. Click **Run SQL** to view query outputs in the output panel.

### Option 2: Using Local MySQL (Workbench / CLI)
1. Launch **MySQL Workbench** or your terminal client and connect to your local MySQL instance.
2. Create and select a new database:
   ```sql
   CREATE DATABASE online_bookstore;
   USE online_bookstore;
   ```
3. Load and execute [`online-bookstore.sql`](online-bookstore.sql) via MySQL Workbench (**File > Open SQL Script...**) or via CLI:
   ```sql
   SOURCE online-bookstore.sql;
   ```

---

## Execution Screenshots
Screenshots verifying successful execution are located in the `screenshots/` directory:
- **Task 12 (Aggregate Functions)**: `screenshots/01-task-12-aggregate-functions.png`
- **Task 15 (INNER JOIN)**: `screenshots/02-task-15-inner-join.png`
- **Task 21 (CREATE TABLE Publishers)**: `screenshots/03-task-21-create-table.png`

