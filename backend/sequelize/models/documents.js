'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Documents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Projects, { foreignKey: 'project_id', as: 'project' })
      this.belongsTo(models.Memos, { foreignKey: 'memo_id', as: 'memo' })
    }
  }
  Documents.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    project_id: {
      type: DataTypes.UUID,
    },
    memo_id: {
      type: DataTypes.UUID,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upload_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_type: {
      type: DataTypes.VIRTUAL,
      get() {
        let val = ''
        if (this.getDataValue('project_id') != null)
          val = 'project'
        if (this.getDataValue('memo_id') != null)
          val = 'memo'

        return val
      }
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Documents',
    tableName: 'Documents',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Documents;
};