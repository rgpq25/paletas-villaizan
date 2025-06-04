export { PrismaClient } from "../generated/prisma";
export * from "../generated/prisma";

export type JwtPayload = {
	sub: string;
};
