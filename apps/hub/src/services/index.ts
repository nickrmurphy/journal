import { db } from "../db";
import { AuthService } from "./auth-service";
import { CollectionService } from "./collection-service";
import { UserService } from "./user-service";

export const userService = new UserService(db);
export const collectionService = new CollectionService(db);
export const authService = new AuthService(userService);
