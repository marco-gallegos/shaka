'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class persona_imagen_aws_s3 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  persona_imagen_aws_s3.init({
    codigo: DataTypes.CHAR,
    etag: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'persona_imagen_aws_s3',
  });
  return persona_imagen_aws_s3;
};