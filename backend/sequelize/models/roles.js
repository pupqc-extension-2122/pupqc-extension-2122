'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Users, { through: 'User_Roles' })
    }
  }
  Roles.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Roles;
};