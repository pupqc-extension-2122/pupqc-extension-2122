'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Verifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
    }

    verify(code) {
      return bcrypt.compareSync(code, this.code)
    }
  }
  User_Verifications.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User_Verifications',
    tableName: 'User_Verifications',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (model, options) => {
        return model.code = await bcrypt.hash(model.code, 12)
      }
    }
  });
  return User_Verifications;
};