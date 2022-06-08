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
      this.hasMany(models.Topics, { foreignKey: 'activity_id', as: 'topics' })
    }
  }
  Project_Activities.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outcomes: {
      type: DataTypes.STRING,
      set(val){
        this.setDataValue('outcomes', val.join(';'))
      },
      get(){
        return this.getDataValue('outcomes').split(';')
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Project_Activities',
    tableName: 'Project_Activities',
    underscored: true,
  });
  return Project_Activities;
};