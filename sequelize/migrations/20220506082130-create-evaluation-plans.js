'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluation_Plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      project_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Projects'
          }
        }
      },
      outcome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      collector: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_collection_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Evaluation_Plans');
  }
};