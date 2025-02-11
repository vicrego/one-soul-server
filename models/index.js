// Initializes Sequelize models and establishes the database connection. 
// It also handles model associations (relationships between tables).

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;
if (config.use_env_variable/*sql*/) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    host: 'localhost',
    //dialect: PostgresDialect,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    pool: {
      max: 5, // Maximum number of connections in the pool
      min: 0, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in milliseconds) to try to get a connection before throwing an error
      idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
    },
    logging: console.log
  });

} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

  /*try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
*/
//}
//test()

//MODEL FILE LOADED FROM MODELS' FOLDER
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })

//EACH MODEL FILE MANIPULATION
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
