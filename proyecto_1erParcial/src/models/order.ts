import { Document, Schema, Types, model } from "mongoose";
import { User } from "./user";

// Definición de la interfaz para los productos en la orden
interface IOrderProduct {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document { // Definición de la interfaz de la orden
    _id: Types.ObjectId;
    userId: string; // Referencia al usuario que realizó la orden
    total: number; // Total de la orden
    subtotal: number;
    status: string; // Estado de la orden (pendiente, completada, cancelada, etc.)
    createDate: Date;
    updateDate: Date;
    products: IOrderProduct[]; // Productos en la orden 
}

// Esquema de producto en la orden
const orderProductSchema = new Schema<IOrderProduct>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de producto
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Cantidad mínima de 1
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Precio mínimo de 0
    }
}, { _id: false } );// No crear un _id para este subdocumento


const orderSchema = new Schema<IOrder>({
    userId: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    products: {
        type: [orderProductSchema], // Array de productos en la orden
        required: true,
        validate: [(array:string | any[]) => array.length > 0, 'La orden debe contener al menos un producto'], // Validación para asegurar que haya al menos un producto
    },
    createDate: {
        type: Date,
        default: Date.now, // Fecha de creación por defecto es la fecha actual
    },
    updateDate: {
        type: Date,
        default: Date.now, // Fecha de actualización por defecto es la fecha actual
    },
    status: {
        type: String,
    }
});

// Exportar el modelo
export const Order = model<IOrder>('Order', orderSchema, 'orders');
