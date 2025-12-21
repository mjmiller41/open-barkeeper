import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { RecipeCard } from './recipe-card';
import { Recipe } from '@/lib/recipes';

// Mock the useRecipes hook
vi.mock('@/providers/recipe-provider', () => ({
	useRecipes: () => ({
		favorites: new Set(),
		toggleFavorite: vi.fn(),
	}),
}));

const mockRecipe: Recipe = {
	name: 'Test Cocktail',
	slug: 'test-cocktail',
	description: 'A delicious test drink.',
	github: 'tester',
	ingredients: [],
	directions: [],
	image: 'test.jpg',
	keywords: ['test', 'yummy'],
};

describe('RecipeCard', () => {
	it('renders recipe name and description', () => {
		render(
			<MemoryRouter>
				<RecipeCard recipe={mockRecipe} />
			</MemoryRouter>
		);

		expect(screen.getByText('Test Cocktail')).toBeInTheDocument();
		expect(screen.getByText('A delicious test drink.')).toBeInTheDocument();
	});

	it('renders keywords (limit to 3)', () => {
		render(
			<MemoryRouter>
				<RecipeCard recipe={mockRecipe} />
			</MemoryRouter>
		);

		expect(screen.getByText('test')).toBeInTheDocument();
		expect(screen.getByText('yummy')).toBeInTheDocument();
	});

	it('links to the correct recipe page', () => {
		render(
			<MemoryRouter>
				<RecipeCard recipe={mockRecipe} />
			</MemoryRouter>
		);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/recipes/test-cocktail');
	});

	it('has accessible image', () => {
		render(
			<MemoryRouter>
				<RecipeCard recipe={mockRecipe} />
			</MemoryRouter>
		);

		const img = screen.getByAltText('Test Cocktail');
		expect(img).toBeInTheDocument();
	});
});
