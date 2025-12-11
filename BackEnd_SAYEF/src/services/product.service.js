// src/services/product.service.js
import ProductRepository from "../repositories/product.repository.js";

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async create(data) {
    return this.repository.create(data);
  }

  async getAll(filter = {}) {
    return this.repository.getAll(filter);
  }

  async getById(id) {
    return this.repository.getById(id);
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async delete(id) {
    return this.repository.delete(id);
  }
}

export default new ProductService();
