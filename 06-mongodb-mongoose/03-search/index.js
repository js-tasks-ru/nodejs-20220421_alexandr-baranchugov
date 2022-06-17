const app = require('./app');
const db = require('./db');
const connection = require('./libs/connection');

(async function() {
  await connection.asPromise();
  await db;
})();

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
