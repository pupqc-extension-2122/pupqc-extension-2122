'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Memos, { foreignKey: 'organization_id', as: 'memos' })
    }
  }
  Organizations.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
      unique: {args: true, msg: 'The Name you entered already exists'}
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    }
  }, {
    sequelize,
    modelName: 'Organizations',
    tableName: 'Organizations',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Organizations;
};