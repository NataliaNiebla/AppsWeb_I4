import { Document, Schema, Types, model } from "mongoose";
import { User } from "./user";

export interface IOrder extends Document { // Definición de la interfaz de la orden
    _id: Types.ObjectId;
    creationDate: Date;
    fkUser: Types.ObjectId;
    total: number;
    subtotal: number;
}

// Esquema de la orden
const orderSchema = new Schema<IOrder>({
    creationDate: {
        type: Date,
        default: Date.now,
    },
    fkUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});

// Exportar el modelo
export const Order = model<IOrder>('Order', orderSchema, 'orders');