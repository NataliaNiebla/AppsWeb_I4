import { Request, request, Response, response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/user";
import bcrypt from "bcrypt";

// Endpoint Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
console.log(email)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "credenciales incorrectas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "credenciales incorrectas" });
        }

        const accessToken = generateAccessToken(user.id); // Generar access token

        cache.set(user.id, accessToken, 60 * 30); // 30 minutos de expiracion

        return res.json({  // Return success con token
            accessToken,
            user: {
                id: user.id,
                username: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

 //Endpoint getTimeToken
export const getTimeToken = (req: Request, res: Response) => {
    const { userId } = req.query; // Obtener el userId del query string

    if (typeof userId !== "string") {
        return res.status(400).json({ message: "Parámetro 'userId' es requerido y debe ser un string" });
    }

    const ttl = cache.getTtl(userId); // Tiempo de vida en milisegundos

    if (!ttl) {
        return res.status(404).json({ message: "Token no existe o ha expirado" });
    }

    const now = Date.now();
    const timeToLife = Math.floor((ttl - now) / 1000); // Segundos restantes
    const expTime = dayjs(ttl).format('HH:mm:ss'); // Hora exacta de expiración

    return res.json({
        timeToLife,
        expTime
    });
};

//Endpoint para actualizar el token
export const updateToken = (req:Request, res:Response) => {
    const { userId } = req.params;

    const ttl = cache.getTtl(userId);  // Verificar si el token existe en caché
    if (!ttl) {
        return res.status(404).json({ message: "Token no existe" });
    }

    // Generar nuevo token
    const newTimeTtl:number=60*15; // 15 minutos
    cache.ttl(userId, newTimeTtl); // Actualizar el tiempo de vida del token

    return res.json({ message: "Token actualizado" });
}

//Endpoint para Exportar
export const getAllUsers = async (req: Request, res: Response) => {
    const { userEmail } = req.query; // Obtener el userId del query string

    const userList = await User.find(); //find: encontrar todos los  registros
    //const userByEmail = await User.find({email: userEmail}); //find: encontrar por una caracterisitica
    const userByEmail = await User.find({status: true}); //find: encontrar por el status
    //const userById = await User.findById("123456"); //findById: encontrar por id

    console.log(userByEmail);
    return res.json({userList});
}

//Endpoint para guardar un usuario
export const saveUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        if (!name || !email || !password || !role || !phone) { // Validación de campos obligatorios
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ email }); // Validación de email
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        //Encriptación
        const saltRounds = 10; // Número de rondas de sal para bcrypt 
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Encriptar la contraseña con bcrypt 

        const newUser = new User({ // Crear un nuevo usuario
            name,
            email,
            password: hashedPassword, // Guardar la contraseña encriptada
            role,
            phone,
            createdAt: Date.now(), // Fecha de creación
            status: true // default, el usuario está activo
        });

        const user = await newUser.save(); // Guardar el usuario en la base de datos
        console.log("Usuario creado correctamente", user);
        return res.status(201).json
        ({ message: 'Usuario creado exitosamente',
            user });
        
            

    } catch (error) {
        console.log("Error en SaveUser:", error);
        return res.status(500).json({error})
    }
}

// Endpoint para actualizar un usuario
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { name, email, password, role, phone } = req.body;

        if (!name || !email || !password || !role || !phone) { // Validación de campos obligatorios
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const saltRounds = 10; // Encriptación de la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, password: hashedPassword, role, phone },
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.json({ message: 'Usuario actualizado exitosamente', updatedUser });

    } catch (error) {
        console.log("Error en UpdateUser:", error);
        return res.status(500).json({ error });
    }
}

// Endpoint para eliminar un usuario
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params; // Obtener el userId de los parámetros de la ruta

        const deletedUser = await User.findByIdAndDelete(userId);  // Buscar y eliminar el usuario

        if (!deletedUser) { // Si no se encuentra el usuario, retornar un error 404
            return res.status(404).json({ message: 'Usuario no encontrado' }); 
        }

        return res.json({ message: 'Usuario eliminado exitosamente', deletedUser }); // Retornar el usuario eliminado

    } catch (error) { // Manejo de errores
        console.log("Error en DeleteUser:", error);
        return res.status(500).json({ error }); // Retornar un error 500 en caso de fallo del servidor
    }
} 