'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'created_by', as: 'extensionist' })
      this.belongsTo(models.Memos, { foreignKey: 'memo_id', as: 'memo' })
      this.hasMany(models.Project_Activities, { foreignKey: 'project_id', as: 'activities' })
      this.hasMany(models.Financial_Requirements, {foreignKey: 'project_id', as: 'financial_requirements'})
      this.hasMany(models.Evaluation_Plans, { foreignKey: 'project_id', as: 'evaluation_plans' })
      this.hasMany(models.Project_Partners, {foreignKey: 'project_id', as: 'project_partners'})
      this.belongsToMany(models.Partners, { through: models.Project_Partners, as: 'partners' })
    }
  }
  Projects.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    memo_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_groups: {
      type: DataTypes.STRING,
      set (val) {
        this.setDataValue('target_groups', val.join(';'))
      },
      get () {
        return this.getDataValue('team_members').split(';')
      }
    },
    team_members: {
      type: DataTypes.STRING,
      set (val) {
        this.setDataValue('team_members', val.join(';'))
      },
      get () {
        return this.getDataValue('team_members').split(';')
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
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    impact_statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Projects',
    tableName: 'Projects',
    underscored: true,
  });
  return Projects;
};