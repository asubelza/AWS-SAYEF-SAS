import { cartRepository, productRepository } from "../repositories/index.js";

class CartService {
  async addProductToCart(cartId, productId) {
    return await cartRepository.addProduct(cartId, productId);
  }

  async purchaseCart(cartId, purchaserEmail) {
    return await cartRepository.purchase(cartId, purchaserEmail);
  }
}

export default new CartService();

