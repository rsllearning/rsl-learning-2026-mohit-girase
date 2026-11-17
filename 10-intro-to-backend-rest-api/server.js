const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store for inventory and orders
let books = [
  { id: 'bk_501', title: 'Clean Code', author: 'Robert C. Martin', price: 29.99, stock: 1 },
  { id: 'bk_502', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 34.50, stock: 5 },
  { id: 'bk_503', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', price: 42.00, stock: 8 }
];

let orders = [];

// Root health & endpoint overview
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Online Bookstore RESTful API is running',
    version: 'v1',
    endpoints: {
      books: '/v1/books',
      single_book: '/v1/books/bk_501',
      orders: '/v1/orders',
      user_orders: '/v1/users/usr_101/orders'
    }
  });
});

// 1. Fetch list of all books
app.get('/v1/books', (req, res) => {
  res.status(200).json(books);
});

// 2. Fetch details of a specific book by ID
app.get('/v1/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error_code: 'NOT_FOUND', message: 'Book not found' });
  }
  res.status(200).json(book);
});

// 3. Add a new book to the inventory
app.post('/v1/books', (req, res) => {
  const { title, author, price, stock } = req.body;
  if (!title || price === undefined || stock === undefined) {
    return res.status(400).json({ error_code: 'VALIDATION_ERROR', message: 'Missing required book fields' });
  }
  const newBook = { id: `bk_${Date.now()}`, title, author: author || '', price: Number(price), stock: Number(stock) };
  books.push(newBook);
  res.status(201).location(`/v1/books/${newBook.id}`).json(newBook);
});

// 4. Update price of an existing book
app.patch('/v1/books/:id', (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error_code: 'NOT_FOUND', message: 'Book not found' });
  }
  if (req.body.price === undefined || typeof req.body.price !== 'number' || req.body.price < 0) {
    return res.status(400).json({ error_code: 'VALIDATION_ERROR', message: 'A valid numeric price is required' });
  }
  book.price = req.body.price;
  res.status(200).json(book);
});

// 5. Delete a book record from inventory
app.delete('/v1/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    books.splice(index, 1);
  }
  res.status(204).send();
});

// 6. Place a new book order
app.post('/v1/orders', (req, res) => {
  const { user_id, items, shipping_address } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0 || !shipping_address) {
    return res.status(400).json({
      error_code: 'VALIDATION_ERROR',
      message: 'Invalid order payload. user_id, items, and shipping_address are required.'
    });
  }

  const orderItems = [];
  let totalAmount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const book = books.find(b => b.id === item.book_id);

    if (!book) {
      return res.status(404).json({
        error_code: 'BOOK_NOT_FOUND',
        message: `Book with ID ${item.book_id} was not found.`,
        field: `items[${i}].book_id`
      });
    }

    // Insufficient stock check (Scenario 2 from Task 3)
    if (item.quantity > book.stock) {
      return res.status(409).json({
        error_code: 'INSUFFICIENT_STOCK',
        message: 'The requested quantity exceeds available inventory stock.',
        field: `items[${i}].quantity`,
        details: {
          book_id: book.id,
          requested_quantity: item.quantity,
          available_stock: book.stock
        }
      });
    }

    const subtotal = Number((book.price * item.quantity).toFixed(2));
    totalAmount += subtotal;
    orderItems.push({
      book_id: book.id,
      title: book.title,
      quantity: item.quantity,
      price_per_unit: book.price,
      subtotal
    });
  }

  // Deduct inventory stock
  items.forEach(item => {
    const book = books.find(b => b.id === item.book_id);
    if (book) book.stock -= item.quantity;
  });

  const orderId = `ord_${Math.floor(1000 + Math.random() * 9000)}`;
  const order = {
    order_id: orderId,
    user_id,
    status: 'created',
    items: orderItems,
    total_amount: Number(totalAmount.toFixed(2)),
    shipping_address,
    created_at: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).location(`/v1/orders/${order.order_id}`).json(order);
});

// 7. Retrieve all orders belonging to a specific user
app.get('/v1/users/:id/orders', (req, res) => {
  const userOrders = orders.filter(o => o.user_id === req.params.id);
  res.status(200).json(userOrders);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Online Bookstore API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
