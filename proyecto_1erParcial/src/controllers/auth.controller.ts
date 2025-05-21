import { request, response } from "express";
import NodeCache from "node-cache";
import { generateAccessToken } from "../utils/generateToken";

 //Inicializa el caché de Node
const cache= new NodeCache();

export const login=(req=request, res=response)=>{
    const { username, password } = req.body;

    // Simulate user authentication
    if (username!=="admin" || password!=="1234") {
    return res.status(401).json({ message: "Invalid credentials" });
    }

    const userId="123456";
    const accessToken = generateAccessToken(userId);

    //Agregar Token
    cache.set(userId, accessToken, 60*15);
    res.json({accessToken});
};