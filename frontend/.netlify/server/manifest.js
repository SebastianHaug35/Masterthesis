export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["chatui/apple-touch-icon.png","chatui/favicon-dev.svg","chatui/favicon.ico","chatui/favicon.svg","chatui/icon-128x128.png","chatui/icon-144x144.png","chatui/icon-192x192.png","chatui/icon-256x256.png","chatui/icon-36x36.png","chatui/icon-48x48.png","chatui/icon-512x512.png","chatui/icon-72x72.png","chatui/icon-96x96.png","chatui/icon.svg","chatui/logo.svg","chatui/manifest.json","huggingchat/apple-touch-icon.png","huggingchat/assistants-thumbnail.png","huggingchat/castle-example.jpg","huggingchat/favicon-dark.svg","huggingchat/favicon-dev.svg","huggingchat/favicon.ico","huggingchat/favicon.svg","huggingchat/fulltext-logo.svg","huggingchat/icon-128x128.png","huggingchat/icon-144x144.png","huggingchat/icon-192x192.png","huggingchat/icon-256x256.png","huggingchat/icon-36x36.png","huggingchat/icon-48x48.png","huggingchat/icon-512x512.png","huggingchat/icon-72x72.png","huggingchat/icon-96x96.png","huggingchat/icon.svg","huggingchat/logo.svg","huggingchat/manifest.json","huggingchat/omni-welcome.gif","huggingchat/routes.chat.json","huggingchat/thumbnail.png","huggingchat/tools-thumbnail.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".json":"application/json",".jpg":"image/jpeg",".gif":"image/gif",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.B8r6Rk0T.js",app:"_app/immutable/entry/app.BhmYGvnk.js",imports:["_app/immutable/entry/start.B8r6Rk0T.js","_app/immutable/chunks/CnCs9bcF.js","_app/immutable/chunks/BcN68U5D.js","_app/immutable/chunks/C4v0OW8u.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/entry/app.BhmYGvnk.js","_app/immutable/chunks/ckwbz45p.js","_app/immutable/chunks/DKpmxtgm.js","_app/immutable/chunks/C4v0OW8u.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/BaGC0f8M.js","_app/immutable/chunks/BcN68U5D.js","_app/immutable/chunks/CnCs9bcF.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/oX7wk-WR.js","_app/immutable/chunks/BG7u6Al2.js","_app/immutable/chunks/DdOC9ybJ.js","_app/immutable/chunks/Bzv1qalD.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/.well-known/oauth-cimd",
				pattern: /^\/\.well-known\/oauth-cimd\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/.well-known/oauth-cimd/_server.ts.js'))
			},
			{
				id: "/__debug/openai",
				pattern: /^\/__debug\/openai\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/__debug/openai/_server.ts.js'))
			},
			{
				id: "/admin/export",
				pattern: /^\/admin\/export\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/export/_server.ts.js'))
			},
			{
				id: "/admin/stats/compute",
				pattern: /^\/admin\/stats\/compute\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/admin/stats/compute/_server.ts.js'))
			},
			{
				id: "/api/conversations",
				pattern: /^\/api\/conversations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/conversations/_server.ts.js'))
			},
			{
				id: "/api/conversation/[id]",
				pattern: /^\/api\/conversation\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/conversation/_id_/_server.ts.js'))
			},
			{
				id: "/api/conversation/[id]/message/[messageId]",
				pattern: /^\/api\/conversation\/([^/]+?)\/message\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/conversation/_id_/message/_messageId_/_server.ts.js'))
			},
			{
				id: "/api/fetch-url",
				pattern: /^\/api\/fetch-url\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/fetch-url/_server.ts.js'))
			},
			{
				id: "/api/mcp/health",
				pattern: /^\/api\/mcp\/health\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/mcp/health/_server.ts.js'))
			},
			{
				id: "/api/mcp/servers",
				pattern: /^\/api\/mcp\/servers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/mcp/servers/_server.ts.js'))
			},
			{
				id: "/api/models",
				pattern: /^\/api\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/models/_server.ts.js'))
			},
			{
				id: "/api/transcribe",
				pattern: /^\/api\/transcribe\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/transcribe/_server.ts.js'))
			},
			{
				id: "/api/user",
				pattern: /^\/api\/user\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/user/_server.ts.js'))
			},
			{
				id: "/api/user/validate-token",
				pattern: /^\/api\/user\/validate-token\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/user/validate-token/_server.ts.js'))
			},
			{
				id: "/api/v2/conversations",
				pattern: /^\/api\/v2\/conversations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/conversations/_server.ts.js'))
			},
			{
				id: "/api/v2/conversations/import-share",
				pattern: /^\/api\/v2\/conversations\/import-share\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/conversations/import-share/_server.ts.js'))
			},
			{
				id: "/api/v2/conversations/[id]",
				pattern: /^\/api\/v2\/conversations\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/conversations/_id_/_server.ts.js'))
			},
			{
				id: "/api/v2/conversations/[id]/message/[messageId]",
				pattern: /^\/api\/v2\/conversations\/([^/]+?)\/message\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/conversations/_id_/message/_messageId_/_server.ts.js'))
			},
			{
				id: "/api/v2/debug/config",
				pattern: /^\/api\/v2\/debug\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/debug/config/_server.ts.js'))
			},
			{
				id: "/api/v2/debug/refresh",
				pattern: /^\/api\/v2\/debug\/refresh\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/debug/refresh/_server.ts.js'))
			},
			{
				id: "/api/v2/export",
				pattern: /^\/api\/v2\/export\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/export/_server.ts.js'))
			},
			{
				id: "/api/v2/feature-flags",
				pattern: /^\/api\/v2\/feature-flags\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/feature-flags/_server.ts.js'))
			},
			{
				id: "/api/v2/models",
				pattern: /^\/api\/v2\/models\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/_server.ts.js'))
			},
			{
				id: "/api/v2/models/old",
				pattern: /^\/api\/v2\/models\/old\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/old/_server.ts.js'))
			},
			{
				id: "/api/v2/models/refresh",
				pattern: /^\/api\/v2\/models\/refresh\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/refresh/_server.ts.js'))
			},
			{
				id: "/api/v2/models/[namespace]",
				pattern: /^\/api\/v2\/models\/([^/]+?)\/?$/,
				params: [{"name":"namespace","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/_namespace_/_server.ts.js'))
			},
			{
				id: "/api/v2/models/[namespace]/subscribe",
				pattern: /^\/api\/v2\/models\/([^/]+?)\/subscribe\/?$/,
				params: [{"name":"namespace","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/_namespace_/subscribe/_server.ts.js'))
			},
			{
				id: "/api/v2/models/[namespace]/[model]",
				pattern: /^\/api\/v2\/models\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"namespace","optional":false,"rest":false,"chained":false},{"name":"model","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/_namespace_/_model_/_server.ts.js'))
			},
			{
				id: "/api/v2/models/[namespace]/[model]/subscribe",
				pattern: /^\/api\/v2\/models\/([^/]+?)\/([^/]+?)\/subscribe\/?$/,
				params: [{"name":"namespace","optional":false,"rest":false,"chained":false},{"name":"model","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/models/_namespace_/_model_/subscribe/_server.ts.js'))
			},
			{
				id: "/api/v2/public-config",
				pattern: /^\/api\/v2\/public-config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/public-config/_server.ts.js'))
			},
			{
				id: "/api/v2/user",
				pattern: /^\/api\/v2\/user\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/user/_server.ts.js'))
			},
			{
				id: "/api/v2/user/billing-orgs",
				pattern: /^\/api\/v2\/user\/billing-orgs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/user/billing-orgs/_server.ts.js'))
			},
			{
				id: "/api/v2/user/reports",
				pattern: /^\/api\/v2\/user\/reports\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/user/reports/_server.ts.js'))
			},
			{
				id: "/api/v2/user/settings",
				pattern: /^\/api\/v2\/user\/settings\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/v2/user/settings/_server.ts.js'))
			},
			{
				id: "/conversation",
				pattern: /^\/conversation\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/conversation/_server.ts.js'))
			},
			{
				id: "/conversation/[id]",
				pattern: /^\/conversation\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: __memo(() => import('./entries/endpoints/conversation/_id_/_server.ts.js'))
			},
			{
				id: "/conversation/[id]/message/[messageId]/prompt",
				pattern: /^\/conversation\/([^/]+?)\/message\/([^/]+?)\/prompt\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"messageId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/conversation/_id_/message/_messageId_/prompt/_server.ts.js'))
			},
			{
				id: "/conversation/[id]/output/[sha256]",
				pattern: /^\/conversation\/([^/]+?)\/output\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false},{"name":"sha256","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/conversation/_id_/output/_sha256_/_server.ts.js'))
			},
			{
				id: "/conversation/[id]/share",
				pattern: /^\/conversation\/([^/]+?)\/share\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/conversation/_id_/share/_server.ts.js'))
			},
			{
				id: "/conversation/[id]/stop-generating",
				pattern: /^\/conversation\/([^/]+?)\/stop-generating\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/conversation/_id_/stop-generating/_server.ts.js'))
			},
			{
				id: "/healthcheck",
				pattern: /^\/healthcheck\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/healthcheck/_server.ts.js'))
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/login/_server.ts.js'))
			},
			{
				id: "/login/callback",
				pattern: /^\/login\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/login/callback/_server.ts.js'))
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/logout/_server.ts.js'))
			},
			{
				id: "/metrics",
				pattern: /^\/metrics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/metrics/_server.ts.js'))
			},
			{
				id: "/models",
				pattern: /^\/models\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/models/[...model]/thumbnail.png",
				pattern: /^\/models(?:\/([^]*))?\/thumbnail\.png\/?$/,
				params: [{"name":"model","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/models/_...model_/thumbnail.png/_server.ts.js'))
			},
			{
				id: "/models/[...model]",
				pattern: /^\/models(?:\/([^]*))?\/?$/,
				params: [{"name":"model","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/r/[id]",
				pattern: /^\/r\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/settings/(nav)",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 10 },
				endpoint: __memo(() => import('./entries/endpoints/settings/(nav)/_server.ts.js'))
			},
			{
				id: "/settings/(nav)/application",
				pattern: /^\/settings\/application\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/settings/(nav)/[...model]",
				pattern: /^\/settings(?:\/([^]*))?\/?$/,
				params: [{"name":"model","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
