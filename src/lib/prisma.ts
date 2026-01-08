import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal || prismaClientSingleton();

export default prisma;

// This is a singleton pattern for Prisma Client. It ensures that there is only one instance of Prisma Client in the application. This is important because Prisma Client is not designed to be instantiated multiple times in the same process. The singleton pattern ensures that there is only one instance of Prisma Client in the application, which helps to avoid issues related to resource consumption and connection pooling.
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prisma;
