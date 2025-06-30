import express from 'express'; // Importa el módulo 'express', que es un framework para crear servidores web y APIs en Node.js
import morgan from 'morgan'; // Importa 'morgan', un middleware que registra las solicitudes HTTP en la consola
import connectDB from './config/db';
import cors from 'cors'; //mod- importación de cors para permitir solicitudes desde otros dominios

// Importación comentada de las rutas de autenticación (se puede habilitar cuando exista el archivo correspondiente)
import authRoutes from './routes/auth.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes'; 
import menuRoutes from './routes/menu.routes'; 
import { connect } from 'http2';

// Crea una instancia de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware que permite a Express interpretar JSON en las solicitudes entrantes
app.use(morgan('dev')); // Middleware que utiliza Morgan para registrar las solicitudes en el formato 'dev' (resumen legible)

app.use(cors()); // mod-Middleware que permite solicitudes CORS (Cross-Origin Resource Sharing), lo que permite que el servidor acepte solicitudes de diferentes dominios

/*app.use(cors((
  origin: 'http://localhost:5173', // mod-Especifica el origen permitido para las solicitudes CORS
  credentials: true, // mod- Permite el envío de cookies y encabezados de autenticación en solicitudes CORS
}))); // mod-Configura CORS para permitir solicitudes desde el cliente React en el puerto 5173*/

app.use('/api/v1/auth', authRoutes); //Agregar la ruta '/api/auth'
app.use('/api/v1/orders', orderRoutes); //Agregar la ruta '/api/orders'
app.use('/api/v1/products', productRoutes); //Agregar la ruta '/api/products'
app.use('/api/v1/menu', menuRoutes); //Agregar la ruta '/api/menu'

connectDB().then (() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});