import { Router } from 'express';
import { getAllUsers, getTimeToken, login, updateToken, saveUser, updateUser, deleteUser} from '../controllers/auth.controller';
import { get } from 'http';

// Import the login function from the controller
const router = Router();

router.post('/login', login); // POST /api/v1/auth/login
//router.post('/getTime', getTimeToken); // GET /api/v1/auth/getTimeToken
router.get('/getTime', getTimeToken);  // GET http://localhost:3000/api/v1/auth/getTime?userId=123456
router.patch('/updateToken/:userId', updateToken); // PATCH /api/v1/auth/updateToken/:userId

router.get('/get', getAllUsers); // Accesible desde /api/v1/auth/users

router.post('/users', saveUser); // Accesible desde /api/v1/auth/users 

router.put('/users/:userId', updateUser); // Accesible desde /api/v1/auth/users/:userId

router.delete('/users/:userId', deleteUser); // Accesible desde /api/v1/auth/users/:userId

export default router;
