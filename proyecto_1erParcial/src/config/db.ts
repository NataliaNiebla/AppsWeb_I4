//conexón a BD
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    const mongoURL='mongodb+srv://natalia3141230020:NataliaNNR0906@cluster0.xaqahry.mongodb.net/'; // Cambia esto por tu URL de conexión a MongoDB
    try {
        await mongoose.connect(mongoURL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Termina el proceso si no se puede conectar
    }
}

export default connectDB;
