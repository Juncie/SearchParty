var background = (function() {
	//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@22.19.17_eslint@9.39.4_jiti@2.6.1__jiti@2.6.1_tsx@4.21.0/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/wxt@0.20.25_@types+node@22.19.17_eslint@9.39.4_jiti@2.6.1__jiti@2.6.1_tsx@4.21.0/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region lib/extension-preferences.ts
	var extensionPreferenceKeys = {
		theme: "searchPartyThemePreference",
		openBehavior: "searchPartyOpenBehavior"
	};
	var defaultPreferences = {
		theme: "system",
		openBehavior: "sidepanel"
	};
	async function getExtensionPreferences() {
		const stored = await browser.storage.local.get([extensionPreferenceKeys.theme, extensionPreferenceKeys.openBehavior]);
		return {
			theme: parseThemePreference(stored[extensionPreferenceKeys.theme]),
			openBehavior: parseOpenBehavior(stored[extensionPreferenceKeys.openBehavior])
		};
	}
	async function applyPanelOpenBehavior() {
		if (!browser.sidePanel?.setPanelBehavior) return;
		const { openBehavior } = await getExtensionPreferences();
		await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: openBehavior === "sidepanel" });
	}
	function parseThemePreference(value) {
		if (value === "light" || value === "dark" || value === "system") return value;
		return defaultPreferences.theme;
	}
	function parseOpenBehavior(value) {
		if (value === "popup" || value === "sidepanel") return value;
		return defaultPreferences.openBehavior;
	}
	//#endregion
	//#region entrypoints/background.ts
	var background_default = defineBackground(() => {
		applyPanelOpenBehavior();
		browser.runtime.onInstalled.addListener(() => {
			applyPanelOpenBehavior();
		});
		browser.runtime.onMessage.addListener((message) => {
			if (typeof message === "object" && message !== null && "type" in message && message.type === "searchPartyPreferencesChanged") applyPanelOpenBehavior();
		});
	});
	//#endregion
	//#region ../../node_modules/.pnpm/@webext-core+match-patterns@1.0.3/node_modules/@webext-core/match-patterns/lib/index.js
	var _MatchPattern = class {
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [..._MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				validatePathname(matchPattern, pathname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		includes(url) {
			if (this.isAllUrls) return true;
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isFileMatch(url) {
			throw Error("Not implemented: file:// pattern matching. Open a PR to add support");
		}
		isFtpMatch(url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var MatchPattern = _MatchPattern;
	MatchPattern.PROTOCOLS = [
		"http",
		"https",
		"file",
		"ftp",
		"urn"
	];
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	function validatePathname(matchPattern, pathname) {}
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?/home/juncie/projects/SearchParty/apps/extension/entrypoints/background.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	var ws;
	/** Connect to the websocket and listen for messages. */
	function getDevServerWebSocket() {
		if (ws == null) {
			const serverUrl = "ws://localhost:3000";
			logger.debug("Connecting to dev server @", serverUrl);
			ws = new WebSocket(serverUrl, "vite-hmr");
			ws.addWxtEventListener = ws.addEventListener.bind(ws);
			ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({
				type: "custom",
				event,
				payload
			}));
			ws.addEventListener("open", () => {
				logger.debug("Connected to dev server");
			});
			ws.addEventListener("close", () => {
				logger.debug("Disconnected from dev server");
			});
			ws.addEventListener("error", (event) => {
				logger.error("Failed to connect to dev server", event);
			});
			ws.addEventListener("message", (e) => {
				try {
					const message = JSON.parse(e.data);
					if (message.type === "custom") ws?.dispatchEvent(new CustomEvent(message.event, { detail: message.data }));
				} catch (err) {
					logger.error("Failed to handle message", err);
				}
			});
		}
		return ws;
	}
	/** https://developer.chrome.com/blog/longer-esw-lifetimes/ */
	function keepServiceWorkerAlive() {
		setInterval(async () => {
			await browser.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const matches = registered.filter((cs) => {
			const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
			const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
			return hasJs || hasCss;
		});
		if (matches.length === 0) {
			logger.log("Content script is not registered yet, nothing to reload", contentScript);
			return;
		}
		await browser.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser.tabs.reload(tab.id);
			} catch (err) {
				logger.warn("Failed to reload tab:", err);
			}
		}));
	}
	async function reloadContentScriptMv2(_payload) {
		throw Error("TODO: reloadContentScriptMv2");
	}
	try {
		const ws = getDevServerWebSocket();
		ws.addWxtEventListener("wxt:reload-extension", () => {
			browser.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser.runtime.reload();
	});
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjVfQHR5cGVzK25vZGVAMjIuMTkuMTdfZXNsaW50QDkuMzkuNF9qaXRpQDIuNi4xX19qaXRpQDIuNi4xX3RzeEA0LjIxLjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9Ad3h0LWRlditicm93c2VyQDAuMS40MC9ub2RlX21vZHVsZXMvQHd4dC1kZXYvYnJvd3Nlci9zcmMvaW5kZXgubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI1X0B0eXBlcytub2RlQDIyLjE5LjE3X2VzbGludEA5LjM5LjRfaml0aUAyLjYuMV9faml0aUAyLjYuMV90c3hANC4yMS4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uL2xpYi9leHRlbnNpb24tcHJlZmVyZW5jZXMudHMiLCIuLi8uLi9lbnRyeXBvaW50cy9iYWNrZ3JvdW5kLnRzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B3ZWJleHQtY29yZSttYXRjaC1wYXR0ZXJuc0AxLjAuMy9ub2RlX21vZHVsZXMvQHdlYmV4dC1jb3JlL21hdGNoLXBhdHRlcm5zL2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsImV4cG9ydCB0eXBlIEV4dGVuc2lvblRoZW1lUHJlZmVyZW5jZSA9XG4gIHwgXCJsaWdodFwiXG4gIHwgXCJkYXJrXCJcbiAgfCBcInN5c3RlbVwiO1xuXG5leHBvcnQgdHlwZSBFeHRlbnNpb25PcGVuQmVoYXZpb3IgPSBcInBvcHVwXCIgfCBcInNpZGVwYW5lbFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEV4dGVuc2lvblByZWZlcmVuY2VzIHtcbiAgdGhlbWU6IEV4dGVuc2lvblRoZW1lUHJlZmVyZW5jZTtcbiAgb3BlbkJlaGF2aW9yOiBFeHRlbnNpb25PcGVuQmVoYXZpb3I7XG59XG5cbmV4cG9ydCBjb25zdCBleHRlbnNpb25QcmVmZXJlbmNlS2V5cyA9IHtcbiAgdGhlbWU6IFwic2VhcmNoUGFydHlUaGVtZVByZWZlcmVuY2VcIixcbiAgb3BlbkJlaGF2aW9yOiBcInNlYXJjaFBhcnR5T3BlbkJlaGF2aW9yXCIsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgZXh0ZW5zaW9uUHJlZmVyZW5jZU1lc3NhZ2VUeXBlID1cbiAgXCJzZWFyY2hQYXJ0eVByZWZlcmVuY2VzQ2hhbmdlZFwiO1xuXG5jb25zdCBkZWZhdWx0UHJlZmVyZW5jZXM6IEV4dGVuc2lvblByZWZlcmVuY2VzID0ge1xuICB0aGVtZTogXCJzeXN0ZW1cIixcbiAgb3BlbkJlaGF2aW9yOiBcInNpZGVwYW5lbFwiLFxufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEV4dGVuc2lvblByZWZlcmVuY2VzKCk6IFByb21pc2U8RXh0ZW5zaW9uUHJlZmVyZW5jZXM+IHtcbiAgY29uc3Qgc3RvcmVkID0gYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLmdldChbXG4gICAgZXh0ZW5zaW9uUHJlZmVyZW5jZUtleXMudGhlbWUsXG4gICAgZXh0ZW5zaW9uUHJlZmVyZW5jZUtleXMub3BlbkJlaGF2aW9yLFxuICBdKTtcblxuICByZXR1cm4ge1xuICAgIHRoZW1lOiBwYXJzZVRoZW1lUHJlZmVyZW5jZShcbiAgICAgIHN0b3JlZFtleHRlbnNpb25QcmVmZXJlbmNlS2V5cy50aGVtZV1cbiAgICApLFxuICAgIG9wZW5CZWhhdmlvcjogcGFyc2VPcGVuQmVoYXZpb3IoXG4gICAgICBzdG9yZWRbZXh0ZW5zaW9uUHJlZmVyZW5jZUtleXMub3BlbkJlaGF2aW9yXVxuICAgICksXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRUaGVtZVByZWZlcmVuY2UoXG4gIHRoZW1lOiBFeHRlbnNpb25UaGVtZVByZWZlcmVuY2Vcbikge1xuICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBbZXh0ZW5zaW9uUHJlZmVyZW5jZUtleXMudGhlbWVdOiB0aGVtZSxcbiAgfSk7XG4gIGFwcGx5VGhlbWVQcmVmZXJlbmNlKHRoZW1lKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldE9wZW5CZWhhdmlvclByZWZlcmVuY2UoXG4gIG9wZW5CZWhhdmlvcjogRXh0ZW5zaW9uT3BlbkJlaGF2aW9yXG4pIHtcbiAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLnNldCh7XG4gICAgW2V4dGVuc2lvblByZWZlcmVuY2VLZXlzLm9wZW5CZWhhdmlvcl06IG9wZW5CZWhhdmlvcixcbiAgfSk7XG4gIGF3YWl0IG5vdGlmeVByZWZlcmVuY2VDaGFuZ2UoKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFwcGx5U3RvcmVkVGhlbWUoKSB7XG4gIGNvbnN0IHsgdGhlbWUgfSA9IGF3YWl0IGdldEV4dGVuc2lvblByZWZlcmVuY2VzKCk7XG4gIGFwcGx5VGhlbWVQcmVmZXJlbmNlKHRoZW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5VGhlbWVQcmVmZXJlbmNlKFxuICB0aGVtZTogRXh0ZW5zaW9uVGhlbWVQcmVmZXJlbmNlXG4pIHtcbiAgY29uc3QgcHJlZmVyc0RhcmsgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICB3aW5kb3cubWF0Y2hNZWRpYT8uKFwiKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKVwiKS5tYXRjaGVzO1xuICBjb25zdCBzaG91bGRVc2VEYXJrID1cbiAgICB0aGVtZSA9PT0gXCJkYXJrXCIgfHwgKHRoZW1lID09PSBcInN5c3RlbVwiICYmIHByZWZlcnNEYXJrKTtcblxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShcbiAgICBcImRhcmtcIixcbiAgICBzaG91bGRVc2VEYXJrXG4gICk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhcHBseVBhbmVsT3BlbkJlaGF2aW9yKCkge1xuICBpZiAoIWJyb3dzZXIuc2lkZVBhbmVsPy5zZXRQYW5lbEJlaGF2aW9yKSByZXR1cm47XG5cbiAgY29uc3QgeyBvcGVuQmVoYXZpb3IgfSA9IGF3YWl0IGdldEV4dGVuc2lvblByZWZlcmVuY2VzKCk7XG4gIGF3YWl0IGJyb3dzZXIuc2lkZVBhbmVsLnNldFBhbmVsQmVoYXZpb3Ioe1xuICAgIG9wZW5QYW5lbE9uQWN0aW9uQ2xpY2s6IG9wZW5CZWhhdmlvciA9PT0gXCJzaWRlcGFuZWxcIixcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGhlbWVQcmVmZXJlbmNlKFxuICB2YWx1ZTogdW5rbm93blxuKTogRXh0ZW5zaW9uVGhlbWVQcmVmZXJlbmNlIHtcbiAgaWYgKFxuICAgIHZhbHVlID09PSBcImxpZ2h0XCIgfHxcbiAgICB2YWx1ZSA9PT0gXCJkYXJrXCIgfHxcbiAgICB2YWx1ZSA9PT0gXCJzeXN0ZW1cIlxuICApIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFByZWZlcmVuY2VzLnRoZW1lO1xufVxuXG5mdW5jdGlvbiBwYXJzZU9wZW5CZWhhdmlvcihcbiAgdmFsdWU6IHVua25vd25cbik6IEV4dGVuc2lvbk9wZW5CZWhhdmlvciB7XG4gIGlmICh2YWx1ZSA9PT0gXCJwb3B1cFwiIHx8IHZhbHVlID09PSBcInNpZGVwYW5lbFwiKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRQcmVmZXJlbmNlcy5vcGVuQmVoYXZpb3I7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG5vdGlmeVByZWZlcmVuY2VDaGFuZ2UoKSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgYnJvd3Nlci5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgIHR5cGU6IGV4dGVuc2lvblByZWZlcmVuY2VNZXNzYWdlVHlwZSxcbiAgICB9KTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gVGhlIHNldHRpbmdzIHNjcmVlbiBjYW4gc3RpbGwgcGVyc2lzdCBwcmVmZXJlbmNlcyBpZiBubyBsaXN0ZW5lciBpcyBhY3RpdmUuXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGFwcGx5UGFuZWxPcGVuQmVoYXZpb3IsXG4gIGV4dGVuc2lvblByZWZlcmVuY2VNZXNzYWdlVHlwZSxcbn0gZnJvbSBcIkAvbGliL2V4dGVuc2lvbi1wcmVmZXJlbmNlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVCYWNrZ3JvdW5kKCgpID0+IHtcbiAgdm9pZCBhcHBseVBhbmVsT3BlbkJlaGF2aW9yKCk7XG5cbiAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICB2b2lkIGFwcGx5UGFuZWxPcGVuQmVoYXZpb3IoKTtcbiAgfSk7XG5cbiAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogdW5rbm93bikgPT4ge1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiICYmXG4gICAgICBtZXNzYWdlICE9PSBudWxsICYmXG4gICAgICBcInR5cGVcIiBpbiBtZXNzYWdlICYmXG4gICAgICBtZXNzYWdlLnR5cGUgPT09IGV4dGVuc2lvblByZWZlcmVuY2VNZXNzYWdlVHlwZVxuICAgICkge1xuICAgICAgdm9pZCBhcHBseVBhbmVsT3BlbkJlaGF2aW9yKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiLy8gc3JjL2luZGV4LnRzXG52YXIgX01hdGNoUGF0dGVybiA9IGNsYXNzIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG4gICAgaWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcbiAgICAgIHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLl9NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuICAgICAgaWYgKGdyb3VwcyA9PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcbiAgICAgIGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3VwcztcbiAgICAgIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG4gICAgICB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuICAgICAgdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKTtcbiAgICAgIHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcbiAgICAgIHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuICAgICAgdGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG4gICAgfVxuICB9XG4gIGluY2x1ZGVzKHVybCkge1xuICAgIGlmICh0aGlzLmlzQWxsVXJscylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcbiAgICByZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImh0dHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuICAgICAgaWYgKHByb3RvY29sID09PSBcImZpbGVcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpXG4gICAgICAgIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG4gICAgfSk7XG4gIH1cbiAgaXNIdHRwTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG4gIH1cbiAgaXNIdHRwc01hdGNoKHVybCkge1xuICAgIHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG4gICAgaWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW1xuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSxcbiAgICAgIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXG4gICAgXTtcbiAgICBjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuICAgIHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcbiAgfVxuICBpc0ZpbGVNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZmlsZTovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgaXNGdHBNYXRjaCh1cmwpIHtcbiAgICB0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc1Vybk1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG4gICAgY29uc3QgZXNjYXBlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybik7XG4gICAgY29uc3Qgc3RhcnNSZXBsYWNlZCA9IGVzY2FwZWQucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuICAgIHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuICB9XG4gIGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuICB9XG59O1xudmFyIE1hdGNoUGF0dGVybiA9IF9NYXRjaFBhdHRlcm47XG5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTID0gW1wiaHR0cFwiLCBcImh0dHBzXCIsIFwiZmlsZVwiLCBcImZ0cFwiLCBcInVyblwiXTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG4gICAgc3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcbiAgfVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuICBpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIilcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcbiAgaWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpXG4gICAgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4oXG4gICAgICBtYXRjaFBhdHRlcm4sXG4gICAgICBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWBcbiAgICApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVQYXRobmFtZShtYXRjaFBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHJldHVybjtcbn1cbmV4cG9ydCB7XG4gIEludmFsaWRNYXRjaFBhdHRlcm4sXG4gIE1hdGNoUGF0dGVyblxufTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsNV0sIm1hcHBpbmdzIjoiOztDQUNBLFNBQVMsaUJBQWlCLEtBQUs7QUFDOUIsTUFB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