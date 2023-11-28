import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { Prisma } from '../../infra';

export class User {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, office } = req.body;

    if (password.lenght < 6) {
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
    const hashPassword = await hash(password, 10);
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
}
