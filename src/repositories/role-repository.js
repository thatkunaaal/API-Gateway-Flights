const CrudRepository = require("./crud-repository");
const { role } = require("../models");

class RoleRepository extends CrudRepository {
  constructor() {
    super(role);
  }

  async getRoleByName(name) {
    const response = await role.findOne({
      where: {
        name: name,
      },
    });

    return response;
  }
}

module.exports = RoleRepository;
