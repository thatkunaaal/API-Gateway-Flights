const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

async function singup(req, res) {
  try {
    const user = await UserService.signup({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      age: req.body.age,
    });

    SuccessResponse.data = user;

    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    if (error instanceof AppError) {
      ErrorResponse.message = error.message;
      ErrorResponse.error = error;

      return res.status(error.StatusCodes).json(ErrorResponse);
    }
    console.log(error);
    ErrorResponse.message = "Something went wrong while creating user";
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function signin(req, res) {
  try {
    const jwt = await UserService.signin({
      email: req.body.email,
      password: req.body.password,
    });

    SuccessResponse.message = "Log-in successfull";
    SuccessResponse.data = jwt;

    res.cookie("x_access_token", `Bearer ${jwt}`, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;

    return res.status(error.StatusCodes).json(ErrorResponse);
  }
}

module.exports = {
  singup,
  signin,
};
