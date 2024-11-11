const Sequelize = require('sequelize');
require('dotenv').config();

// Connection
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST_NAME,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: false,
        }
    },
    logging: false,
});

// Connection test
db
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        db.sync()
            .then(() => {
                console.log('Database and tables schemas are synched');
            });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    })

module.exports = db;