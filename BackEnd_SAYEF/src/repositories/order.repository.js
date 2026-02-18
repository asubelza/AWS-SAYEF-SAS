import OrderDBManager from "../dao/orderDBManager.js";

export default class OrderRepository {
  constructor() {
    this.dao = new OrderDBManager();
  }

  create(data) {
    return this.dao.createOrder(data);
  }

  getAll() {
    return this.dao.getOrders();
  }

  getById(id) {
    return this.dao.getOrderById(id);
  }

  delete(id) {
    return this.dao.deleteOrder(id);
  }

  find(filter, sort) {
    return this.dao.findOrders(filter, sort);
  }

  findDuplicateRecentOrder(email, items, total) {
    return this.dao.findDuplicateRecentOrder(email, items, total);
  }
}
