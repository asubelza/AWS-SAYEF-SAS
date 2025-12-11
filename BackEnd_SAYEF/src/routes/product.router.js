import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorization.js";
import uploader from "../utils/multerUtil.js"; // ✅ default import
import ProductController from "../controllers/product.controller.js";
import multer from "multer";
import XLSX from "xlsx";
import Product from "../dao/models/product.model.js"; // ajustá el path a tu modelo


const router = Router();

const uploadExcel = multer({ storage: multer.memoryStorage() });



// 🔹 Consultas públicas
router.get("/", ProductController.getAll);
router.get("/:pid", ProductController.getById);

// 🔹 Operaciones solo admins
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  ProductController.create
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  uploader.array("thumbnails", 3),
  ProductController.update
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorizeRoles("admin"),
  ProductController.delete
);

// 🔹 Importar productos desde Excel (solo admin)
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










