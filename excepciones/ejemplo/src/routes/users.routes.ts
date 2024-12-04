// src/routes/users.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponseBuilder } from '../types/api-response';
import { NotFoundException } from '../exceptions/not-found.exception';
import { BadRequestException } from '../exceptions/bad-request.exception';
import { User } from '../types/user';

// Simulación de base de datos en memoria
const users: Map<string, User> = new Map();

const router = Router();

// GET - Obtener usuario por ID
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = users.get(userId);

    if (!user) {
      throw new NotFoundException(`Usuario ${userId} no encontrado`);
    }

    const response = new ApiResponseBuilder<User>(req.traceId)
      .setStatus(200)
      .setCode('USER_FOUND')
      .setMessage('Usuario encontrado exitosamente')
      .setData(user)
      .build();

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET - Listar todos los usuarios
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userList = Array.from(users.values());

    const response = new ApiResponseBuilder<User[]>(req.traceId)
      .setStatus(200)
      .setCode('USERS_FOUND')
      .setMessage('Usuarios recuperados exitosamente')
      .setData(userList)
      .build();

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST - Crear nuevo usuario
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      throw new BadRequestException('Email y nombre son requeridos', {
        missing_fields: ['email', 'name'].filter(field => !req.body[field])
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Formato de email inválido');
    }

    // Verificar si el email ya existe
    const emailExists = Array.from(users.values()).some(user => user.email === email);
    if (emailExists) {
      throw new BadRequestException('El email ya está registrado');
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date()
    };

    users.set(newUser.id, newUser);

    const response = new ApiResponseBuilder<User>(req.traceId)
      .setStatus(201)
      .setCode('USER_CREATED')
      .setMessage('Usuario creado exitosamente')
      .setData(newUser)
      .build();

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar usuario
router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const existingUser = users.get(userId);

    if (!existingUser) {
      throw new NotFoundException(`Usuario ${userId} no encontrado`);
    }

    const { email, name } = req.body;

    if (!email && !name) {
      throw new BadRequestException('Se requiere al menos un campo para actualizar');
    }

    // Validar formato de email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Formato de email inválido');
      }

      // Verificar si el nuevo email ya existe en otro usuario
      const emailExists = Array.from(users.values()).some(
        user => user.email === email && user.id !== userId
      );
      if (emailExists) {
        throw new BadRequestException('El email ya está registrado');
      }
    }

    const updatedUser: User = {
      ...existingUser,
      name: name || existingUser.name,
      email: email || existingUser.email
    };

    users.set(userId, updatedUser);

    const response = new ApiResponseBuilder<User>(req.traceId)
      .setStatus(200)
      .setCode('USER_UPDATED')
      .setMessage('Usuario actualizado exitosamente')
      .setData(updatedUser)
      .build();

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar usuario
router.delete('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const exists = users.has(userId);

    if (!exists) {
      throw new NotFoundException(`Usuario ${userId} no encontrado`);
    }

    users.delete(userId);

    const response = new ApiResponseBuilder<void>(req.traceId)
      .setStatus(200)
      .setCode('USER_DELETED')
      .setMessage('Usuario eliminado exitosamente')
      .build();

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;