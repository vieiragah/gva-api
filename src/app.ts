import { Server } from './core';
import user from './core/routes/users.routes';
const server = new Server();

server.start(3000, user);
