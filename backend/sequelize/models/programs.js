'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Projects, { foreignKey: 'program_id', through: models.Project_Programs, as: 'projects' })
    }
  }
  Programs.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
  }, {
    sequelize,
    modelName: 'Programs',
    tableName: 'Programs',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
  });
  return Programs;
};