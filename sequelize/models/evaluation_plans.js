'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluation_Plans extends Model {
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
  Evaluation_Plans.init({
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
    outcome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    collector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_collection_method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Evaluation_Plans',
    underscored: true,
  });
  return Evaluation_Plans;
};