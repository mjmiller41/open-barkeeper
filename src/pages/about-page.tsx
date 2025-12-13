import { Link } from "react-router";

export function AboutPage() {
	return (
		<div className="mx-auto max-w-3xl py-12">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">About Open Barkeeper</h1>

			<div className="prose prose-lg dark:prose-invert">
				<p>
					Welcome to <strong>Open Barkeeper</strong>, your premier open-source destination for cocktail recipes and mixology management.
				</p>

				<h2>Our Mission</h2>
				<p>
					Open Barkeeper is dedicated to preserving the art of mixology through an open, community-driven platform.
					Our mission is to provide a free, accessible, and high-quality resource for cocktail enthusiasts, bartenders,
					and home mixologists to discover, share, and organize their favorite recipes.
				</p>

				<h2>Why Open Barkeeper?</h2>
				<ul>
					<li><strong>Open Source:</strong> We believe knowledge should be free. Our platform is built on transparency and community collaboration.</li>
					<li><strong>Curated Collection:</strong> From classic cocktails to modern innovations, our database is constantly growing.</li>
					<li><strong>Privacy Focused:</strong> We respect your data. Manage your personal recipe collection without intrusive tracking.</li>
				</ul>

				<h2>Join the Community</h2>
				<p>
					Whether you are looking to perfect your Old Fashioned or invent a new signature drink, Open Barkeeper is here to support your journey.
				</p>

				<div className="mt-8 not-prose">
					<Link to="/recipes" className="text-blue-600 hover:underline dark:text-blue-400">
						Explore Recipes &rarr;
					</Link>
				</div>
			</div>
		</div>
	);
}
