import Sequelize from 'sequelize';
import configOptions from './config.js';

const env = process.env.NODE_ENV || 'development';
const config = configOptions[env];

let sequelizeDB;
if (config.use_env_variable) {
  sequelizeDB = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizeDB = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {};

// If you are choosing to use this database with models
// This is where the models attach themselves to your database
// It is commented out because ORM management is a lot for a basic class.

/* Associate models to database and return resulting object */
// const db = Object.keys(modelList).reduce((collection, modelName) => {
//   if (!collection[modelName]) {
//     // eslint-disable-next-line no-param-reassign
//     collection[modelName] = modelList[modelName](sequelizeDB, DataTypes);
//   }
//   return collection;
// }, {});

/* Fire off associations to make sure tables can call one another through models */
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

/* Resulting object shape */
/* {
    {
      Meals: // a sequelize entry that connects the model for Meals
      Halls: // Halls
      Macros: // Macros
    }
  }
*/

db.sequelizeDB = sequelizeDB;
db.Sequelize = Sequelize;

export default db;
