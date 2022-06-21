'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Evaluations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Projects'
          },
          key: 'id'
        }
      },
      project_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      evaluation_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      evaluators: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      average_points: {
        type: Sequelize.NUMERIC,
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
    await queryInterface.dropTable('Evaluations');
  }
};