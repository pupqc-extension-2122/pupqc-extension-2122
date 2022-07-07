'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Activities extends Model {
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
  Project_Activities.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: { notEmpty: true },
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    topics: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set(val) {
        this.setDataValue('topics', val.join(';'))
      },
      get() {
        return this.getDataValue('topics').split(';')
      }
    },
    outcomes: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set(val) {
        this.setDataValue('outcomes', val.join(';'))
      },
      get() {
        return this.getDataValue('outcomes').split(';')
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notEmpty: true },
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notEmpty: true },
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    evaluation: {
      type: DataTypes.TEXT,
      set(val){
        this.setDataValue('evaluation', JSON.stringify(val))
      },
      get(){
        return JSON.parse(this.getDataValue('evaluation'))
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Not Yet Graded'
    }
  }, {
    sequelize,
    modelName: 'Project_Activities',
    tableName: 'Project_Activities',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Project_Activities;
};