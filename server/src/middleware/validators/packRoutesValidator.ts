import { z } from 'zod';

export const getPacks = z.object({
  ownerId: z.string(),
  queryBy: z.string().optional(),
});

export const getPackById = z.object({
  packId: z.string(),
});

export const addPack = z.object({
  name: z.string(),
  owner_id: z.string(),
  is_public: z.boolean(),
});

export const editPack = z.object({
  id: z.string(),
  name: z.string(),
  is_public: z.boolean(),
});

export const deletePack = z.object({
  packId: z.string(),
});

export const duplicatePublicPack = z.object({
  packId: z.string(),
  ownerId: z.string(),
  items: z.array(z.string()),
});
