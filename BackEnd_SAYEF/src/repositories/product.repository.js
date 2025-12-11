import ProductDBManager from "../dao/productDBManager.js";

export default class ProductRepository {
  constructor() {
    this.dao = new ProductDBManager();
  }

  getAll(filters) {
    return this.dao.getAllProducts(filters);
  }

  getById(id) {
    return this.dao.getProductByID(id);
  }

  create(data) {
    return this.dao.createProduct(data);
  }

  update(id, data) {
    return this.dao.updateProduct(id, data);
  }

  delete(id) {
    return this.dao.deleteProduct(id);
  }
}
