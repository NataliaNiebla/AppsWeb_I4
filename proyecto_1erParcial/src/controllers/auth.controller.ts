import { Request, Response } from "express";
import NodeCache from "node-cache";
import { generateAccessToken } from "../utils/generateToken";

//Inicializa el caché de Node
const cache = new NodeCache();

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  // Simulate user authentication
  if (email !== "admin@example.com" || password !== "1234") {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const userId = "123456";
  const accessToken = generateAccessToken(userId);

  //Agregar Token
  cache.set(userId, accessToken, 60 * 15);
  res.json({ accessToken });
};
