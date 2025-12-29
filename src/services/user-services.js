const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const userRepo = new UserRepository();

async function signup(data) {
  try {
    const user = await userRepo.create(data);
    return user;
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      let explanation = [];

      error.errors.forEach((err) => {
        explanation.push(err.message);
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw error;
  }
}

module.exports = {
  signup,
};
