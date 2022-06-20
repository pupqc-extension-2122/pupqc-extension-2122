'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget_Item_Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasMany(models.Financial_Requirements, { foreignKey: 'category_id', as: 'financial_requirements' })
    }
  }
  Budget_Item_Categories.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Budget_Item_Categories',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Budget_Item_Categories;
};