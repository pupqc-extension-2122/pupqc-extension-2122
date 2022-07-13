'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      partner_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Partners'
          },
          key: 'id'
        }
      },
      partner_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      organization_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Organizations'
          },
          key: 'id'
        }
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      validity_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
      },
      representative_pup: {
        type: Sequelize.STRING,
        allowNull: false
      },
      representative_partner: {
        type: Sequelize.STRING,
        allowNull: false
      },
      notarized_date: {
        type: Sequelize.DATEONLY
      },
      witnesses: {
        type: Sequelize.TEXT,
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
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Memos');
  }
};