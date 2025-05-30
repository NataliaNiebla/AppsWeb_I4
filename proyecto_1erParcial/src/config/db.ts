//conexón a BD
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoURL='mongodb://localhost:27017/ProyectoP1'; // Cambia esto por tu URL de conexión a MongoDB
    try {
        await mongoose.connect(mongoURL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Termina el proceso si no se puede conectar
    }
}

export default connectDB;