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
      this.belongsToMany(models.Roles, { through: 'User_Roles' })
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
    full_name: {
      type: DataTypes.VIRTUAL,
      get: function(){
        const first_name = this.getDataValue('first_name')
        const middle_name = this.getDataValue('middle_name') || null
        const last_name = this.getDataValue('last_name')
        if (this.getDataValue('middle_name') != null)
          return `${first_name} ${middle_name} ${last_name}`
        else
          return `${first_name} ${last_name}`
      }
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
    underscored: true,
    hooks: {
      beforeCreate: async (user, options) => {
        return user.password = await bcrypt.hash(user.password, 12)
      }
    }
  });
  return Users;
};