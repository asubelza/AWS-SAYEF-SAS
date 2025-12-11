import UserModel from "./models/user.model.js";

class UserDBManager {
  async createUser(userData) {
    return await UserModel.create(userData);
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async getUserById(uid) {
    return await UserModel.findById(uid);
  }

  async updateUser(uid, updateData) {
    return await UserModel.updateOne({ _id: uid }, updateData);
  }

  async deleteUser(uid) {
    return await UserModel.deleteOne({ _id: uid });
  }
}

export default UserDBManager;
