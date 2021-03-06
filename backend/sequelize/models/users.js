'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.User_Verifications, { foreignKey: 'user_id', as: 'verification' })
      this.hasMany(models.Projects, { foreignKey: 'created_by', as: 'projects' })
      this.hasMany(models.Comments, { foreignKey: 'user_id', as: 'comments' })
      this.hasMany(models.Project_History, { foreignKey: 'author_id', as: 'history_updates' })
      this.hasMany(models.User_Roles, { foreignKey: 'user_id', as: 'user_roles' })
      this.belongsToMany(models.Roles, { foreignKey: 'user_id', through: 'User_Roles', as: 'roles' })
    }

    verify(password) {
      if (this.password)
        return bcrypt.compareSync(password, this.password)
      else
        return false
    }
  }
  Users.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    middle_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    suffix_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Please input a valid email' }
      },
      unique: { msg: 'This email is already used.' }
    },
    password: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user, options) => {
        if (this.password)
          return user.password = await bcrypt.hash(user.password, 12)
      }
    }
  });
  return Users;
};