import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recipesPath = path.join(__dirname, 'user_recipes.json');
const outputDir = path.join(__dirname, 'src', 'recipes');
const imagesDir = path.join(__dirname, 'public', 'img', 'recipes');

// Ensure directories exist
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

const downloadImage = (url, filepath) => {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			if (res.statusCode === 200) {
				res.pipe(fs.createWriteStream(filepath))
					.on('error', reject)
					.once('close', () => resolve(filepath));
			} else {
				res.resume();
				reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
			}
		});
	});
};

const processRecipes = async () => {
	for (const recipe of recipes) {
		// Generate new slug/filename
		const slug = recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		const imageExt = path.extname(recipe.image.split('?')[0]) || '.jpg';
		const imageName = `${slug}${imageExt}`;
		const imagePath = path.join(imagesDir, imageName);

		console.log(`Processing: ${recipe.name} -> ${slug}`);

		try {
			await downloadImage(recipe.image, imagePath);
			console.log(`  Downloaded image: ${imageName}`);
		} catch (error) {
			console.error(`  Failed to download image for ${recipe.name}: ${error.message}`);
			// Fallback: keep original URL if download fails? Or just use the local name knowing it might be broken?
			// For now, let's use the local name and log the error.
		}

		const newRecipe = {
			name: recipe.name,
			description: recipe.description,
			github: "mjmiller41",
			ingredients: recipe.ingredients,
			directions: recipe.directions,
			image: imageName,
			keywords: recipe.keywords,
		};

		const jsonPath = path.join(outputDir, `${slug}.json`);
		fs.writeFileSync(jsonPath, JSON.stringify(newRecipe, null, 4));
		console.log(`  Created JSON: ${slug}.json`);
	}
};

processRecipes();
