'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Memos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Documents, { foreignKey: 'memo_id', as: 'documents' })
      this.belongsToMany(models.Projects, { foreignKey: 'memo_id', through: models.Project_Partners, as: 'projects' })
      this.belongsTo(models.Partners, { foreignKey: 'partner_id', as: 'partner' })
      this.belongsTo(models.Organizations, { foreignKey: 'organization_id', as: 'organization' })
    }
  }
  Memos.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    partner_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
    },
    validity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notEmpty: true },
    },
    end_date: {
      type: DataTypes.DATEONLY,
      set(val) {
        let base = new Date(this.getDataValue('validity_date'))
        this.setDataValue('end_date', new Date(base.setDate(base.getDate() + (this.getDataValue('duration') * 365.25))))
      }
    },
    representative_pup: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    representative_partner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    notarized_date: {
      type: DataTypes.DATEONLY,
    },
    witnesses: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
      set: function (val) {
        this.setDataValue('witnesses', JSON.stringify(val))
      },
      get: function () {
        return JSON.parse(this.getDataValue('witnesses'))
       }
    },
  }, {
    sequelize,
    modelName: 'Memos',
    tableName: 'Memos',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Memos;
};