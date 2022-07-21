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

db.sequelizeDB = sequelizeDB;
db.Sequelize = Sequelize;

export default db;
