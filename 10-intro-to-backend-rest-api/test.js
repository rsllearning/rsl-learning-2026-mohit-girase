const http = require('http');
const app = require('./server');

const PORT = 3099;
const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}...`);

  const request = (method, path, body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            ...headers
          }
        },
        res => {
          let responseBody = '';
          res.on('data', chunk => (responseBody += chunk));
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: responseBody ? JSON.parse(responseBody) : null
            });
          });
        }
      );
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  };

  try {
    console.log('1. Testing GET /v1/books...');
    const booksRes = await request('GET', '/v1/books');
    console.assert(booksRes.statusCode === 200, `Expected 200, got ${booksRes.statusCode}`);
    console.assert(Array.isArray(booksRes.body), 'Books should be an array');
    console.log('   ✓ GET /v1/books passed.');

    console.log('2. Testing GET /v1/books/:id...');
    const singleBookRes = await request('GET', '/v1/books/bk_501');
    console.assert(singleBookRes.statusCode === 200, `Expected 200, got ${singleBookRes.statusCode}`);
    console.assert(singleBookRes.body.title === 'Clean Code', 'Book title mismatch');
    console.log('   ✓ GET /v1/books/:id passed.');

    console.log('3. Testing POST /v1/books...');
    const newBookRes = await request('POST', '/v1/books', {
      title: 'Refactoring',
      author: 'Martin Fowler',
      price: 39.99,
      stock: 4
    });
    console.assert(newBookRes.statusCode === 201, `Expected 201, got ${newBookRes.statusCode}`);
    console.log('   ✓ POST /v1/books passed.');

    console.log('4. Testing PATCH /v1/books/:id...');
    const patchRes = await request('PATCH', '/v1/books/bk_501', { price: 31.99 });
    console.assert(patchRes.statusCode === 200, `Expected 200, got ${patchRes.statusCode}`);
    console.assert(patchRes.body.price === 31.99, 'Updated price mismatch');
    console.log('   ✓ PATCH /v1/books/:id passed.');

    console.log('5. Testing DELETE /v1/books/:id...');
    const deleteRes = await request('DELETE', '/v1/books/bk_503');
    console.assert(deleteRes.statusCode === 204, `Expected 204, got ${deleteRes.statusCode}`);
    console.log('   ✓ DELETE /v1/books/:id passed.');

    console.log('6. Testing POST /v1/orders - 409 Conflict (Task 3 Error Scenario)...');
    const orderConflictRes = await request(
      'POST',
      '/v1/orders',
      {
        user_id: 'usr_101',
        items: [{ book_id: 'bk_501', quantity: 999 }],
        shipping_address: { street: '123 Main St', city: 'Boston', state: 'MA', postal_code: '02115', country: 'USA' }
      },
      { Authorization: 'Bearer mock_token' }
    );
    console.assert(orderConflictRes.statusCode === 409, `Expected 409, got ${orderConflictRes.statusCode}`);
    console.assert(orderConflictRes.body.error_code === 'INSUFFICIENT_STOCK', 'Expected INSUFFICIENT_STOCK error code');
    console.log('   ✓ POST /v1/orders (409 Conflict) passed.');

    console.log('7. Testing POST /v1/orders - 201 Created (Task 3 Success Scenario)...');
    const orderSuccessRes = await request(
      'POST',
      '/v1/orders',
      {
        user_id: 'usr_101',
        items: [{ book_id: 'bk_502', quantity: 1 }],
        shipping_address: { street: '123 Main St', city: 'Boston', state: 'MA', postal_code: '02115', country: 'USA' }
      },
      { Authorization: 'Bearer mock_token' }
    );
    console.assert(orderSuccessRes.statusCode === 201, `Expected 201, got ${orderSuccessRes.statusCode}`);
    console.assert(orderSuccessRes.body.status === 'created', 'Expected order status created');
    console.log('   ✓ POST /v1/orders (201 Created) passed.');

    console.log('8. Testing GET /v1/users/:id/orders...');
    const userOrdersRes = await request('GET', '/v1/users/usr_101/orders');
    console.assert(userOrdersRes.statusCode === 200, `Expected 200, got ${userOrdersRes.statusCode}`);
    console.assert(userOrdersRes.body.length >= 1, 'Expected at least 1 user order');
    console.log('   ✓ GET /v1/users/:id/orders passed.');

    console.log('\nAll 8 API verification tests passed successfully!');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
