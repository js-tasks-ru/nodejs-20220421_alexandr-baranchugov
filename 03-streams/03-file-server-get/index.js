const server = require('./server');
const fs = require('fs');
const path = require('path');


server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000');
});
