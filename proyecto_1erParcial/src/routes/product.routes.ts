import { Router } from 'express';
import {createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';

// Importar rutas del controlador
const router = Router();
router.post('/createProduct', createProduct); // POST /api/v1/products/createProduct
router.get('/getProducts', getProducts); // GET /api/v1/products/getProducts
router.get('/getProductBy/:productId', getProductById); // GET /api/v1/products/getProductBy/:productId     
router.put('/updateProduct/:productId', updateProduct); // PUT /api/v1/products/updateProduct/:productId
router.put('/deleteProduct/:productId', deleteProduct); // DELETE /api/v1/products/deleteProduct/:productId

export default router;