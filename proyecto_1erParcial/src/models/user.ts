//Definir prpiedades de usuario (colección de usuarios)
import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document { // Definición de la interfaz del usuario
    name: string;
    email: string;
    password: string;
    role: string;
    _id: Types.ObjectId; //Ids de mongo no son autoincrementables, son ObjectId
    phone: string;
    createDate: Date;
    deleteDate: Date;
    status: boolean;
}

//Generar esquema de usuario
const UserSchema = new Schema<IUser>({
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    password: { 
        type: String, 
        required: true
    },
    role: { 
        type: String,
        default: "user" // Default role es user
    }, 
    phone: { 
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now 
    },
    deleteDate: { 
        type: Date,
        default: null
    }, 
    status: {
        type: Boolean,
        default: true
    } // Activo por default
});

//Exportar constante de modelo de usuario
export const User= model<IUser>('User', UserSchema, 'user'); // 'users' es el nombre de la colección en MongoDB
