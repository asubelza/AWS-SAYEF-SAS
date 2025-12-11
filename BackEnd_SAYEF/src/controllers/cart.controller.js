import cartService from "../services/cart.service.js";
import ticketService from "../services/ticket.service.js";

class CartController {
  async addProduct(req, res, next) {
    try {
      const { cid, pid } = req.params;
      const result = await cartService.addProductToCart(cid, pid);
      res.json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  }

  async purchase(req, res, next) {
    try {
      const { cid } = req.params;
      const purchaserEmail = req.user.email;

      const {
        totalAmount,
        purchasedProducts,
        unprocessedProductIds,
        remainingProducts
      } = await cartService.purchaseCart(cid, purchaserEmail);

      // Crear ticket usando Repository → Service
      const ticket = await ticketService.createTicket(totalAmount, purchaserEmail);

      res.json({
        status: "success",
        message: "Compra finalizada correctamente",
        ticket,
        purchasedProducts,
        unprocessedProductIds,
        remainingProducts
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
