import { Request, Response } from 'express';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { DatabaseInstance } from '../../infra';

export class User {
  protected readonly database: PrismaClient;
  constructor() {
    this.database = DatabaseInstance.getInstance().prisma;
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const existingEmail = await this.database.users.findFirst({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res.status(400).json('E-mail já cadastrado.');
    }
    const hashPassword = await hash(password, 10);
    const createUser = await this.database.users.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });
    return res.status(200).json(createUser);
  }
  async readAll(_req: Request, res: Response) {
    try {
      const users = await this.database.users.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  }
  async read(req: Request, res: Response) {
    const { id } = req.query as { id: string };
    const findUser = await this.database.users.findFirst({
      where: {
        id,
      },
    });
    if (!findUser) {
      return res.status(404).json('Usuário não encontrado');
    }
  }
  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.query as { id: string };
    const { email, password, name } = req.body as {
      name: string;
      password: string;
      email: string;
    };
    const findUser = await this.database.users.findFirst({
      where: {
        id,
      },
    });
    if (!findUser) {
      return res.status(400).json('Usuário não encontrado.');
    }
    const updateUser = await this.database.users.update({
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
  async delete() {}
}
