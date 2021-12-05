const Sequelize = require('sequelize');

const User = require('./UserV2');
const Rank = require('./RankV2');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,  
);

db.sequelize = sequelize;

db.User = User;
db.Rank = Rank;

User.init(sequelize);
Rank.init(sequelize);

module.exports = db;