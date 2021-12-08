const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      hashedPassword: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      quizRecord: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {

  }
};
