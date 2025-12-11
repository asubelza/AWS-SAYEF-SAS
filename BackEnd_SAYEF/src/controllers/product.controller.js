// src/controllers/product.controller.js
import ProductService from "../services/product.service.js";

class ProductController {
  async getAll(req, res, next) {
    try {
      const { category, offer } = req.query;
      const filter = {};

      if (category) filter.category = category;

      if (
        offer === "true" ||
        offer === "1" ||
        offer === true
      ) {
        filter.offer = true;
      }

      const products = await ProductService.getAll(filter);

      return res.json({
        status: "success",
        payload: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.pid);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      return res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = { ...req.body };

      // thumbnails subidos
      if (req.files && req.files.length > 0) {
        data.thumbnails = req.files.map((file) => file.path);
      }

      // normalizar offer
      if (typeof data.offer !== "undefined") {
        data.offer =
          data.offer === "true" ||
          data.offer === "1" ||
          data.offer === true;
      }

      const product = await ProductService.create(data);

      return res.status(201).json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = { ...req.body };

      if (req.files && req.files.length > 0) {
        data.thumbnails = req.files.map((file) => file.path);
      }

      if (typeof data.offer !== "undefined") {
        data.offer =
          data.offer === "true" ||
          data.offer === "1" ||
          data.offer === true;
      }

      const product = await ProductService.update(req.params.pid, data);

      return res.json({
        status: "success",
        payload: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await ProductService.delete(req.params.pid);

      return res.json({
        status: "success",
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
