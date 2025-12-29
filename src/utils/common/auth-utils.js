const validator = require("validator");
const bcrypt = require("bcrypt");
const AppError = require("../errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function validatePassword(plainPassword, hashedPassword) {
  const isStrongPassword = validator.isStrongPassword(plainPassword, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrongPassword) {
    return false;
  }

  const isPasswordMatching = await bcrypt.compare(
    plainPassword,
    hashedPassword
  );

  if (!isPasswordMatching) {
    return false;
  }

  return true;
}

module.exports = {
  validatePassword,
};
