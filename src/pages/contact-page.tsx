export function ContactPage() {
	return (
		<div className="mx-auto max-w-3xl py-12">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Contact Us</h1>

			<div className="prose prose-lg dark:prose-invert">
				<p>
					We value your feedback and are here to assist you with any questions or concerns regarding Open Barkeeper.
				</p>

				<h2>Get in Touch</h2>
				<p>
					For general inquiries, support, or recipe submissions, please email us at:
				</p>
				<p className="text-xl font-medium text-blue-600 dark:text-blue-400">
					<a href="mailto:support@openbarkeep.com">support@openbarkeep.com</a>
				</p>

				<p className="mt-8 text-sm text-gray-500">
					We aim to respond to all inquiries within 24-48 hours.
				</p>
			</div>
		</div>
	);
}
