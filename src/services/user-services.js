const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const userRepo = new UserRepository();
const { AuthUtil } = require("../utils/common");
const RoleRepository = require("../repositories/role-repository");
const roleRepo = new RoleRepository();
const { Enum } = require("../utils/common");

async function signup(data) {
  try {
    const user = await userRepo.create(data);

    const role = await roleRepo.getRoleByName(Enum.USER_ROLES.CUSTOMER);

    await user.addRole(role);

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

    const response = await userRepo.getUser(email);

    if (!response) {
      throw new AppError("User not found", StatusCodes.BAD_REQUEST);
    }

    const user = response.dataValues;

    const res = await AuthUtil.validatePassword(password, user.password);

    if (!res) {
      throw new AppError("Invalid Password", StatusCodes.BAD_REQUEST);
    }

    const jwt = await AuthUtil.generateJWT({ email: user.email, id: user.id });

    return jwt;
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      throw new AppError(error.message, error.StatusCodes);
    }

    throw new AppError(
      "Something went wrong while doing signin",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function checkUserById(data) {
  try {
    console.log(data);
    const user = await userRepo.get(data);
    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError("User not found", error.StatusCodes);
    }

    throw new AppError(
      "Something went wrong while checking user by ID",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing JWT token", StatusCodes.BAD_REQUEST);
    }

    const jwtToken = token.split(" ")[1];

    const response = AuthUtil.verifyJwt(jwtToken);
    if (!response) {
      throw new AppError("Invalid token", StatusCodes.BAD_REQUEST);
    }

    const user = await userRepo.get(response.id);
    if (!user) {
      throw new AppError("User not found", StatusCodes.BAD_REQUEST);
    }

    const roleArr = await user.getRole();

    const roles = roleArr.map((item) => item.dataValues.name);

    user.dataValues.role = roles;

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid token", StatusCodes.BAD_REQUEST);
    }

    if (error.name == "TokenExpiredError") {
      throw new AppError("JWT token expired", StatusCodes.BAD_REQUEST);
    }

    console.log(error);
    throw new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function addRoleToUser(data) {
  try {
    const userResponse = await userRepo.get(data.id);

    if (!userResponse) {
      throw new AppError("User not found", StatusCodes.BAD_REQUEST);
    }

    const roleResponse = await roleRepo.getRoleByName(data.role);

    if (!roleResponse) {
      throw new AppError("Role not found", StatusCodes.BAD_REQUEST);
    }

    await userResponse.addRole(roleResponse);

    return userResponse;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.explanation, error.StatusCodes);
    }

    throw error;
  }
}

async function isAdmin(data) {
  try {
    const user = data;

    const role = await roleRepo.getRoleByName(Enum.USER_ROLES.ADMIN);

    const result = await user.hasRole(role);

    return result;
  } catch (error) {
    throw error;
  }
}

async function isFlightCompany(data) {
  try {
    const user = data;

    const role = await roleRepo.getRoleByName(Enum.USER_ROLES.FLIGHT_COMPANY);

    const result = await user.hasRole(role);

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
  signin,
  checkUserById,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
  isFlightCompany,
};
