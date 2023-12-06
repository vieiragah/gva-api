import { Request, Response } from 'express';
import { Prisma } from '../../infra';

export class Sector {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, quantity, users } = req.body;
    try {
      const createSector = await Prisma.sectors.create({
        data: {
          name,
          quantity,
          users: Array.isArray(users)
            ? { connect: users.map((userId: string) => ({ id: userId })) }
            : undefined,
        },
      });
      return res.status(200).json(createSector);
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .json('Algo deu errado, tente novamente mais tarde');
    }
  }

  async readAll(_req: Request, res: Response) {
    try {
      const sector = await Prisma.sectors.findMany({
        include: {
          users: true,
        },
      });
      res.status(200).json(sector);
    } catch (error) {
      return res.status(404).json('Não foi possível encontrar o setor.');
    }
  }
}
