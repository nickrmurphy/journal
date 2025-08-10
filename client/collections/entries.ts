import { createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import z from "zod";

const entrySchema = z.object({
    id: z.uuid().optional().default(() => crypto.randomUUID()),
    content: z.string().min(1),
    createdAt: z.iso.datetime().optional().default(() => new Date().toISOString()),
})

export type Entry = z.infer<typeof entrySchema>;

export const entryCollection = createCollection(
    localStorageCollectionOptions({
        storageKey: "entries",
        getKey: (entry) => entry.id,
        schema: entrySchema,
    })
);
