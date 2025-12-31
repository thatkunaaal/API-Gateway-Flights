const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AuthUtil } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

function validateSingupRequest(req, res, next) {
  if (!req.body) {
    ErrorResponse.error = {
      explanation:
        "You have to pass your personal-information to create a user",
    };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.email) {
    ErrorResponse.error = {
      explanation: "You have to pass your email to create a user",
    };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.password) {
    ErrorResponse.error = {
      explanation: "You have to pass your password to create a user",
    };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  if (!req.body.name) {
    ErrorResponse.error = {
      explanation: "You have to pass your name to create a user",
    };

    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  next();
}

async function checkAuth(req, res, next) {
  try {
    const response = await UserService.isAuthenticated(
      req.cookies["x_access_token"]
    );

    if (!response) {
      throw new AppError(
        "Authentication failed, Kindly re-login.",
        StatusCodes.BAD_REQUEST
      );
    }

    req.user = response;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      ErrorResponse.error = error;

      return res.status(error.StatusCodes).json(error);
    }

    ErrorResponse.error = error;

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

module.exports = {
  validateSingupRequest,
  checkAuth,
};
