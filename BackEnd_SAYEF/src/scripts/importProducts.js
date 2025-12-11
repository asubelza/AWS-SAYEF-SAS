// src/scripts/importProducts.js
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Product from "../dao/models/product.model.js"; // ajustá el path según tu proyecto

dotenv.config();

// Emular __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo Excel
const filePath = path.resolve(__dirname, "../../data/productos_sayef.xlsx");

async function importExcel() {
  try {
    console.log("Conectando a Mongo...");
    await mongoose.connect(process.env.MONGO_URL); // usa la misma URL que tu backend

    console.log("Leyendo archivo:", filePath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Filas encontradas en Excel: ${rows.length}`);

    for (const row of rows) {
      const offerRaw = row["Oferta"];
      const isOffer =
        offerRaw &&
        offerRaw.toString().trim().toLowerCase().startsWith("s"); // "si", "sí", etc.

      await Product.create({
        title: row["NOMBRE"],
        description: row["Descripcion"],
        code: row["CÓDIGO"]?.toString().trim(),
        price: Number(row["PRECIO"]) || 0,
        stock: Number(row["Stock"]) || 0,
        category: row["Categoria"],
        offer: isOffer,
      });
    }

    console.log("✅ Productos importados correctamente");
  } catch (error) {
    console.error("❌ Error importando productos:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

importExcel();
