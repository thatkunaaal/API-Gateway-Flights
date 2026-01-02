const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AuthUtil } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

function validateSignupRequest(req, res, next) {
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

    console.log("API gateway: ", req.user);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      ErrorResponse.error = error;

      return res.status(error.StatusCodes).json(ErrorResponse);
    }

    ErrorResponse.error = error;

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}

async function isAdmin(req, res, next) {
  const isAdmin = UserService.isAdmin(req.user);

  if (!isAdmin) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json("Insufficient Priviledege");
  }

  next();
}

async function isFlightCompany(req, res, next) {
  const isFlightCompany = await UserService.isFlightCompany(req.user);

  if (!isFlightCompany) {
    return res.status(StatusCodes.UNAUTHORIZED).json("Insufficient priviledge");
  }

  next();
}

module.exports = {
  validateSignupRequest,
  checkAuth,
  isAdmin,
  isFlightCompany,
};
