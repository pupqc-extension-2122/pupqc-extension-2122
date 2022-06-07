'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Memos, { foreignKey: 'partner_id', as: 'memos' })
      this.belongsToMany(models.Projects, { through: models.Project_Partners })
    }
  }
  Partners.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The provided partner is already in the database.'
      }
    }
  }, {
    sequelize,
    modelName: 'Partners',
    tableName: 'Partners',
    underscored: true,
  });
  return Partners;
};