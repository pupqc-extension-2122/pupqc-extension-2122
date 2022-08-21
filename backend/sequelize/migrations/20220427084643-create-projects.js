'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      implementer: {
        type: Sequelize.STRING,
        allowNull: false
      },
      target_groups: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      team_members: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      impact_statement: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      financial_requirements: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      evaluation_plans: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      monitoring_frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      monitoring_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      funding_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      funding_endorsement_date: {
        type: Sequelize.DATEONLY
      },
      SO_number: {
        type: Sequelize.STRING,
      },
      SO_release_date: {
        type: Sequelize.DATEONLY
      },
      cash_release_date: {
        type: Sequelize.DATEONLY
      },
      notice_release_date: {
        type: Sequelize.DATEONLY
      },
      presentation_date: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Projects');
  }
};