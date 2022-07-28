'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project_Programs.init({
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true }
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true }
    },
  }, {
    sequelize,
    modelName: 'Project_Programs',
    tableName: 'Project_Programs',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Project_Programs;
};