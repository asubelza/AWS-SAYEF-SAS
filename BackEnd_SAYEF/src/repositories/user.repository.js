import UserDBManager from "../dao/userDBManager.js";

export default class UserRepository {
  constructor() {
    this.dao = new UserDBManager();
  }

  create(data) {
    return this.dao.createUser(data);
  }

  getByEmail(email) {
    return this.dao.getUserByEmail(email);
  }

  getById(id) {
    return this.dao.getUserById(id);
  }

  update(id, data) {
    return this.dao.updateUser(id, data);
  }

  delete(id) {
    return this.dao.deleteUser(id);
  }
}

