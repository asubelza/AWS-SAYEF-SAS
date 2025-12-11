import OrderDBManager from "../dao/orderDBManager.js";

class OrderService {
  constructor() {
    this.repository = new OrderDBManager();
  }

  getOrders() {
    return this.repository.getOrders();
  }

  getOrderById(id) {
    return this.repository.getOrderById(id);
  }

  createOrder(data) {
    return this.repository.createOrder(data);
  }

  deleteOrder(id) {
    return this.repository.deleteOrder(id);
  }

  // 🆕
  getOrdersForUser(userId, email) {
    return this.repository.getOrdersForUser(userId, email);
  }
}

export default new OrderService();
