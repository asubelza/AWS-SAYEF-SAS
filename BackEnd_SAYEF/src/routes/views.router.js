import { Router } from 'express';
import ProductDBManager from '../dao/productDBManager.js'; // cambio a default export
import CartDBManager from '../dao/cartDBManager.js';       // cambio a default export

const router = Router();
const ProductService = new ProductDBManager();
const CartService = new CartDBManager(ProductService);

router.get('/products', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts(req.query);
    res.render('index', {
      title: 'Mangas Store - Productos',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(products.docs)),
      prevLink: {
        exist: Boolean(products.prevLink),
        link: products.prevLink
      },
      nextLink: {
        exist: Boolean(products.nextLink),
        link: products.nextLink
      }
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los productos',
      style: 'index.css'
    });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts(req.query);
    res.render('realTimeProducts', {
      title: 'Mangas Store - Productos en Tiempo Real',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(products.docs))
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Error al cargar los productos',
      style: 'index.css'
    });
  }
});

router.get('/cart/:cid', async (req, res) => {
  try {
    const response = await CartService.getProductsFromCartByID(req.params.cid);

    res.render('cart', {
      title: 'Mangas Store - Carrito',
      style: 'index.css',
      products: JSON.parse(JSON.stringify(response.products)),
      cartId: req.params.cid
    });
  } catch (error) {
    res.status(404).render('notFound', {
      title: 'Carrito no encontrado',
      style: 'index.css'
    });
  }
});

export default router;
