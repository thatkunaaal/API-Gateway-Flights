const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");

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

module.exports = {
  validateSingupRequest,
};
