import mysql from 'mysql';
import configOptions from './config.js';

const env = process.env.NODE_ENV || 'development';
const options = configOptions[env];

const mysqlDB = mysql.createConnection(options);

const db = {};

db.mysqlDB = mysqlDB;
db.MySql = mysql;

export default db;
