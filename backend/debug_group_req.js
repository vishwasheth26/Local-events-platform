const http = require('http');

// Assuming group ID 1 exists, or we might need to find one first.
// Let's try ID 1.
http.get('http://localhost:4001/groups/1', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
