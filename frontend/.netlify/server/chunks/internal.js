import { r as root } from "./root.js";
import "./environment.js";
import "./server.js";
import "./shared-server.js";
let read_implementation = null;
function set_read_implementation(fn) {
  read_implementation = fn;
}
function set_manifest(_) {
}
const options = {
  app_template_contains_nonce: false,
  async: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: false,
  csrf_trusted_origins: ["*"],
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hash_routing: false,
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root,
  service_worker: false,
  service_worker_options: void 0,
  templates: {
    app: ({ head, body, assets, nonce, env }) => `<!doctype html>\r
<html lang="en">\r
	<head>\r
		<meta charset="utf-8" />\r
		<meta\r
			name="viewport"\r
			content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"\r
		/>\r
		<meta name="theme-color" content="rgb(249, 250, 251)" />\r
		<script>\r
			(function () {\r
				try {\r
					var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;\r
					var stored = localStorage.getItem("theme");\r
					var followSystem = stored === null || stored === "system";\r
					var isDark = stored === "dark" || (followSystem && prefersDark);\r
					if (isDark) {\r
						document.documentElement.classList.add("dark");\r
						document.querySelector('meta[name="theme-color"]').setAttribute("content", "#07090d");\r
					}\r
				} catch (e) {}\r
			})();\r
\r
			// For some reason, Sveltekit doesn't let us load env variables from .env here, so we load it from hooks.server.ts\r
			window.gaId = "%gaId%";\r
		<\/script>\r
		` + head + '\r\n	</head>\r\n	<body data-sveltekit-preload-data="hover" class="h-dvh dark:bg-gray-900">\r\n		<div id="app" class="contents h-full">' + body + `</div>\r
\r
		<!-- Google Tag Manager -->\r
		<script>\r
			if (window.gaId) {\r
				const script = document.createElement("script");\r
				script.src = "https://www.googletagmanager.com/gtag/js?id=" + window.gaId;\r
				script.async = true;\r
				document.head.appendChild(script);\r
\r
				window.dataLayer = window.dataLayer || [];\r
				function gtag() {\r
					dataLayer.push(arguments);\r
				}\r
				gtag("js", new Date());\r
				/// ^ See https://developers.google.com/tag-platform/gtagjs/install\r
				gtag("config", window.gaId);\r
				gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied" });\r
				/// ^ See https://developers.google.com/tag-platform/gtagjs/reference#consent\r
				/// TODO: ask the user for their consent and update this with gtag('consent', 'update')\r
			}\r
		<\/script>\r
	</body>\r
</html>\r
`,
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "1hzo2mz"
};
async function get_hooks() {
  let handle;
  let handleFetch;
  let handleError;
  let handleValidationError;
  let init;
  ({ handle, handleFetch, handleError, handleValidationError, init } = await import("../entries/hooks.server.js"));
  let reroute;
  let transport;
  ({ reroute, transport } = await import("../entries/hooks.universal.js"));
  return {
    handle,
    handleFetch,
    handleError,
    handleValidationError,
    init,
    reroute,
    transport
  };
}
export {
  set_manifest as a,
  get_hooks as g,
  options as o,
  read_implementation as r,
  set_read_implementation as s
};
