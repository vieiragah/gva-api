import { connectDatabase } from '../infra';
import express, { Express, Router, json } from 'express';
import cors from 'cors';
export class Server {
  private readonly app: Express;
  constructor() {
    this.app = express();
  }
  private setMiddlewares() {
    this.app.use(json());
  }
  private setupRoutes(routes: Router) {
    this.app.use('/', routes);
  }
  private setCors() {
    this.app.use(cors());
  }
  public start(port: number, routes: Router) {
    this.setCors();
    this.setMiddlewares();
    this.setupRoutes(routes);
    connectDatabase()
      .then(() => {
        this.app.listen(port, () => {
          console.log(`listening on port: http://localhost:${port}`);
        });
      })
      .catch((error: string) => {
        console.log(error);
      });
  }
}
