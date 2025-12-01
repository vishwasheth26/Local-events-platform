const http = require('http');

http.get('http://localhost:4001/events/1', (res) => {
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
