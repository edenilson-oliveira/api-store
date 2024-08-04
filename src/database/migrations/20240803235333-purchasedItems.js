'use strict';

const { type } = require('os');

/** @type {import('sequelize-cli').Migration} */
module.exports = {up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('purchased-items', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        purchaseId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date(),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: new Date(),
        }
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchased-items');
  }
};
