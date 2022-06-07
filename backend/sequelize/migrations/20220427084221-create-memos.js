'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Memos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
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
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      signed_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
      },
      signed_by_pup: {
        type: Sequelize.STRING,
        allowNull: false
      },
      signed_by_partner: {
        type: Sequelize.STRING,
        allowNull: false
      },
      notarized_by: {
        type: Sequelize.STRING
      },
      notarized_date: {
        type: Sequelize.DATEONLY
      },
      files: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.addConstraint('Memos', ['type'], {
        type: 'check',
        where: {
          type: ['MOA', 'MOU']
        }
      })
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Memos');
  }
};