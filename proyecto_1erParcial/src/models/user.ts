//Definir prpiedades de usuario (colección de usuarios)
import { Schema, model, Document, Types } from 'mongoose';

export interface IRole {  // Mod- Definir tipo de rol
    type: string; 
}

export interface IUser extends Document { // Definición de la interfaz del usuario
    name: string;
    email: string;
    password: string;
    role: IRole[]; // Mod- Cambiado a IRole[] para reflejar que es un arreglo de roles
    _id: Types.ObjectId; //Ids de mongo no son autoincrementables, son ObjectId
    phone: string;
    createDate: Date;
    deleteDate: Date;
    status: boolean;
}
// Mod- Definir esquema de rol
const roleSchema = new Schema<IRole>({
    type: {
        type: String,
        required: true,
        },
    },
    { _id: false }
);

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
    role: {  // Mod- Cambiado a IRole[] para reflejar que es un arreglo de roles
        type: [roleSchema], // Arreglo de strings
        required: true,
        default: [{type:"user"}], // Rol por defecto
        validate: [
        {
            validator:(array: any[]) => array.length > 0, // Validación para asegurar que el arreglo no esté vacío
            message: 'El usuario debe tener al menos un rol.',
        },
    ],
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
