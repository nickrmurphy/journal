import { z } from "zod";

export const UserSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	name: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const UpdateUserSchema = UserSchema.partial().omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});
