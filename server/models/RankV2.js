const Sequelize = require('sequelize');

module.exports = class Rank extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      subjectId: {
        type: Sequelize.STRING(20),
        allowNull: false      
      },
      ranks: {
        type: Sequelize.JSONB,
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Rank',
      tableName: 'ranks',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {

  }
};
