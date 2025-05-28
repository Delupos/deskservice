'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Spalte 'seats' zur Tabelle 'table'
    await queryInterface.addColumn('table', 'seats', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });

    // 2. Spalte 'place' zur Tabelle 'appendixImages'
    await queryInterface.addColumn('appendixImages', 'place', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Duesseldorf',
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Spalte 'seats' wieder entfernen
    await queryInterface.removeColumn('table', 'seats');

    // 2. Spalte 'place' wieder entfernen
    await queryInterface.removeColumn('appendixImages', 'place');
  }
};
