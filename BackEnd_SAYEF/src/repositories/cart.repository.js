import CartDBManager from "../dao/cartDBManager.js";

export default class CartRepository {
    constructor(productDAO) {
        this.dao = new CartDBManager(productDAO);
    }

    getCart = async (id) => await this.dao.getCart(id);

    createCart = async () => await this.dao.createCart();

    addProductToCart = async (cid, pid) => await this.dao.addProductToCart(cid, pid);

    removeProductFromCart = async (cid, pid) => await this.dao.removeProductFromCart(cid, pid);

    clearCart = async (cid) => await this.dao.clearCart(cid);

    updateQuantity = async (cid, pid, qty) => await this.dao.updateQuantity(cid, pid, qty);
}
