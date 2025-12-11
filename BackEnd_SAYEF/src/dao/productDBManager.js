// src/dao/productDBManager.js
import productModel from "./models/product.model.js";

class ProductDBManager {

  // ⚠️ AHORA SIN PAGINACIÓN, SIN LIMIT, SOLO FIND
  async getAllProducts(params = {}) {
    const filter = {};

    // si en algún momento querés filtrar desde el backend:
    if (params.category) {
      filter.category = params.category;
    }
    if (
      params.offer === "true" ||
      params.offer === true ||
      params.offer === 1 ||
      params.offer === "1"
    ) {
      filter.offer = true;
    }

    const products = await productModel.find(filter).lean();
    return products;
  }

  async getProductByID(pid) {
    const product = await productModel.findOne({ _id: pid });

    if (!product) throw new Error(`El producto ${pid} no existe!`);

    return product;
  }

  async createProduct(product) {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      offer,
    } = product;

    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Error al crear el producto");
    }

    return await productModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      offer: !!offer,
    });
  }

  async updateProduct(pid, productUpdate) {
    return await productModel.updateOne({ _id: pid }, productUpdate);
  }

  async deleteProduct(pid) {
    const result = await productModel.deleteOne({ _id: pid });

    if (result.deletedCount === 0)
      throw new Error(`El producto ${pid} no existe!`);

    return result;
  }
}

export default ProductDBManager;
