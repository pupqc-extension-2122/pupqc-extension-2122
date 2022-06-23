'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Evaluations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Projects, { foreignKey: 'project_id', as: 'project' })
    }
  }
  Project_Evaluations.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUID4,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true }
    },
    project_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    evaluation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notEmpty: true }
    },
    evaluators: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set(val) {
        this.setDataValue('evaluators', val.join(';'))
      },
      get() {
        return this.getDataValue('evaluators').split(';')
      }
    },
    average_points: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      validate: { notEmpty: true }
    }
  }, {
    sequelize,
    modelName: 'Project_Evaluations',
    tableName: 'Project_Evaluations',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Project_Evaluations;
};