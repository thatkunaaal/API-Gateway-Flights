"use strict";
const { Model } = require("sequelize");
const validator = require("validator");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isValidEmail(value) {
            if (!validator.isEmail(value)) {
              throw new AppError(
                "Email-ID you have provided is not in the correct format.",
                StatusCodes.BAD_REQUEST
              );
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidPassword(value) {
            if (
              !validator.isStrongPassword(value, {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
              })
            ) {
              throw new AppError(
                "Entered password is not in a strong format.{ minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,}",
                StatusCodes.BAD_REQUEST
              );
            }
          },
        },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
