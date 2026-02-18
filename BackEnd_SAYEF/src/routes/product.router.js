import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import uploader from "../utils/multerUtil.js";
import ProductController from "../controllers/product.controller.js";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../dao/models/product.model.js";

const router = Router();

const uploadExcel = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Límite de resultados
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenar por precio
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", ProductController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:pid", ProductController.getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear nuevo producto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - code
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 *       403:
 *         description: Acceso denegado
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  ProductController.create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       403:
 *         description: Acceso denegado
 */
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  ProductController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       403:
 *         description: Acceso denegado
 */
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  ProductController.delete
);

/**
 * @swagger
 * /api/products/import:
 *   post:
 *     summary: Importar productos desde Excel (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel (.xlsx)
 *     responses:
 *       200:
 *         description: Importación completada
 */
router.post(
  "/import",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploadExcel.single("file"),    // el campo se va a llamar "file" en el front
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ status: "error", message: "No se recibió ningún archivo" });
      }

      // Leer Excel desde el buffer
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      let created = 0;
      let updated = 0;

      for (const row of rows) {
        const code = row["CÓDIGO"]?.toString().trim();

        if (!code) continue;

        const offerRaw = row["Oferta"];
        const isOffer =
          offerRaw &&
          offerRaw.toString().trim().toLowerCase().startsWith("s");

        const productData = {
          title: row["NOMBRE"],
          description: row["Descripcion"],
          code,
          price: Number(row["PRECIO"]) || 0,
          stock: Number(row["Stock"]) || 0,
          category: row["Categoria"],
          offer: isOffer,
        };

        const result = await Product.updateOne(
          { code },
          { $set: productData },
          { upsert: true }
        );

        if (result.upsertedCount && result.upsertedCount > 0) {
          created++;
        } else if (result.modifiedCount && result.modifiedCount > 0) {
          updated++;
        }
      }

      return res.json({
        status: "success",
        message: "Importación finalizada",
        created,
        updated,
      });
    } catch (error) {
      next(error);
    }
  }
);




export default router;










