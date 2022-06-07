'use strict';
const { get } = require('express/lib/response');
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
      this.belongsToMany(models.Projects, { through: models.Project_Partners, as: 'projects' })
      this.belongsTo(models.Partners, { foreignKey: 'partner_id', as: 'owner' })
    }
  }
  Memos.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: ['MOA', 'MOU'],
          msg: 'Type must be either MOA or MOU'
        }
      }
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    partner_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    signed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      set(value){
        let base = new Date(this.getDataValue('signed_date'))
        this.setDataValue('end_date', new Date(base.setDate(base.getDate() + (this.getDataValue('duration') * 365.25))))
      }
    },
    signed_by_pup: {
      type: DataTypes.STRING,
      allowNull: false
    },
    signed_by_partner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notarized_by: {
      type: DataTypes.STRING,
    },
    notarized_date: {
      type: DataTypes.DATEONLY,
    },
    files: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Memos',
    tableName: 'Memos',
    underscored: true,
  });
  return Memos;
};