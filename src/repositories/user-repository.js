const CrudRepository = require("./crud-repository");
const { user } = require("../models");

class UserRepository extends CrudRepository {
  constructor() {
    super(user);
  }

  async getUser(email) {
    const response = await user.findOne({
      where: {
        email: email,
      },
    });

    return response;
  }
}

module.exports = UserRepository;
