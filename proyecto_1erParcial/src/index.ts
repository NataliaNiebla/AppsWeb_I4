import express from 'express'; // Importa el módulo 'express', que es un framework para crear servidores web y APIs en Node.js
import morgan from 'morgan'; // Importa 'morgan', un middleware que registra las solicitudes HTTP en la consola
import connectDB from './config/db';

// Importación comentada de las rutas de autenticación (se puede habilitar cuando exista el archivo correspondiente)
import authRoutes from './routes/auth.routes';
import { connect } from 'http2';

// Crea una instancia de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware que permite a Express interpretar JSON en las solicitudes entrantes
app.use(morgan('dev')); // Middleware que utiliza Morgan para registrar las solicitudes en el formato 'dev' (resumen legible)

app.use('/api/v1/auth', authRoutes); //Agregar la ruta '/api/auth'

connectDB().then (() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});