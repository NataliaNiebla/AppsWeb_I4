import { Request, Response } from "express";
import { Order } from "../models/order";
import mongoose from "mongoose";

// Endpoint para crear orden
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, status, products } = req.body;

        // Validación de datos obligatorios
        if (!userId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Validación de userId (si se cambia a ObjectId en el modelo)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID de usuario inválido" });
        }

        // Validación de productos
        for (const item of products) {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                return res.status(400).json({ message: "ID de producto inválido" });
            }
            if (typeof item.quantity !== "number" || item.quantity < 1) {
                return res.status(400).json({ message: "La cantidad debe ser un número mayor o igual a 1" });
            }
            if (typeof item.price !== "number" || isNaN(item.price) || item.price < 0) {
                return res.status(400).json({ message: "El precio debe ser un número válido y no negativo" });
            }
        }

        // Cálculo del subtotal y procesamiento de productos
        let subtotal = 0;
        const processedProducts = products.map((item: any) => {
            const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price
            };
        });

        const iva = subtotal * 0.16;
        const total = subtotal + iva;

        // Creación de la orden
        const order = new Order({
            userId,
            status: status || "pendiente",
            products: processedProducts,
            subtotal,
            total
        });

        await order.save();
        return res.status(201).json({ message: "Orden realizada con exito", order }); // Asegura return para la respuesta de éxito

    } catch (error) {
        console.error("Error al crear la orden:", error);
        return res.status(500).json({ message: "Error en el servidor" }); // Asegura return en el catch
    }
};

// Endpoint para leer órdenes

// Endpoint para leer una orden por ID

// Endpoint para actualizar una orden, solo cambia el estado de una orden a "pagado"
export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID de orden inválido" });
        }

        if (!status || status !== "pagado") {
            return res.status(400).json({ message: 'Solo se permite cambiar el estado a "pagado"' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        order.status = "pagado";
        order.updateDate = new Date();

        await order.save();

        res.json({ message: "Orden pagada, actualización", order });
    } catch (error) {
        console.error("Error al actualizar el estado de la orden:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Endpoint para eliminar una orden por ID, solo cambia el estado de una orden a "cancelado"
export const deleteOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID de orden inválido" });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        order.status = "cancelada";
        order.updateDate = new Date();

        await order.save();

        res.json({ message: "Orden cancelada", order });
    } catch (error) {
        console.error("Error al cancelar la orden:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Endpoint para agregar productos a una orden
export const addProductsToOrder = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { products } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "ID de orden inválido" });
        }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Debes enviar un arreglo de productos" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Orden no encontrada" });
        }

        // Validación de productos y cálculo del subtotal adicional
        let addedSubtotal = 0;
        const newProducts = products.map((item: any) => {
            if (!mongoose.Types.ObjectId.isValid(item.productId)) {
                throw new Error("ID de producto inválido");
            }
            if (typeof item.quantity !== "number" || item.quantity < 1) {
                throw new Error("Cantidad inválida");
            }
            if (typeof item.price !== "number" || item.price < 0 || isNaN(item.price)) {
                throw new Error("Precio inválido");
            }

            const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
            const itemTotal = price * item.quantity;
            addedSubtotal += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price,
            };
        });

        // Agregar productos nuevos
        order.products.push(...newProducts);

        // Actualizar totales
        order.subtotal += addedSubtotal;
        const iva = order.subtotal * 0.16;
        order.total = order.subtotal + iva;
        order.updateDate = new Date();

        await order.save();

        res.json({ message: "Productos agregados a la orden", order });

    } catch (error) {
        console.error("Error al agregar productos a la orden:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: "Error en el servidor", error: errorMessage });
    }
};
 