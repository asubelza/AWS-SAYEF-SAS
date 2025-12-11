import Order from "../models/Order.model.js";

export default class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async getAll() {
    return await Order.find().sort({ createdAt: -1 });
  }

  async getById(id) {
    return await Order.findById(id);
  }
}
