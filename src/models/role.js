"use strict";
const { Model } = require("sequelize");
const { Enum } = require("../utils/common");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = Enum.USER_ROLES;

module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.user, { through: "userRole", as: "User" });
    }
  }
  role.init(
    {
      name: {
        type: DataTypes.ENUM,
        values: [ADMIN, CUSTOMER, FLIGHT_COMPANY],
        defaultValue: CUSTOMER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "role",
    }
  );
  return role;
};
