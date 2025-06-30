import { Router } from 'express';
import { getMenuItems, createMenuItem, deleteMenuItem, initializeMenuItems, getMenuItemsByRole } from '../controllers/menu.controller';

const router = Router();

initializeMenuItems(); // Inicializar ítems del menú

// Rutas
router.get('/getall', getMenuItems); // http://localhost:3000/api/v1/menu/getall
router.post('/update/:id', createMenuItem);
router.patch('/delete/:id', deleteMenuItem);
router.post('/byrole', getMenuItemsByRole); // http://localhost:3000/api/v1/menu/byrole

export default router;