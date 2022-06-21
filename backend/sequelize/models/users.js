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
      this.hasMany(models.Projects, { foreignKey: 'created_by', as: 'projects' })
      this.hasMany(models.Comments, { foreignKey: 'user_id', as: 'comments' })
      this.belongsToMany(models.Roles, { foreignKey: 'user_id', through: 'User_Roles' })
    }

    verify(password) {
      return bcrypt.compareSync(password, this.password)
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
      allowNull: false
    },
    middle_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
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
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'Users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user, options) => {
        return user.password = await bcrypt.hash(user.password, 12)
      }
    }
  });
  return Users;
};