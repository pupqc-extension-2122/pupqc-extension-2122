'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Projects, { foreignKey: 'project_id', as: 'project' })
      this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' })
    }
  }
  Comments.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    project_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: { notEmpty: true },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    }
  }, {
    sequelize,
    modelName: 'Comments',
    tableName: 'Comments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Comments;
};