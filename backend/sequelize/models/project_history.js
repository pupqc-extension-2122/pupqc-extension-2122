'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Projects, { foreignKey: 'project_id', as: 'project' })
      this.belongsTo(models.Users, {foreignKey: 'author_id', as: 'author'})
    }
  }
  Project_History.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    previous_value: {
      type: DataTypes.STRING,
    },
    current_value: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    remarks: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true }
    },
    author_id: {
      type: DataTypes.UUID
    },
  }, {
    sequelize,
    modelName: 'Project_History',
    tableName: 'Project_Histories',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Project_History;
};