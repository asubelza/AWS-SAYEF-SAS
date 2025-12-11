import CartModel from "./models/cart.model.js";

export default class CartDBManager {

    constructor(productDBManager) {
        this.productDBManager = productDBManager;
    }

    async getCart(cid) {
        const cart = await CartModel.findOne({ _id: cid }).populate('products.product');
        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        return cart;
    }

    async createCart() {
        return await CartModel.create({ products: [] });
    }

    async addProductToCart(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await this.getCart(cid);

        let i = null;
        const result = cart.products.filter((item, index) => {
            if (item.product.toString() === pid) i = index;
            return item.product.toString() === pid;
        });

        if (result.length > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await CartModel.updateOne({ _id: cid }, { products: cart.products });
        return await this.getCart(cid);
    }

    async removeProductFromCart(cid, pid) {
        const cart = await this.getCart(cid);

        const newProducts = cart.products.filter(item => item.product.toString() !== pid);
        await CartModel.updateOne({ _id: cid }, { products: newProducts });

        return await this.getCart(cid);
    }

    async clearCart(cid) {
        await CartModel.updateOne({ _id: cid }, { products: [] });
        return await this.getCart(cid);
    }

    async updateQuantity(cid, pid, quantity) {
        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        const cart = await this.getCart(cid);
        let i = null;
        const result = cart.products.filter((item, index) => {
            if (item.product.toString() === pid) i = index;
            return item.product.toString() === pid;
        });

        if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        cart.products[i].quantity = parseInt(quantity);
        await CartModel.updateOne({ _id: cid }, { products: cart.products });
        return await this.getCart(cid);
    }
}
