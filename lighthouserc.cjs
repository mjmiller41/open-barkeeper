module.exports = {
	ci: {
		collect: {
			chromePath: '/usr/bin/google-chrome',
			// Serve the 'dist' directory on a local server
			staticDistDir: './dist',
			// Or use the start command if dynamic server behavior is needed (prefer static for simple SPAs)
			// startServerCommand: 'npm run preview',

			// Runs only on localhost
			url: ['http://localhost:3000/'],

			// Number of runs for stability
			numberOfRuns: 3,

			// Settings for Chrome (crucial for WSL/CI)
			settings: {
				chromeFlags: '--no-sandbox --headless --disable-gpu',
			},
		},
		upload: {
			// Don't upload automatically to public server, just save report to disk
			target: 'filesystem',
			outputDir: './.lighthouseci',
		},
		assert: {
			// Warn if categories score below 90, error if below 70 (adjust as needed)
			assertions: {
				'categories:performance': ['warn', { minScore: 0.9 }],
				'categories:accessibility': ['warn', { minScore: 0.9 }],
				'categories:best-practices': ['warn', { minScore: 0.9 }],
				'categories:seo': ['warn', { minScore: 0.9 }],
			},
		},
	},
};
