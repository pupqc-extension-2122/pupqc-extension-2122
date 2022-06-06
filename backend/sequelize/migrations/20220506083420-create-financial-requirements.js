'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Financial_Requirements', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Projects'
          },
          key: 'id'
        }
      },
      category_id: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'Budget_Item_Categories'
          },
          key: 'id'
        }
      },
      budget_item: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      particulars: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estimated_cost: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Financial_Requirements');
  }
};