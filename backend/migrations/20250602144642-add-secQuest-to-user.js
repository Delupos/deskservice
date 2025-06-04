'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'secQuest', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'defaultQuestion' // damit bestehende User keinen Fehler verursachen
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'secQuest');
  }
};
