'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Partners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project_Partners.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    memo_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Project_Partners',
    tableName: 'Project_Partners',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Project_Partners;
};