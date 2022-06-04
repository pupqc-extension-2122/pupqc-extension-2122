'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  User_Roles.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.UUID,
    role_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'User_Roles',
    tableName: 'User_Roles',
    underscored: true
  });
  return User_Roles;
};