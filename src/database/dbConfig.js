exports.dbConfig = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use if connecting to Azure SQL
        trustServerCertificate: true,
    },
}

exports.db = {};