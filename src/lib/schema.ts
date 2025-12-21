import { z } from 'zod';

export const IngredientSchema = z.object({
  quantity: z.string(),
  measure: z.string().optional(),
  ingredient: z.string(),
});

export const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  github: z.string().optional(),
  ingredients: z.array(IngredientSchema),
  directions: z.array(z.string()),
  image: z.string(),
  source: z.string().optional(),
  keywords: z.array(z.string()),
});

export type Recipe = z.infer<typeof RecipeSchema>;
