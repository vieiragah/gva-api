import { connectDatabase } from '../infra';
import express, { Express, Router, json } from 'express';

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
  public start(port: number, routes: Router) {
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
