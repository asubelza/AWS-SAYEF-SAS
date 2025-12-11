// src/dto/user.dto.js
export default class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.email = user.email;
    this.role = user.role;
    this.name = user.name;
  }
}



