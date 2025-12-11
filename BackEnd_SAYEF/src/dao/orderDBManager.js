import Order from "./models/order.model.js";

class OrderDBManager {
  async getOrders() {
    return Order.find().lean();
  }

  async getOrderById(id) {
    return Order.findById(id).lean();
  }

  async createOrder(data) {
    return Order.create(data);
  }

  async deleteOrder(id) {
    return Order.findByIdAndDelete(id);
  }

  // 🆕 Órdenes asociadas a un user o a su email
  async getOrdersForUser(userId, email) {
    const query = {
      $or: [
        ...(userId ? [{ user: userId }] : []),
        ...(email ? [{ "buyer.email": email }] : []),
      ],
    };

    return Order.find(query).sort({ createdAt: -1 }).lean();
  }
}

export default OrderDBManager;
