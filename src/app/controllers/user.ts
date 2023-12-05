import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from '../../infra';
import jwt from 'jsonwebtoken';
export class User {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, office } = req.body;

    if (password.length < 6) {
      return res.status(400).json('Senha deve conter no mínimo 6 caracteres.');
    }
    const existingEmail = await Prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res.status(400).json('E-mail já cadastrado.');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = await Prisma.users.create({
      data: {
        email,
        name,
        password: hashPassword,
        office,
      },
    });
    return res.status(200).json(createUser);
  }
  async readAll(_req: Request, res: Response) {
    try {
      const users = await Prisma.users.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  }
  async read(req: Request, res: Response) {
    const { id } = req.query as { id: string };
    const findUser = await Prisma.users.findFirst({
      where: {
        id,
      },
    });
    if (!findUser) {
      return res.status(404).json('Usuário não encontrado');
    }
    res.status(200).json(findUser);
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.query as { id: string };
    const { email, password, name } = req.body as {
      name: string;
      password: string;
      email: string;
    };
    const findUser = await Prisma.users.findFirst({
      where: {
        id,
      },
    });
    if (!findUser) {
      return res.status(400).json('Usuário não encontrado.');
    }
    const updateUser = await Prisma.users.update({
      where: {
        id: findUser.id,
      },
      data: {
        email: email ?? undefined,
        name: name ?? undefined,
        password: password ?? undefined,
      },
    });
    return res.status(200).json(updateUser);
  }
  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.query as { id: string };
    try {
      const deleteUser = await Prisma.users.delete({
        where: {
          id,
        },
      });
      return res.status(200).json(deleteUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Erro ao excluir usuário');
    }
  }
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json('Insira e-mail e senha.');
    }

    const user = await Prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json('Usuário não encontrado');
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json('Senha incorreta.');
    }

    try {
      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error('Chave secreta não configurada.');
      }

      const token = jwt.sign(
        {
          id: user.id,
        },
        secret,
      );

      return res.status(200).json({ user, token });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json('Algo deu errado, tente novamente mais tarde.');
    }
  }

  async checkToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json('Acesso negado!');
    }
    try {
      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error('A chave secreta não está configurada.');
      }
      jwt.verify(token, secret);
      next();
      return res.status(200).json('Autenticado com sucesso.');
    } catch (error) {
      return res
        .status(500)
        .json('Algo deu errado, tente novamente mais tarde');
    }
  }
}
