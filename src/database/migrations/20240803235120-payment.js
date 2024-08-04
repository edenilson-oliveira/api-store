'use strict';

const { type } = require('os');

/** @type {import('sequelize-cli').Migration} */
module.exports = {up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment', {
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
        paymentMethod: {
          type: Sequelize.STRING,
          allowNull: false
        },
        value: {
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
    await queryInterface.dropTable('payment');
  }
};
