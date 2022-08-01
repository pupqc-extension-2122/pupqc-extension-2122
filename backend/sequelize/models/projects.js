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
      this.hasOne(models.Project_Evaluations, { foreignKey: 'project_id', as: 'evaluation' })
      this.hasMany(models.Documents, { foreignKey: 'project_id', as: 'documents' })
      this.hasMany(models.Project_History, { foreignKey: 'project_id', as: 'history' })
      this.hasMany(models.Project_Partners, { foreignKey: 'project_id', as: 'project_partners' })
      this.hasMany(models.Project_Activities, { foreignKey: 'project_id', as: 'activities' })
      this.hasMany(models.Project_Programs, { foreignKey: 'project_id', as: 'project_programs' })
      this.hasMany(models.Comments, { foreignKey: 'project_id', as: 'comments' })
      this.belongsTo(models.Users, { foreignKey: 'created_by', as: 'extensionist' })
      this.belongsToMany(models.Partners, { foreignKey: 'project_id', through: models.Project_Partners, as: 'partners' })
      this.belongsToMany(models.Memos, { foreignKey: 'project_id', through: models.Project_Partners, as: 'memos' })
      this.belongsToMany(models.Programs, { foreignKey: 'project_id', through: models.Project_Programs, as: 'programs' })
    }
  }
  Projects.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false, validate: { notEmpty: true },
      primaryKey: true,
    },
    SO_number: {
      type: DataTypes.STRING,
      validate: { notEmpty: true }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, validate: { notEmpty: true }
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    implementer: {
      type: DataTypes.STRING,
      allowNull: false, validate: { notEmpty: true }
    },
    target_groups: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set(val) {
        this.setDataValue('target_groups', JSON.stringify(val))
      },
      get() {
        return JSON.parse(this.getDataValue('target_groups'))
      }
    },
    team_members: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set(val) {
        let data = JSON.stringify(val)
        this.setDataValue('team_members', data)
      },
      get() {
        return JSON.parse(this.getDataValue('team_members'))
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false, validate: { notEmpty: true }
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false, validate: { notEmpty: true }
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
            'Cancelled'
          ]],
          msg: 'Invalid Status'
        }
      }
    },
    impact_statement: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true }
    },
    financial_requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
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
      validate: { notEmpty: true },
      set(val) {
        let data = JSON.stringify(val)
        this.setDataValue('evaluation_plans', data)
      },
      get() {
        return JSON.parse(this.getDataValue('evaluation_plans'))
      }
    },
    monitoring_frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: {
          args: [[
            'Monthly',
            'Quarterly',
            'Semi-Annually',
            'Annually'
          ]]
        }
      },
    },
    monitoring_method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: {
          args: [[
            'Site Visit',
            'Telephone Logs',
            'Interview',
            'Observation',
            'Survey'
          ]]
        }
      },
    },
    funding_type: {
      type: DataTypes.STRING,
      defaultValue: 'Internal',
      validate: {
        isIn: {
          args: [[
            'Internal',
            'External'
          ]]
        }
      }
    },
    funding_approval_date: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: true }
    },
    SO_release_date: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: true }
    },
    cash_release_date: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: true }
    },
    notice_release_date: {
      type: DataTypes.DATEONLY,
      validate: { notEmpty: true }
    },
    presentation_date: DataTypes.DATEONLY,
    created_by: {
      type: DataTypes.UUID,
      allowNull: false, validate: { notEmpty: true }
    }
  }, {
    sequelize,
    modelName: 'Projects',
    tableName: 'Projects',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Projects;
};
