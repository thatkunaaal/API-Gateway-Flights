const validator = require("validator");
const bcrypt = require("bcrypt");
const AppError = require("../errors/app-error");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

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

async function generateJWT(payload) {
  try {
    const jwtToken = new Promise((res, rej) => {
      jwt.sign(payload, ServerConfig.JWT_SECRET_KEY, function (err, token) {
        if (err) rej(err);
        res(token);
      });
    });

    return jwtToken;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong while creating JWT",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  validatePassword,
  generateJWT,
};
