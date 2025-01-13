//Configuration for database connection using Sequelize

const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    //url: process.env.PGDATABASE,
    /*username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.SQL,
    host: process.env.PGHOST,
    SQL: process.env.SQL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
    */
    url: process.env.SQL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
};