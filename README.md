# Open Barkeeper

Open Barkeeper is an open-source cocktail recipe application built with modern web technologies.

> **Inspiration Credit**: This project is inspired by [OpenDrinks](https://github.com/alfg/opendrinks) and includes all recipes contained in that repository.

## Features

- 🍹 **Extensive Recipe Collection**: Browse hundreds of cocktail recipes.
- 🔍 **Search & Filter**: Find recipes by name, ingredients, or keywords.
- 📱 **PWA Support**: Install as an app and use offline.
- ⚡ **Modern Stack**: Built for speed and performance.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mjmiller41/open-barkeeper.git
    ```
2. Navigate to the project directory:
    ```bash
    cd open-barkeeper
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### Adding a New Recipe

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingRecipe`)
3. **Add Recipe Data**:
    - Create a new JSON file in `src/recipes/`.
    - The file format should be:
        ```json
        {
            "name": "Drink Name",
            "description": "A brief description of the drink.",
            "github": "your-github-username",
            "ingredients": [
                {
                    "quantity": "45",
                    "measure": "ml",
                    "ingredient": "Gin"
                }
            ],
            "directions": ["Step 1", "Step 2"],
            "image": "drink-name.jpg",
            "keywords": ["tag1", "tag2"]
        }
        ```
4. **Add Recipe Image**:
    - Add a high-quality image of the drink to `public/img/recipes/`.
    - Ensure the filename matches the `image` field in your JSON file.
5. **Commit your Changes** (`git commit -m 'Add some AmazingRecipe'`)
6. **Push to the Branch** (`git push origin feature/AmazingRecipe`)
7. **Open a Pull Request**

## License

Distributed under the MIT License. See `LICENSE` for more information.
