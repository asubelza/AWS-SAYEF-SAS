import Product from "./models/product.model.js";

export default class ProductDAO {
  async getById(id) {
    return Product.findById(id);
  }

  async getAll(filter = {}, options = {}) {
    return Product.find(filter, null, options);
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

