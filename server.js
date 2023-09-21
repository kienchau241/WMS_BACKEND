const sql = require('mssql');
require('dotenv').config();
const app = require("./app");
const dbConfig = require("./src/database/dbConfig");

// Chat GPT Solution

// sql.connect(dbConfig.dbConfig)
//   .then((pool) => {
//     console.log('Connected to SQL Server');
//     dbConfig.dbConfig.pool = pool;
//   })
//   .catch((error) => {
//     console.error('Error connecting to SQL Server:', error);
//   });

// Human Solution
const appPool = new sql.ConnectionPool(dbConfig.dbConfig)
appPool
  .connect()
  .then(function(pool){
    //console.log(pool);
    console.log("SQL connnected");
    dbConfig.db.pool = pool;
  })
  .catch(function(e){
    console.error("Error creating connection pool ", e);
  })

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});