import { Sequelize } from 'sequelize';
import Logger from './logger';

import dotenv from 'dotenv';
dotenv.config();

export { DataTypes } from 'sequelize';

const logger = Logger.logger;
//console.log("\n\n process env", process.env)

let DATABASE = process.env.DATABASE;
let USERNAME = process.env.DB_USER;
let PASSWORD = process.env.PASSWORD;
let HOST = process.env.HOST;
let PORT = parseInt(process.env.PORT);

if (process.env.NODE_ENV === 'test') {
  DATABASE = process.env.DATABASE_TEST;
  USERNAME = process.env.DB_USER_TEST;
  PASSWORD = process.env.PASSWORD_TEST;
  HOST = process.env.HOST_TEST;
  PORT = parseInt(process.env.PORT_TEST);
}

//console.log("\n\n user name", USERNAME, PASSWORD)

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connected to the database.');
  })
  .catch((error) => {
    logger.error('Could not connect to the database.', error);
  });

sequelize.sync();

export default sequelize;
