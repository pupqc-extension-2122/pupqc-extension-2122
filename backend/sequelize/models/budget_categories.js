'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget_Categories extends Model {
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
  Budget_Categories.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: {args: true, msg: 'This category already exists'}
    }
  }, {
    sequelize,
    modelName: 'Budget_Categories',
    tableName: 'Budget_Categories',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Budget_Categories;
};