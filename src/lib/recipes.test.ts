import { describe, it, expect } from 'vitest';
import { searchRecipes, searchRecipesFuzzy, searchRecipesAdvanced, Recipe } from './recipes';

const mockRecipes: Recipe[] = [
  {
    name: 'Mojito',
    slug: 'mojito',
    description: 'Fresh mint and lime.',
    github: 'user1',
    ingredients: [
      { quantity: '2', measure: 'oz', ingredient: 'White Rum' },
      { quantity: '1/2', measure: 'oz', ingredient: 'Fresh Lime Juice' },
      { quantity: '1', measure: 'tsp', ingredient: 'Sugar' },
      { quantity: '', measure: '', ingredient: 'Mint' },
      { quantity: '', measure: '', ingredient: 'Soda Water' },
    ],
    directions: ['Muddle mint', 'Add rum', 'Top with soda'],
    image: 'mojito.jpg',
    keywords: ['refreshing', 'summer', 'rum'],
  },
  {
    name: 'Old Fashioned',
    slug: 'old-fashioned',
    description: 'Classic whiskey cocktail.',
    github: 'user2',
    ingredients: [
      { quantity: '2', measure: 'oz', ingredient: 'Bourbon or Rye whiskey' },
      { quantity: '2', measure: 'dashes', ingredient: 'Angostura bitters' },
      { quantity: '1', measure: 'cube', ingredient: 'Sugar cube' },
    ],
    directions: ['Muddle sugar', 'Add whiskey', 'Stir'],
    image: 'old-fashioned.jpg',
    keywords: ['classic', 'whiskey', 'strong'],
  },
  {
    name: 'Gin and Tonic',
    slug: 'gin-and-tonic',
    description: 'Simple and crisp.',
    github: 'user3',
    ingredients: [
      { quantity: '2', measure: 'oz', ingredient: 'Gin' },
      { quantity: '4', measure: 'oz', ingredient: 'Tonic Water' },
    ],
    directions: ['Pour gin', 'Add tonic', 'Garnish with lime'],
    image: 'gin-tonic.jpg',
    keywords: ['gin', 'simple', 'bitter'],
  },
];

describe('Recipe Search Logic', () => {
  describe('searchRecipes (Simple)', () => {
    it('finds recipes by name (case insensitive)', () => {
      const results = searchRecipes(mockRecipes, 'mojito');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Mojito');
    });

    it('finds recipes by ingredient', () => {
      const results = searchRecipes(mockRecipes, 'bourbon');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Old Fashioned');
    });

    it('finds recipes by keyword', () => {
      const results = searchRecipes(mockRecipes, 'summer');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Mojito');
    });

    it('returns empty array for no matches', () => {
      const results = searchRecipes(mockRecipes, 'vodka');
      expect(results).toHaveLength(0);
    });
  });

  describe('searchRecipesAdvanced', () => {
    it('filters by name', () => {
        const results = searchRecipesAdvanced(mockRecipes, { name: 'old' });
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Old Fashioned');
    });

    it('filters by ingredients (must match all)', () => {
        const results = searchRecipesAdvanced(mockRecipes, { ingredients: ['Gin', 'Tonic'] });
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Gin and Tonic');
    });
    
    it('returns empty if one ingredient is missing', () => {
        const results = searchRecipesAdvanced(mockRecipes, { ingredients: ['Gin', 'Mint'] });
        expect(results).toHaveLength(0);
    });
  });

  describe('searchRecipesFuzzy', () => {
    it('performs fuzzy search on name', () => {
      // "Mojit" should match "Mojito"
      const results = searchRecipesFuzzy(mockRecipes, 'Mojit');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('Mojito');
    });

    it('filters results by ingredients after search', () => {
        // Search "refreshing" (keyword for Mojito), but filter for ingredient "Gin" (Mojito has Rum)
        // Should return nothing or Gin and Tonic if "refreshing" fuzzy matched it? 
        // Actually Mojito is 'refreshing'. Gin and Tonic is 'simple'.
        // Let's try searching for nothing (all) but filtering by ingredient.
        const results = searchRecipesFuzzy(mockRecipes, '', { ingredients: ['Whiskey'] });
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Old Fashioned');
    });
  });
});
