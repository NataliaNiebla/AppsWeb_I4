import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder, addProductsToOrder} from '../controllers/order.controller';

// Importar rutas del controlador
const router = Router();
router.post ('/createOrder', createOrder); // POST /api/v1/orders/createOrder
//router.get('/getOrder', getOrders); // GET /api/v1/orders/getOrder
//router.get('/getOrderBy/:orderId', getOrderById); // GET /api/v1/orders/getOrderBy/:orderId
router.put('/updateOrder/:orderId', updateOrder); // PUT /api/v1/orders/updateOrder/:orderId
router.delete('/deleteOrder/:orderId', deleteOrder); // DELETE /api/v1/orders/deleteOrder/:orderId

router.put("/addProducts/:orderId", addProductsToOrder); // PUT /api/v1/orders/addProducts/:orderId

export default router;