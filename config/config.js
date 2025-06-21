//Configuration for database connection using Sequelize

const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    url: process.env.SQL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  }
};