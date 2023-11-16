// import { PrismaClient } from '@prisma/client';

// export class DatabaseInstance {
//   public prisma: PrismaClient;
//   private static instance: DatabaseInstance;
//   private constructor() {
//     this.prisma = new PrismaClient({
//       errorFormat: 'pretty',
//     });
//   }

//   public static getInstance = () => {
//     if (!DatabaseInstance.instance)
//       DatabaseInstance.instance = new DatabaseInstance();
//     return DatabaseInstance.instance;
//   };
// }

import { PrismaClient } from '@prisma/client';

export class DatabaseInstance {
  public prisma: PrismaClient;
  private static instance: DatabaseInstance;
  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance = () => {
    if (!DatabaseInstance.instance) {
      DatabaseInstance.instance = new DatabaseInstance();
    }
    return DatabaseInstance.instance;
  };
}

// export default DatabaseInstance;
