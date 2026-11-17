# Online Bookstore RESTful API Backend

This document contains the RESTful API backend design, documentation, and data-exchange specifications for the **Online Bookstore System**, covering Tasks 1, 2, and 3.

---

## Task 1: Backend Architecture & Request Lifecycle

### Scenario
A user clicks **"Add to Cart"** on the bookstore web frontend.

---

### 1. Complete Request-Response Journey

1. **DNS Lookup & IP Address**:
   - The browser extracts the domain (e.g., `api.bookstore.com`) and queries DNS caches (browser $\rightarrow$ OS $\rightarrow$ router $\rightarrow$ recursive resolver).
   - If not cached, the resolver queries Root (`.`), TLD (`.com`), and Authoritative nameservers to resolve the domain into a public IP address (A/AAAA record).
   - The browser uses this IP address as the destination for network packets.

2. **Standard HTTP/HTTPS Protocols & Ports**:
   - Traffic uses **HTTPS over Port 443** (Port 80 requests are redirected to 443).
   - The browser completes a **TCP 3-way handshake** (SYN, SYN-ACK, ACK) followed by a **TLS 1.3 handshake** to verify the server certificate and establish end-to-end encryption.
   - The browser transmits an HTTP `POST` request with headers (`Authorization`, `Content-Type: application/json`) and the payload (`{"book_id": "bk_501", "quantity": 1}`).

3. **Server, Application/Business Logic Layer, and Database**:
   - **Web Server / Reverse Proxy** (e.g., Nginx): Receives the connection on port 443, terminates TLS, and forwards decrypted requests to the application process.
   - **Application / Business Logic Layer**: Authenticates user identity, validates payload data, checks inventory availability, and coordinates database operations.
   - **Database**: Executes atomic transaction queries (`SELECT` stock, `INSERT`/`UPDATE` cart items) and commits changes to storage.
   - **Return Traversal**: The application constructs an HTTP `201 Created` JSON response. It travels back through the reverse proxy, is re-encrypted over TLS, sent across TCP/IP, and received by the browser to update UI state (cart count, confirmation toast).

---

### 2. Responsibilities of the Application/Business Logic Layer

1. **Authentication & Authorization**: Validates user credentials (JWT/session token) to verify identity (`user_id`) and permissions.
2. **Schema & Input Validation**: Ensures the JSON payload contains required fields with valid types (`book_id` is a valid identifier, `quantity >= 1`).
3. **Inventory Availability Check**: Queries catalog stock to verify `requested_quantity <= available_stock`; returns `409 Conflict` if unavailable.
4. **Business Rules Enforcement**: Applies purchase limits (e.g., max items per order), verifies book availability status (not archived/restricted), and captures current pricing.
5. **Idempotency & Cart Merging**: Checks if the book already exists in the user's cart—updates quantity if present, or inserts a new line item if not.
6. **Transaction & State Persistence**: Manages database transaction boundaries (`BEGIN`/`COMMIT`) to ensure consistency.
7. **Response Serialization**: Formats the JSON response body and returns appropriate HTTP status codes (`201 Created` or error status).

---

## Task 2: RESTful Endpoint Design

### Design Guidelines
- **Resource-based, lowercase, plural nouns**: `/v1/books`, `/v1/orders`, `/v1/users`.
- **Standard HTTP verbs**: `GET` (read), `POST` (create), `PATCH` (partial update), `DELETE` (delete).
- **API Versioning**: Prefix `/v1/` on all endpoints.

### Completed RESTful Endpoint Design Table

| Requirement / Operation | HTTP Method | Endpoint (URL Path) | Safe? (Yes/No) | Idempotent? (Yes/No) | Brief Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Fetch list of all books** | `GET` | `/v1/books` | **Yes** | **Yes** | Retrieves a list of all available books in the inventory. |
| **Fetch details of a specific book by ID** | `GET` | `/v1/books/{id}` | **Yes** | **Yes** | Retrieves details and metadata for a single book identified by `{id}`. |
| **Add a new book to the inventory** | `POST` | `/v1/books` | **No** | **No** | Creates and adds a new book record to the inventory catalog. |
| **Update price of an existing book** | `PATCH` | `/v1/books/{id}` | **No** | **No** | Updates only the price field of the specified book. |
| **Delete a book record from inventory** | `DELETE` | `/v1/books/{id}` | **No** | **Yes** | Removes the specified book record from the inventory catalog. |
| **Place a new book order** | `POST` | `/v1/orders` | **No** | **No** | Creates a new order, decrements book stock, and creates an order record. |
| **Retrieve all orders belonging to a specific user** | `GET` | `/v1/users/{id}/orders` | **Yes** | **Yes** | Retrieves all order records associated with the specified user ID `{id}`. |

> **Note**:
> - **Safe**: Does not modify server state (`GET`).
> - **Idempotent**: Multiple identical requests produce the same server state as a single request (`GET`, `DELETE`). `POST` is neither safe nor idempotent. `PATCH` is non-idempotent by specification (RFC 9110), although setting an absolute price value behaves idempotently in practice.

---

## Task 3: Data Exchange & JSON Payloads

Operation: **Place a new book order** (`POST /v1/orders`)

### 1. Successful Order Creation (`201 Created`)

#### Request Headers
```http
POST /v1/orders HTTP/1.1
Host: api.bookstore.com
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

#### Request JSON Body
```json
{
  "user_id": "usr_101",
  "items": [
    {
      "book_id": "bk_501",
      "quantity": 2
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "postal_code": "02115",
    "country": "USA"
  }
}
```

#### Response Headers
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Location: /v1/orders/ord_9001
```

#### Successful Response JSON Body
```json
{
  "order_id": "ord_9001",
  "user_id": "usr_101",
  "status": "created",
  "items": [
    {
      "book_id": "bk_501",
      "title": "Clean Code",
      "quantity": 2,
      "price_per_unit": 29.99,
      "subtotal": 59.98
    }
  ],
  "total_amount": 59.98,
  "shipping_address": {
    "street": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "postal_code": "02115",
    "country": "USA"
  },
  "created_at": "2026-11-17T14:15:00Z"
}
```

---

### 2. Error Handling Scenario

#### Failure Scenario Description
User requests **2 copies** of book `bk_501`, but only **1 copy** is available in inventory.

#### HTTP Status Code
**`409 Conflict`** *(resource state conflict due to insufficient inventory)*

#### Structured JSON Error Response Body
```json
{
  "error_code": "INSUFFICIENT_STOCK",
  "message": "The requested quantity exceeds available inventory stock.",
  "field": "items[0].quantity",
  "details": {
    "book_id": "bk_501",
    "requested_quantity": 2,
    "available_stock": 1
  }
}
```

---

## Mock Server Instructions

A lightweight mock server (`server.js`) is included to test all endpoints.

### Running the Server
```bash
cd 10-intro-to-backend-rest-api
npm install
npm start
```
Starts on `http://localhost:3000` (visiting `http://localhost:3000` displays an API index).

### Running Automated Tests
```bash
npm test
```
Verifies all 7 endpoints and Task 3 scenarios.
