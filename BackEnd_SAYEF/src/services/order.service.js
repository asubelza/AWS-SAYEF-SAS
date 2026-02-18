import OrderRepository from "../repositories/order.repository.js";

class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  async createOrder(data) {
    return this.repository.create(data);
  }

  async getOrders() {
    return this.repository.getAll();
  }

  async getOrderById(id) {
    return this.repository.getById(id);
  }

  async deleteOrder(id) {
    return this.repository.delete(id);
  }

  // ✅ Mis órdenes por userId/email
  async getOrdersForUser(userId, email) {
    const filter = {};
    if (userId) filter.user = userId;
    else if (email) filter["buyer.email"] = email;
    else return [];

    return this.repository.find(filter, { createdAt: -1 });
  }

  // ✅ Anti-duplicado (tu método actual)
  async findDuplicateRecentOrder(email, items, total) {
    return this.repository.findDuplicateRecentOrder(email, items, total);
  }

  // ✅ Cancelación segura
  async cancelOrder(oid, { userId, role }) {
    const order = await this.repository.getById(oid);
    if (!order) throw new Error("Orden no encontrada");

    const isOwner = userId && order.user && order.user.toString() === userId.toString();
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      const err = new Error("No tenés permisos para cancelar esta orden");
      err.statusCode = 403;
      throw err;
    }

    if (order.status !== "pending") {
      const err = new Error(`La orden no se puede cancelar (estado: ${order.status})`);
      err.statusCode = 400;
      throw err;
    }

    order.status = "cancelled";
    await order.save();

    return order;
  }
}

export default new OrderService();
