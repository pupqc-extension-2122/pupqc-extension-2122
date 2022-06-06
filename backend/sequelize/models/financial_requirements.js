'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Financial_Requirements extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Projects, { foreignKey: 'project_id', as: 'project' })
      this.belongsTo(models.Budget_Item_Categories, { foreignKey: 'cateogry_id', as: 'category' })
    }
  }
  Financial_Requirements.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    project_id: DataTypes.UUID,
    category_id: DataTypes.UUID,
    budget_item: DataTypes.STRING,
    particulars: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    estimated_cost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Financial_Requirements',
    tableName: 'Financial_Requirements',
    underscored: true,
  });
  return Financial_Requirements;
};