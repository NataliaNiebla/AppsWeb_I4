import { Request, Response } from "express";
import { Product } from "../models/product";
import mongoose from "mongoose";

// Endpoint para crear un producto
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, quantity, price } = req.body;

        if (!name || !description || quantity == null || price == null) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newProduct = new Product({
            name,
            description,
            quantity,
            price
        });

        await newProduct.save();
        res.status(201).json({ message: "Producto creado", product: newProduct });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Endpoint para leer todos los productos
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Endpoint para leer un producto por ID
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        const product = await Product.findById(productId);

        if (!product || product.status === 'inactivo') {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
}

// Endpoint para actualizar un producto
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { name, description, quantity, price, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.quantity = quantity != null ? quantity : product.quantity;
        product.price = price != null ? price : product.price;
        product.status = status || product.status;

        await product.save();
        res.json({ product });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

// Endpoint para eliminar un producto (cambiar estado a inactivo)
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de producto inválido" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        product.status = 'inactivo';
        product.deleteDate = new Date();

        await product.save();
        res.json({ message: "Producto eliminado (inactivo)", product });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};





