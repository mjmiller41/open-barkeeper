import { Link } from "react-router";

export function TermsPage() {
	return (
		<div className="mx-auto max-w-3xl py-12">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Terms of Service</h1>

			<div className="prose prose-sm dark:prose-invert">
				<p>Last updated: December 13, 2025</p>

				<h2>1. Acceptance of Terms</h2>
				<p>
					By accessing and using Open Barkeeper ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
				</p>

				<h2>2. Use License</h2>
				<p>
					Permission is granted to temporarily download one copy of the materials (information or software) on Open Barkeeper's website for personal, non-commercial transitory viewing only.
				</p>

				<h2>3. Disclaimer</h2>
				<p>
					The materials on Open Barkeeper's website are provided on an 'as is' basis. Open Barkeeper makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
				</p>
				<p>
					Drink responsibly. The content provided is for informational purposes only.
				</p>

				<h2>4. Limitations</h2>
				<p>
					In no event shall Open Barkeeper or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Open Barkeeper's website.
				</p>

				<h2>5. Governing Law</h2>
				<p>
					These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
				</p>

				<div className="mt-8 not-prose">
					<Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">
						&larr; Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
