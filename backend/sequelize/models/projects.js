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
      this.hasMany(models.Project_Activities, { foreignKey: 'project_id', as: 'activities' })
      // this.hasMany(models.Financial_Requirements, {foreignKey: 'project_id', as: 'financial_requirements'})
      // this.hasMany(models.Evaluation_Plans, { foreignKey: 'project_id', as: 'evaluation_plans' })
      this.hasMany(models.Project_Partners, { foreignKey: 'project_id', as: 'project_partners' })
      this.belongsToMany(models.Partners, { through: models.Project_Partners, as: 'partners' })
      this.belongsToMany(models.Memos, { through: models.Project_Partners, as: 'memos' })
    }
  }
  Projects.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    implementer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    target_groups: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('target_groups', val.join(';'))
      },
      get() {
        return this.getDataValue('target_groups').split(';')
      }
    },
    team_members: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('team_members', val.join(';'))
      },
      get() {
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
      allowNull: false,
      validate: {
        isIn: {
          args: [[
            'Created',
            'For Revision',
            'For Review',
            'For Evaluation',
            'Pending',
            'Approved',
            'Rejected',
            'Cancelled'
          ]],
          msg: 'Invalid Status'
        }
      }
    },
    impact_statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    financial_requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        let data = JSON.stringify(val)
        this.setDataValue('financial_requirements', data)
      },
      get() {
        return JSON.parse(this.getDataValue('financial_requirements'))
      }
    },
    evaluation_plans: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(val) {
        let data = JSON.stringify(val)
        this.setDataValue('evaluation_plans', data)
      },
      get() {
        return JSON.parse(this.getDataValue('evaluation_plans'))
      }
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
