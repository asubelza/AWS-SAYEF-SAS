// src/controllers/order.controller.js
import OrderService from "../services/order.service.js";
import UserService from "../services/user.service.js";

class OrderController {
  // ============================================================
  // 🧾 Crear orden
  // ============================================================
  async create(req, res, next) {
    try {
      const { buyer, items, total } = req.body;

      if (!buyer || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "Datos de orden incompletos",
        });
      }

      // ------------------------------------------------------------
      // 🔗 Intentamos vincular la orden a un usuario existente
      // ------------------------------------------------------------
      let userId = null;
      try {
        const user = await UserService.repository.getByEmail(buyer.email);
        if (user) userId = user._id;
      } catch (err) {
        console.error("⚠ No se pudo vincular usuario a la orden:", err);
      }

      // ------------------------------------------------------------
      // ⛔ Anti-duplicado: misma orden en los últimos 60 segundos
      // ------------------------------------------------------------
      const duplicate = await OrderService.findDuplicateRecentOrder(
        buyer.email,
        items,
        total
      );

      if (duplicate) {
        return res.status(400).json({
          status: "error",
          message:
            "Ya existe una orden reciente con los mismos datos. Espere unos segundos e intente nuevamente.",
        });
      }

      // ------------------------------------------------------------
      // 🏗 Armar payload de orden
      // ------------------------------------------------------------
      const orderPayload = {
        buyer,
        items: items.map((it) => ({
          productId: it.id || it._id || null,
          title: it.title,
          price: it.price,
          quantity: it.quantity,
          code: it.code || null,
        })),
        total,
        user: userId || null,
      };

      const order = await OrderService.createOrder(orderPayload);

      return res.status(201).json({
        status: "success",
        payload: order,
      });
    } catch (error) {
      console.error("❌ ERROR creando orden:", error);
      next(error);
    }
  }

  // ============================================================
  // 📄 Listar todas las órdenes (solo admin)
  // ============================================================
  async getAll(req, res, next) {
    try {
      const orders = await OrderService.getOrders();
      res.json({ status: "success", payload: orders });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // 🔍 Obtener orden por ID
  // ============================================================
  async getById(req, res, next) {
    try {
      const order = await OrderService.getOrderById(req.params.oid);
      res.json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // ❌ Cancelar una orden
  // ============================================================
  async cancel(req, res, next) {
    try {
      const { oid } = req.params;
      const order = await OrderService.cancelOrder(oid);
      res.json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // 🧹 Eliminar (solo admin)
  // ============================================================
  async delete(req, res, next) {
    try {
      const result = await OrderService.deleteOrder(req.params.oid);
      res.json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // 👤 Obtener órdenes por usuario (admin)
  // ============================================================
  async getByUser(req, res, next) {
    try {
      const userId = req.params.uid;
      const orders = await OrderService.getOrdersForUser(userId);
      res.json({ status: "success", payload: orders });
    } catch (error) {
      next(error);
    }
  }

  // ============================================================
  // 🙋‍♂️ Mis órdenes (perfil del usuario)
  // ============================================================
  async getMyOrders(req, res, next) {
    try {
      const userId = req.user?._id;
      const email = req.user?.email;

      if (!userId && !email) {
        return res.status(401).json({
          status: "error",
          message: "Usuario no autenticado",
        });
      }

      const orders = await OrderService.getOrdersForUser(userId, email);

      return res.json({
        status: "success",
        payload: orders,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
