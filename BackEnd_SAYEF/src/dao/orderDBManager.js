import Order from "./models/order.model.js";

export default class OrderDBManager {
  createOrder(data) {
    return Order.create(data);
  }

  getOrders() {
    return Order.find().sort({ createdAt: -1 });
  }

  getOrderById(id) {
    return Order.findById(id);
  }

  deleteOrder(id) {
    return Order.deleteOne({ _id: id });
  }

  findOrders(filter = {}, sort = { createdAt: -1 }) {
    return Order.find(filter).sort(sort);
  }

  // anti-duplicado (60s)
  findDuplicateRecentOrder(email, items, total) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    return Order.findOne({
      "buyer.email": email,
      total,
      createdAt: { $gte: oneMinuteAgo },
      "items.0": { $exists: true },
    });
  }
}
