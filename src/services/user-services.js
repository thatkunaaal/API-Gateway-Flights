const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const userRepo = new UserRepository();
const { AuthUtil } = require("../utils/common");

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

async function signin(data) {
  try {
    const { email, password } = data;

    const user = await userRepo.getUser(email);

    if (!user) {
      throw new AppError("User not found", StatusCodes.BAD_REQUEST);
    }

    const res = await AuthUtil.validatePassword(password, user.password);

    if (!res) {
      throw new AppError("Invalid Password", StatusCodes.BAD_REQUEST);
    }

    return true;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.message, error.StatusCodes);
    }

    throw new AppError(
      "Something went wrong while doing signin",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  signup,
  signin,
};
