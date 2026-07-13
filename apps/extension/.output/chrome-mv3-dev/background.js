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
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/core.js
	var _a$1;
	function $constructor(name, initializer, params) {
		function init(inst, def) {
			if (!inst._zod) Object.defineProperty(inst, "_zod", {
				value: {
					def,
					constr: _,
					traits: /* @__PURE__ */ new Set()
				},
				enumerable: false
			});
			if (inst._zod.traits.has(name)) return;
			inst._zod.traits.add(name);
			initializer(inst, def);
			const proto = _.prototype;
			const keys = Object.keys(proto);
			for (let i = 0; i < keys.length; i++) {
				const k = keys[i];
				if (!(k in inst)) inst[k] = proto[k].bind(inst);
			}
		}
		const Parent = params?.Parent ?? Object;
		class Definition extends Parent {}
		Object.defineProperty(Definition, "name", { value: name });
		function _(def) {
			var _a;
			const inst = params?.Parent ? new Definition() : this;
			init(inst, def);
			(_a = inst._zod).deferred ?? (_a.deferred = []);
			for (const fn of inst._zod.deferred) fn();
			return inst;
		}
		Object.defineProperty(_, "init", { value: init });
		Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
			if (params?.Parent && inst instanceof params.Parent) return true;
			return inst?._zod?.traits?.has(name);
		} });
		Object.defineProperty(_, "name", { value: name });
		return _;
	}
	var $ZodAsyncError = class extends Error {
		constructor() {
			super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
		}
	};
	var $ZodEncodeError = class extends Error {
		constructor(name) {
			super(`Encountered unidirectional transform during encode: ${name}`);
			this.name = "ZodEncodeError";
		}
	};
	(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
	var globalConfig = globalThis.__zod_globalConfig;
	function config(newConfig) {
		if (newConfig) Object.assign(globalConfig, newConfig);
		return globalConfig;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/util.js
	function getEnumValues(entries) {
		const numericValues = Object.values(entries).filter((v) => typeof v === "number");
		return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
	}
	function jsonStringifyReplacer(_, value) {
		if (typeof value === "bigint") return value.toString();
		return value;
	}
	function cached(getter) {
		return { get value() {
			{
				const value = getter();
				Object.defineProperty(this, "value", { value });
				return value;
			}
			throw new Error("cached value already set");
		} };
	}
	function nullish(input) {
		return input === null || input === void 0;
	}
	function cleanRegex(source) {
		const start = source.startsWith("^") ? 1 : 0;
		const end = source.endsWith("$") ? source.length - 1 : source.length;
		return source.slice(start, end);
	}
	function floatSafeRemainder(val, step) {
		const ratio = val / step;
		const roundedRatio = Math.round(ratio);
		const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
		if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
		return ratio - roundedRatio;
	}
	var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
	function defineLazy(object, key, getter) {
		let value = void 0;
		Object.defineProperty(object, key, {
			get() {
				if (value === EVALUATING) return;
				if (value === void 0) {
					value = EVALUATING;
					value = getter();
				}
				return value;
			},
			set(v) {
				Object.defineProperty(object, key, { value: v });
			},
			configurable: true
		});
	}
	function assignProp(target, prop, value) {
		Object.defineProperty(target, prop, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	function mergeDefs(...defs) {
		const mergedDescriptors = {};
		for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
		return Object.defineProperties({}, mergedDescriptors);
	}
	function esc(str) {
		return JSON.stringify(str);
	}
	function slugify(input) {
		return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
	}
	var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
	function isObject(data) {
		return typeof data === "object" && data !== null && !Array.isArray(data);
	}
	var allowsEval = /* @__PURE__ */ cached(() => {
		if (globalConfig.jitless) return false;
		if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
		try {
			new Function("");
			return true;
		} catch (_) {
			return false;
		}
	});
	function isPlainObject(o) {
		if (isObject(o) === false) return false;
		const ctor = o.constructor;
		if (ctor === void 0) return true;
		if (typeof ctor !== "function") return true;
		const prot = ctor.prototype;
		if (isObject(prot) === false) return false;
		if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
		return true;
	}
	function shallowClone(o) {
		if (isPlainObject(o)) return { ...o };
		if (Array.isArray(o)) return [...o];
		if (o instanceof Map) return new Map(o);
		if (o instanceof Set) return new Set(o);
		return o;
	}
	var propertyKeyTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"symbol"
	]);
	function escapeRegex(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	function clone(inst, def, params) {
		const cl = new inst._zod.constr(def ?? inst._zod.def);
		if (!def || params?.parent) cl._zod.parent = inst;
		return cl;
	}
	function normalizeParams(_params) {
		const params = _params;
		if (!params) return {};
		if (typeof params === "string") return { error: () => params };
		if (params?.message !== void 0) {
			if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
			params.error = params.message;
		}
		delete params.message;
		if (typeof params.error === "string") return {
			...params,
			error: () => params.error
		};
		return params;
	}
	function optionalKeys(shape) {
		return Object.keys(shape).filter((k) => {
			return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
		});
	}
	var NUMBER_FORMAT_RANGES = {
		safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-34028234663852886e22, 34028234663852886e22],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	};
	function pick(schema, mask) {
		const currDef = schema._zod.def;
		const checks = currDef.checks;
		if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
		return clone(schema, mergeDefs(schema._zod.def, {
			get shape() {
				const newShape = {};
				for (const key in mask) {
					if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					newShape[key] = currDef.shape[key];
				}
				assignProp(this, "shape", newShape);
				return newShape;
			},
			checks: []
		}));
	}
	function omit(schema, mask) {
		const currDef = schema._zod.def;
		const checks = currDef.checks;
		if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
		return clone(schema, mergeDefs(schema._zod.def, {
			get shape() {
				const newShape = { ...schema._zod.def.shape };
				for (const key in mask) {
					if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					delete newShape[key];
				}
				assignProp(this, "shape", newShape);
				return newShape;
			},
			checks: []
		}));
	}
	function extend(schema, shape) {
		if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
		const checks = schema._zod.def.checks;
		if (checks && checks.length > 0) {
			const existingShape = schema._zod.def.shape;
			for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
		}
		return clone(schema, mergeDefs(schema._zod.def, { get shape() {
			const _shape = {
				...schema._zod.def.shape,
				...shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		} }));
	}
	function safeExtend(schema, shape) {
		if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
		return clone(schema, mergeDefs(schema._zod.def, { get shape() {
			const _shape = {
				...schema._zod.def.shape,
				...shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		} }));
	}
	function merge(a, b) {
		if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
		return clone(a, mergeDefs(a._zod.def, {
			get shape() {
				const _shape = {
					...a._zod.def.shape,
					...b._zod.def.shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			},
			get catchall() {
				return b._zod.def.catchall;
			},
			checks: b._zod.def.checks ?? []
		}));
	}
	function partial(Class, schema, mask) {
		const checks = schema._zod.def.checks;
		if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
		return clone(schema, mergeDefs(schema._zod.def, {
			get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
				}
				else for (const key in oldShape) shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
				assignProp(this, "shape", shape);
				return shape;
			},
			checks: []
		}));
	}
	function required(Class, schema, mask) {
		return clone(schema, mergeDefs(schema._zod.def, { get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
			}
			else for (const key in oldShape) shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
			assignProp(this, "shape", shape);
			return shape;
		} }));
	}
	function aborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
		return false;
	}
	function explicitlyAborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
		return false;
	}
	function prefixIssues(path, issues) {
		return issues.map((iss) => {
			var _a;
			(_a = iss).path ?? (_a.path = []);
			iss.path.unshift(path);
			return iss;
		});
	}
	function unwrapMessage(message) {
		return typeof message === "string" ? message : message?.message;
	}
	function finalizeIssue(iss, ctx, config) {
		const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
		const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
		rest.path ?? (rest.path = []);
		rest.message = message;
		if (ctx?.reportInput) rest.input = _input;
		return rest;
	}
	function getLengthableOrigin(input) {
		if (Array.isArray(input)) return "array";
		if (typeof input === "string") return "string";
		return "unknown";
	}
	function issue(...args) {
		const [iss, input, inst] = args;
		if (typeof iss === "string") return {
			message: iss,
			code: "custom",
			input,
			inst
		};
		return { ...iss };
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/errors.js
	var initializer$1 = (inst, def) => {
		inst.name = "$ZodError";
		Object.defineProperty(inst, "_zod", {
			value: inst._zod,
			enumerable: false
		});
		Object.defineProperty(inst, "issues", {
			value: def,
			enumerable: false
		});
		inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
		Object.defineProperty(inst, "toString", {
			value: () => inst.message,
			enumerable: false
		});
	};
	var $ZodError = $constructor("$ZodError", initializer$1);
	var $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
	function flattenError(error, mapper = (issue) => issue.message) {
		const fieldErrors = {};
		const formErrors = [];
		for (const sub of error.issues) if (sub.path.length > 0) {
			fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
			fieldErrors[sub.path[0]].push(mapper(sub));
		} else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	function formatError(error, mapper = (issue) => issue.message) {
		const fieldErrors = { _errors: [] };
		const processError = (error, path = []) => {
			for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
			else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
			else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
			else {
				const fullpath = [...path, ...issue.path];
				if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
				else {
					let curr = fieldErrors;
					let i = 0;
					while (i < fullpath.length) {
						const el = fullpath[i];
						if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
						else {
							curr[el] = curr[el] || { _errors: [] };
							curr[el]._errors.push(mapper(issue));
						}
						curr = curr[el];
						i++;
					}
				}
			}
		};
		processError(error);
		return fieldErrors;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/parse.js
	var _parse = (_Err) => (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee);
			throw e;
		}
		return result.value;
	};
	var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee);
			throw e;
		}
		return result.value;
	};
	var _safeParse = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		return result.issues.length ? {
			success: false,
			error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
		} : {
			success: true,
			data: result.value
		};
	};
	var safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
	var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		return result.issues.length ? {
			success: false,
			error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
		} : {
			success: true,
			data: result.value
		};
	};
	var safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
	var _encode = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return _parse(_Err)(schema, value, ctx);
	};
	var _decode = (_Err) => (schema, value, _ctx) => {
		return _parse(_Err)(schema, value, _ctx);
	};
	var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return _parseAsync(_Err)(schema, value, ctx);
	};
	var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
		return _parseAsync(_Err)(schema, value, _ctx);
	};
	var _safeEncode = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return _safeParse(_Err)(schema, value, ctx);
	};
	var _safeDecode = (_Err) => (schema, value, _ctx) => {
		return _safeParse(_Err)(schema, value, _ctx);
	};
	var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return _safeParseAsync(_Err)(schema, value, ctx);
	};
	var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
		return _safeParseAsync(_Err)(schema, value, _ctx);
	};
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/regexes.js
	/**
	* @deprecated CUID v1 is deprecated by its authors due to information leakage
	* (timestamps embedded in the id). Use {@link cuid2} instead.
	* See https://github.com/paralleldrive/cuid.
	*/
	var cuid = /^[cC][0-9a-z]{6,}$/;
	var cuid2 = /^[0-9a-z]+$/;
	var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
	var xid = /^[0-9a-vA-V]{20}$/;
	var ksuid = /^[A-Za-z0-9]{27}$/;
	var nanoid = /^[a-zA-Z0-9_-]{21}$/;
	/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
	var duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
	/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
	var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
	/** Returns a regex for validating an RFC 9562/4122 UUID.
	*
	* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
	var uuid = (version) => {
		if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
		return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
	};
	/** Practical email validation */
	var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
	var _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
	function emoji() {
		return new RegExp(_emoji$1, "u");
	}
	var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
	var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
	var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
	var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
	var base64url = /^[A-Za-z0-9_-]*$/;
	var httpProtocol = /^https?$/;
	var e164 = /^\+[1-9]\d{6,14}$/;
	var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
	var date$1 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
	function timeSource(args) {
		const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
		return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
	}
	function time$1(args) {
		return new RegExp(`^${timeSource(args)}$`);
	}
	function datetime$1(args) {
		const time = timeSource({ precision: args.precision });
		const opts = ["Z"];
		if (args.local) opts.push("");
		if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
		const timeRegex = `${time}(?:${opts.join("|")})`;
		return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
	}
	var string$1 = (params) => {
		const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
		return new RegExp(`^${regex}$`);
	};
	var integer = /^-?\d+$/;
	var number$2 = /^-?\d+(?:\.\d+)?$/;
	var lowercase = /^[^A-Z]*$/;
	var uppercase = /^[^a-z]*$/;
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/checks.js
	var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
		var _a;
		inst._zod ?? (inst._zod = {});
		inst._zod.def = def;
		(_a = inst._zod).onattach ?? (_a.onattach = []);
	});
	var numericOriginMap = {
		number: "number",
		bigint: "bigint",
		object: "date"
	};
	var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
		$ZodCheck.init(inst, def);
		const origin = numericOriginMap[typeof def.value];
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
			if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
			else bag.exclusiveMaximum = def.value;
		});
		inst._zod.check = (payload) => {
			if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
			payload.issues.push({
				origin,
				code: "too_big",
				maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
				input: payload.value,
				inclusive: def.inclusive,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
		$ZodCheck.init(inst, def);
		const origin = numericOriginMap[typeof def.value];
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
			if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
			else bag.exclusiveMinimum = def.value;
		});
		inst._zod.check = (payload) => {
			if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
			payload.issues.push({
				origin,
				code: "too_small",
				minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
				input: payload.value,
				inclusive: def.inclusive,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
		$ZodCheck.init(inst, def);
		inst._zod.onattach.push((inst) => {
			var _a;
			(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
		});
		inst._zod.check = (payload) => {
			if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
			if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
			payload.issues.push({
				origin: typeof payload.value,
				code: "not_multiple_of",
				divisor: def.value,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
		$ZodCheck.init(inst, def);
		def.format = def.format || "float64";
		const isInt = def.format?.includes("int");
		const origin = isInt ? "int" : "number";
		const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.format = def.format;
			bag.minimum = minimum;
			bag.maximum = maximum;
			if (isInt) bag.pattern = integer;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (isInt) {
				if (!Number.isInteger(input)) {
					payload.issues.push({
						expected: origin,
						format: def.format,
						code: "invalid_type",
						continue: false,
						input,
						inst
					});
					return;
				}
				if (!Number.isSafeInteger(input)) {
					if (input > 0) payload.issues.push({
						input,
						code: "too_big",
						maximum: Number.MAX_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					else payload.issues.push({
						input,
						code: "too_small",
						minimum: Number.MIN_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					return;
				}
			}
			if (input < minimum) payload.issues.push({
				origin: "number",
				input,
				code: "too_small",
				minimum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
			if (input > maximum) payload.issues.push({
				origin: "number",
				input,
				code: "too_big",
				maximum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
		var _a;
		$ZodCheck.init(inst, def);
		(_a = inst._zod.def).when ?? (_a.when = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
			if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.length <= def.maximum) return;
			const origin = getLengthableOrigin(input);
			payload.issues.push({
				origin,
				code: "too_big",
				maximum: def.maximum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
		var _a;
		$ZodCheck.init(inst, def);
		(_a = inst._zod.def).when ?? (_a.when = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
			if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.length >= def.minimum) return;
			const origin = getLengthableOrigin(input);
			payload.issues.push({
				origin,
				code: "too_small",
				minimum: def.minimum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
		var _a;
		$ZodCheck.init(inst, def);
		(_a = inst._zod.def).when ?? (_a.when = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.minimum = def.length;
			bag.maximum = def.length;
			bag.length = def.length;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			const length = input.length;
			if (length === def.length) return;
			const origin = getLengthableOrigin(input);
			const tooBig = length > def.length;
			payload.issues.push({
				origin,
				...tooBig ? {
					code: "too_big",
					maximum: def.length
				} : {
					code: "too_small",
					minimum: def.length
				},
				inclusive: true,
				exact: true,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
		var _a, _b;
		$ZodCheck.init(inst, def);
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.format = def.format;
			if (def.pattern) {
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(def.pattern);
			}
		});
		if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
			def.pattern.lastIndex = 0;
			if (def.pattern.test(payload.value)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: def.format,
				input: payload.value,
				...def.pattern ? { pattern: def.pattern.toString() } : {},
				inst,
				continue: !def.abort
			});
		});
		else (_b = inst._zod).check ?? (_b.check = () => {});
	});
	var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
		$ZodCheckStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			def.pattern.lastIndex = 0;
			if (def.pattern.test(payload.value)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "regex",
				input: payload.value,
				pattern: def.pattern.toString(),
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
		def.pattern ?? (def.pattern = lowercase);
		$ZodCheckStringFormat.init(inst, def);
	});
	var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
		def.pattern ?? (def.pattern = uppercase);
		$ZodCheckStringFormat.init(inst, def);
	});
	var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
		$ZodCheck.init(inst, def);
		const escapedRegex = escapeRegex(def.includes);
		const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
		def.pattern = pattern;
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.includes(def.includes, def.position)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "includes",
				includes: def.includes,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
		$ZodCheck.init(inst, def);
		const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
		def.pattern ?? (def.pattern = pattern);
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.startsWith(def.prefix)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "starts_with",
				prefix: def.prefix,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
		$ZodCheck.init(inst, def);
		const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
		def.pattern ?? (def.pattern = pattern);
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.endsWith(def.suffix)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "ends_with",
				suffix: def.suffix,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
		$ZodCheck.init(inst, def);
		inst._zod.check = (payload) => {
			payload.value = def.tx(payload.value);
		};
	});
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/doc.js
	var Doc = class {
		constructor(args = []) {
			this.content = [];
			this.indent = 0;
			if (this) this.args = args;
		}
		indented(fn) {
			this.indent += 1;
			fn(this);
			this.indent -= 1;
		}
		write(arg) {
			if (typeof arg === "function") {
				arg(this, { execution: "sync" });
				arg(this, { execution: "async" });
				return;
			}
			const lines = arg.split("\n").filter((x) => x);
			const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
			const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
			for (const line of dedented) this.content.push(line);
		}
		compile() {
			const F = Function;
			const args = this?.args;
			const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
			return new F(...args, lines.join("\n"));
		}
	};
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/versions.js
	var version = {
		major: 4,
		minor: 4,
		patch: 1
	};
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/schemas.js
	var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
		var _a;
		inst ?? (inst = {});
		inst._zod.def = def;
		inst._zod.bag = inst._zod.bag || {};
		inst._zod.version = version;
		const checks = [...inst._zod.def.checks ?? []];
		if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
		for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
		if (checks.length === 0) {
			(_a = inst._zod).deferred ?? (_a.deferred = []);
			inst._zod.deferred?.push(() => {
				inst._zod.run = inst._zod.parse;
			});
		} else {
			const runChecks = (payload, checks, ctx) => {
				let isAborted = aborted(payload);
				let asyncResult;
				for (const ch of checks) {
					if (ch._zod.def.when) {
						if (explicitlyAborted(payload)) continue;
						if (!ch._zod.def.when(payload)) continue;
					} else if (isAborted) continue;
					const currLen = payload.issues.length;
					const _ = ch._zod.check(payload);
					if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
					if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
						await _;
						if (payload.issues.length === currLen) return;
						if (!isAborted) isAborted = aborted(payload, currLen);
					});
					else {
						if (payload.issues.length === currLen) continue;
						if (!isAborted) isAborted = aborted(payload, currLen);
					}
				}
				if (asyncResult) return asyncResult.then(() => {
					return payload;
				});
				return payload;
			};
			const handleCanaryResult = (canary, payload, ctx) => {
				if (aborted(canary)) {
					canary.aborted = true;
					return canary;
				}
				const checkResult = runChecks(payload, checks, ctx);
				if (checkResult instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
				}
				return inst._zod.parse(checkResult, ctx);
			};
			inst._zod.run = (payload, ctx) => {
				if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
				if (ctx.direction === "backward") {
					const canary = inst._zod.parse({
						value: payload.value,
						issues: []
					}, {
						...ctx,
						skipChecks: true
					});
					if (canary instanceof Promise) return canary.then((canary) => {
						return handleCanaryResult(canary, payload, ctx);
					});
					return handleCanaryResult(canary, payload, ctx);
				}
				const result = inst._zod.parse(payload, ctx);
				if (result instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return result.then((result) => runChecks(result, checks, ctx));
				}
				return runChecks(result, checks, ctx);
			};
		}
		defineLazy(inst, "~standard", () => ({
			validate: (value) => {
				try {
					const r = safeParse$1(inst, value);
					return r.success ? { value: r.data } : { issues: r.error?.issues };
				} catch (_) {
					return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
				}
			},
			vendor: "zod",
			version: 1
		}));
	});
	var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
		inst._zod.parse = (payload, _) => {
			if (def.coerce) try {
				payload.value = String(payload.value);
			} catch (_) {}
			if (typeof payload.value === "string") return payload;
			payload.issues.push({
				expected: "string",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
		$ZodCheckStringFormat.init(inst, def);
		$ZodString.init(inst, def);
	});
	var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
		def.pattern ?? (def.pattern = guid);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
		if (def.version) {
			const v = {
				v1: 1,
				v2: 2,
				v3: 3,
				v4: 4,
				v5: 5,
				v6: 6,
				v7: 7,
				v8: 8
			}[def.version];
			if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
			def.pattern ?? (def.pattern = uuid(v));
		} else def.pattern ?? (def.pattern = uuid());
		$ZodStringFormat.init(inst, def);
	});
	var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
		def.pattern ?? (def.pattern = email);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			try {
				const trimmed = payload.value.trim();
				if (!def.normalize && def.protocol?.source === httpProtocol.source) {
					if (!/^https?:\/\//i.test(trimmed)) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid URL format",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
				}
				const url = new URL(trimmed);
				if (def.hostname) {
					def.hostname.lastIndex = 0;
					if (!def.hostname.test(url.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
				if (def.protocol) {
					def.protocol.lastIndex = 0;
					if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
				if (def.normalize) payload.value = url.href;
				else payload.value = trimmed;
				return;
			} catch (_) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
		def.pattern ?? (def.pattern = emoji());
		$ZodStringFormat.init(inst, def);
	});
	var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
		def.pattern ?? (def.pattern = nanoid);
		$ZodStringFormat.init(inst, def);
	});
	/**
	* @deprecated CUID v1 is deprecated by its authors due to information leakage
	* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
	* See https://github.com/paralleldrive/cuid.
	*/
	var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
		def.pattern ?? (def.pattern = cuid);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
		def.pattern ?? (def.pattern = cuid2);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
		def.pattern ?? (def.pattern = ulid);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
		def.pattern ?? (def.pattern = xid);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
		def.pattern ?? (def.pattern = ksuid);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
		def.pattern ?? (def.pattern = datetime$1(def));
		$ZodStringFormat.init(inst, def);
	});
	var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
		def.pattern ?? (def.pattern = date$1);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
		def.pattern ?? (def.pattern = time$1(def));
		$ZodStringFormat.init(inst, def);
	});
	var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
		def.pattern ?? (def.pattern = duration$1);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
		def.pattern ?? (def.pattern = ipv4);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.format = `ipv4`;
	});
	var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
		def.pattern ?? (def.pattern = ipv6);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.format = `ipv6`;
		inst._zod.check = (payload) => {
			try {
				new URL(`http://[${payload.value}]`);
			} catch {
				payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
		def.pattern ?? (def.pattern = cidrv4);
		$ZodStringFormat.init(inst, def);
	});
	var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
		def.pattern ?? (def.pattern = cidrv6);
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			const parts = payload.value.split("/");
			try {
				if (parts.length !== 2) throw new Error();
				const [address, prefix] = parts;
				if (!prefix) throw new Error();
				const prefixNum = Number(prefix);
				if (`${prefixNum}` !== prefix) throw new Error();
				if (prefixNum < 0 || prefixNum > 128) throw new Error();
				new URL(`http://[${address}]`);
			} catch {
				payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	function isValidBase64(data) {
		if (data === "") return true;
		if (/\s/.test(data)) return false;
		if (data.length % 4 !== 0) return false;
		try {
			atob(data);
			return true;
		} catch {
			return false;
		}
	}
	var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
		def.pattern ?? (def.pattern = base64);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.contentEncoding = "base64";
		inst._zod.check = (payload) => {
			if (isValidBase64(payload.value)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "base64",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	function isValidBase64URL(data) {
		if (!base64url.test(data)) return false;
		const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
		return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
	}
	var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
		def.pattern ?? (def.pattern = base64url);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.contentEncoding = "base64url";
		inst._zod.check = (payload) => {
			if (isValidBase64URL(payload.value)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "base64url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
		def.pattern ?? (def.pattern = e164);
		$ZodStringFormat.init(inst, def);
	});
	function isValidJWT(token, algorithm = null) {
		try {
			const tokensParts = token.split(".");
			if (tokensParts.length !== 3) return false;
			const [header] = tokensParts;
			if (!header) return false;
			const parsedHeader = JSON.parse(atob(header));
			if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
			if (!parsedHeader.alg) return false;
			if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
			return true;
		} catch {
			return false;
		}
	}
	var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			if (isValidJWT(payload.value, def.alg)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "jwt",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = inst._zod.bag.pattern ?? number$2;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = Number(payload.value);
			} catch (_) {}
			const input = payload.value;
			if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
			const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
			payload.issues.push({
				expected: "number",
				code: "invalid_type",
				input,
				inst,
				...received ? { received } : {}
			});
			return payload;
		};
	});
	var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
		$ZodCheckNumberFormat.init(inst, def);
		$ZodNumber.init(inst, def);
	});
	var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload) => payload;
	});
	var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			payload.issues.push({
				expected: "never",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	function handleArrayResult(result, final, index) {
		if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
		final.value[index] = result.value;
	}
	var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!Array.isArray(input)) {
				payload.issues.push({
					expected: "array",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = Array(input.length);
			const proms = [];
			for (let i = 0; i < input.length; i++) {
				const item = input[i];
				const result = def.element._zod.run({
					value: item,
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
				else handleArrayResult(result, payload, i);
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
		const isPresent = key in input;
		if (result.issues.length) {
			if (isOptionalIn && isOptionalOut && !isPresent) return;
			final.issues.push(...prefixIssues(key, result.issues));
		}
		if (!isPresent && !isOptionalIn) {
			if (!result.issues.length) final.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: void 0,
				path: [key]
			});
			return;
		}
		if (result.value === void 0) {
			if (isPresent) final.value[key] = void 0;
		} else final.value[key] = result.value;
	}
	function normalizeDef(def) {
		const keys = Object.keys(def.shape);
		for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
		const okeys = optionalKeys(def.shape);
		return {
			...def,
			keys,
			keySet: new Set(keys),
			numKeys: keys.length,
			optionalKeys: new Set(okeys)
		};
	}
	function handleCatchall(proms, input, payload, ctx, def, inst) {
		const unrecognized = [];
		const keySet = def.keySet;
		const _catchall = def.catchall._zod;
		const t = _catchall.def.type;
		const isOptionalIn = _catchall.optin === "optional";
		const isOptionalOut = _catchall.optout === "optional";
		for (const key in input) {
			if (key === "__proto__") continue;
			if (keySet.has(key)) continue;
			if (t === "never") {
				unrecognized.push(key);
				continue;
			}
			const r = _catchall.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (unrecognized.length) payload.issues.push({
			code: "unrecognized_keys",
			keys: unrecognized,
			input,
			inst
		});
		if (!proms.length) return payload;
		return Promise.all(proms).then(() => {
			return payload;
		});
	}
	var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
		$ZodType.init(inst, def);
		if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
			const sh = def.shape;
			Object.defineProperty(def, "shape", { get: () => {
				const newSh = { ...sh };
				Object.defineProperty(def, "shape", { value: newSh });
				return newSh;
			} });
		}
		const _normalized = cached(() => normalizeDef(def));
		defineLazy(inst._zod, "propValues", () => {
			const shape = def.shape;
			const propValues = {};
			for (const key in shape) {
				const field = shape[key]._zod;
				if (field.values) {
					propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
					for (const v of field.values) propValues[key].add(v);
				}
			}
			return propValues;
		});
		const isObject$1 = isObject;
		const catchall = def.catchall;
		let value;
		inst._zod.parse = (payload, ctx) => {
			value ?? (value = _normalized.value);
			const input = payload.value;
			if (!isObject$1(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = {};
			const proms = [];
			const shape = value.shape;
			for (const key of value.keys) {
				const el = shape[key];
				const isOptionalIn = el._zod.optin === "optional";
				const isOptionalOut = el._zod.optout === "optional";
				const r = el._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
			return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
		};
	});
	var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
		$ZodObject.init(inst, def);
		const superParse = inst._zod.parse;
		const _normalized = cached(() => normalizeDef(def));
		const generateFastpass = (shape) => {
			const doc = new Doc([
				"shape",
				"payload",
				"ctx"
			]);
			const normalized = _normalized.value;
			const parseStr = (key) => {
				const k = esc(key);
				return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
			};
			doc.write(`const input = payload.value;`);
			const ids = Object.create(null);
			let counter = 0;
			for (const key of normalized.keys) ids[key] = `key_${counter++}`;
			doc.write(`const newResult = {};`);
			for (const key of normalized.keys) {
				const id = ids[key];
				const k = esc(key);
				const schema = shape[key];
				const isOptionalIn = schema?._zod?.optin === "optional";
				const isOptionalOut = schema?._zod?.optout === "optional";
				doc.write(`const ${id} = ${parseStr(key)};`);
				if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
				else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			}
			doc.write(`payload.value = newResult;`);
			doc.write(`return payload;`);
			const fn = doc.compile();
			return (payload, ctx) => fn(shape, payload, ctx);
		};
		let fastpass;
		const isObject$2 = isObject;
		const jit = !globalConfig.jitless;
		const fastEnabled = jit && allowsEval.value;
		const catchall = def.catchall;
		let value;
		inst._zod.parse = (payload, ctx) => {
			value ?? (value = _normalized.value);
			const input = payload.value;
			if (!isObject$2(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
				if (!fastpass) fastpass = generateFastpass(def.shape);
				payload = fastpass(payload, ctx);
				if (!catchall) return payload;
				return handleCatchall([], input, payload, ctx, value, inst);
			}
			return superParse(payload, ctx);
		};
	});
	function handleUnionResults(results, final, inst, ctx) {
		for (const result of results) if (result.issues.length === 0) {
			final.value = result.value;
			return final;
		}
		const nonaborted = results.filter((r) => !aborted(r));
		if (nonaborted.length === 1) {
			final.value = nonaborted[0].value;
			return nonaborted[0];
		}
		final.issues.push({
			code: "invalid_union",
			input: final.value,
			inst,
			errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
		});
		return final;
	}
	var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
		defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
		defineLazy(inst._zod, "values", () => {
			if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
		});
		defineLazy(inst._zod, "pattern", () => {
			if (def.options.every((o) => o._zod.pattern)) {
				const patterns = def.options.map((o) => o._zod.pattern);
				return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
			}
		});
		const first = def.options.length === 1 ? def.options[0]._zod.run : null;
		inst._zod.parse = (payload, ctx) => {
			if (first) return first(payload, ctx);
			let async = false;
			const results = [];
			for (const option of def.options) {
				const result = option._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) {
					results.push(result);
					async = true;
				} else {
					if (result.issues.length === 0) return result;
					results.push(result);
				}
			}
			if (!async) return handleUnionResults(results, payload, inst, ctx);
			return Promise.all(results).then((results) => {
				return handleUnionResults(results, payload, inst, ctx);
			});
		};
	});
	var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			const left = def.left._zod.run({
				value: input,
				issues: []
			}, ctx);
			const right = def.right._zod.run({
				value: input,
				issues: []
			}, ctx);
			if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
				return handleIntersectionResults(payload, left, right);
			});
			return handleIntersectionResults(payload, left, right);
		};
	});
	function mergeValues(a, b) {
		if (a === b) return {
			valid: true,
			data: a
		};
		if (a instanceof Date && b instanceof Date && +a === +b) return {
			valid: true,
			data: a
		};
		if (isPlainObject(a) && isPlainObject(b)) {
			const bKeys = Object.keys(b);
			const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
			const newObj = {
				...a,
				...b
			};
			for (const key of sharedKeys) {
				const sharedValue = mergeValues(a[key], b[key]);
				if (!sharedValue.valid) return {
					valid: false,
					mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
				};
				newObj[key] = sharedValue.data;
			}
			return {
				valid: true,
				data: newObj
			};
		}
		if (Array.isArray(a) && Array.isArray(b)) {
			if (a.length !== b.length) return {
				valid: false,
				mergeErrorPath: []
			};
			const newArray = [];
			for (let index = 0; index < a.length; index++) {
				const itemA = a[index];
				const itemB = b[index];
				const sharedValue = mergeValues(itemA, itemB);
				if (!sharedValue.valid) return {
					valid: false,
					mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
				};
				newArray.push(sharedValue.data);
			}
			return {
				valid: true,
				data: newArray
			};
		}
		return {
			valid: false,
			mergeErrorPath: []
		};
	}
	function handleIntersectionResults(result, left, right) {
		const unrecKeys = /* @__PURE__ */ new Map();
		let unrecIssue;
		for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
			unrecIssue ?? (unrecIssue = iss);
			for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).l = true;
			}
		} else result.issues.push(iss);
		for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).r = true;
		}
		else result.issues.push(iss);
		const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
		if (bothKeys.length && unrecIssue) result.issues.push({
			...unrecIssue,
			keys: bothKeys
		});
		if (aborted(result)) return result;
		const merged = mergeValues(left.value, right.value);
		if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
		result.value = merged.data;
		return result;
	}
	var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!isPlainObject(input)) {
				payload.issues.push({
					expected: "record",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			const proms = [];
			const values = def.keyType._zod.values;
			if (values) {
				payload.value = {};
				const recordKeys = /* @__PURE__ */ new Set();
				for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
					recordKeys.add(typeof key === "number" ? key.toString() : key);
					const keyResult = def.keyType._zod.run({
						value: key,
						issues: []
					}, ctx);
					if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (keyResult.issues.length) {
						payload.issues.push({
							code: "invalid_key",
							origin: "record",
							issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
							input: key,
							path: [key],
							inst
						});
						continue;
					}
					const outKey = keyResult.value;
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[outKey] = result.value;
					}
				}
				let unrecognized;
				for (const key in input) if (!recordKeys.has(key)) {
					unrecognized = unrecognized ?? [];
					unrecognized.push(key);
				}
				if (unrecognized && unrecognized.length > 0) payload.issues.push({
					code: "unrecognized_keys",
					input,
					inst,
					keys: unrecognized
				});
			} else {
				payload.value = {};
				for (const key of Reflect.ownKeys(input)) {
					if (key === "__proto__") continue;
					if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
					let keyResult = def.keyType._zod.run({
						value: key,
						issues: []
					}, ctx);
					if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (typeof key === "string" && number$2.test(key) && keyResult.issues.length) {
						const retryResult = def.keyType._zod.run({
							value: Number(key),
							issues: []
						}, ctx);
						if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (retryResult.issues.length === 0) keyResult = retryResult;
					}
					if (keyResult.issues.length) {
						if (def.mode === "loose") payload.value[key] = input[key];
						else payload.issues.push({
							code: "invalid_key",
							origin: "record",
							issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
							input: key,
							path: [key],
							inst
						});
						continue;
					}
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[keyResult.value] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[keyResult.value] = result.value;
					}
				}
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
		$ZodType.init(inst, def);
		const values = getEnumValues(def.entries);
		const valuesSet = new Set(values);
		inst._zod.values = valuesSet;
		inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (valuesSet.has(input)) return payload;
			payload.issues.push({
				code: "invalid_value",
				values,
				input,
				inst
			});
			return payload;
		};
	});
	var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
		$ZodType.init(inst, def);
		if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
		const values = new Set(def.values);
		inst._zod.values = values;
		inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (values.has(input)) return payload;
			payload.issues.push({
				code: "invalid_value",
				values: def.values,
				input,
				inst
			});
			return payload;
		};
	});
	var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
			const _out = def.transform(payload.value, payload);
			if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
				payload.value = output;
				return payload;
			});
			if (_out instanceof Promise) throw new $ZodAsyncError();
			payload.value = _out;
			return payload;
		};
	});
	function handleOptionalResult(result, input) {
		if (result.issues.length && input === void 0) return {
			issues: [],
			value: void 0
		};
		return result;
	}
	var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		inst._zod.optout = "optional";
		defineLazy(inst._zod, "values", () => {
			return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
		});
		defineLazy(inst._zod, "pattern", () => {
			const pattern = def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (def.innerType._zod.optin === "optional") {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, payload.value));
				return handleOptionalResult(result, payload.value);
			}
			if (payload.value === void 0) return payload;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
		$ZodOptional.init(inst, def);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
		inst._zod.parse = (payload, ctx) => {
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
		defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
		defineLazy(inst._zod, "pattern", () => {
			const pattern = def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
		});
		defineLazy(inst._zod, "values", () => {
			return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (payload.value === null) return payload;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			if (payload.value === void 0) {
				payload.value = def.defaultValue;
				/**
				* $ZodDefault returns the default value immediately in forward direction.
				* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
				return payload;
			}
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
			return handleDefaultResult(result, def);
		};
	});
	function handleDefaultResult(payload, def) {
		if (payload.value === void 0) payload.value = def.defaultValue;
		return payload;
	}
	var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			if (payload.value === void 0) payload.value = def.defaultValue;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "values", () => {
			const v = def.innerType._zod.values;
			return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
			return handleNonOptionalResult(result, inst);
		};
	});
	function handleNonOptionalResult(payload, inst) {
		if (!payload.issues.length && payload.value === void 0) payload.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: payload.value,
			inst
		});
		return payload;
	}
	var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
		defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => {
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
				}
				return payload;
			});
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
			}
			return payload;
		};
	});
	var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "values", () => def.in._zod.values);
		defineLazy(inst._zod, "optin", () => def.in._zod.optin);
		defineLazy(inst._zod, "optout", () => def.out._zod.optout);
		defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") {
				const right = def.out._zod.run(payload, ctx);
				if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
				return handlePipeResult(right, def.in, ctx);
			}
			const left = def.in._zod.run(payload, ctx);
			if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
			return handlePipeResult(left, def.out, ctx);
		};
	});
	function handlePipeResult(left, next, ctx) {
		if (left.issues.length) {
			left.aborted = true;
			return left;
		}
		return next._zod.run({
			value: left.value,
			issues: left.issues
		}, ctx);
	}
	var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
		defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then(handleReadonlyResult);
			return handleReadonlyResult(result);
		};
	});
	function handleReadonlyResult(payload) {
		payload.value = Object.freeze(payload.value);
		return payload;
	}
	var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
		$ZodCheck.init(inst, def);
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _) => {
			return payload;
		};
		inst._zod.check = (payload) => {
			const input = payload.value;
			const r = def.fn(input);
			if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
			handleRefineResult(r, payload, input, inst);
		};
	});
	function handleRefineResult(result, payload, input, inst) {
		if (!result) {
			const _iss = {
				code: "custom",
				input,
				inst,
				path: [...inst._zod.def.path ?? []],
				continue: !inst._zod.def.abort
			};
			if (inst._zod.def.params) _iss.params = inst._zod.def.params;
			payload.issues.push(issue(_iss));
		}
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/registries.js
	var _a;
	var $ZodRegistry = class {
		constructor() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
		}
		add(schema, ..._meta) {
			const meta = _meta[0];
			this._map.set(schema, meta);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
			return this;
		}
		clear() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
			return this;
		}
		remove(schema) {
			const meta = this._map.get(schema);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
			this._map.delete(schema);
			return this;
		}
		get(schema) {
			const p = schema._zod.parent;
			if (p) {
				const pm = { ...this.get(p) ?? {} };
				delete pm.id;
				const f = {
					...pm,
					...this._map.get(schema)
				};
				return Object.keys(f).length ? f : void 0;
			}
			return this._map.get(schema);
		}
		has(schema) {
			return this._map.has(schema);
		}
	};
	function registry() {
		return new $ZodRegistry();
	}
	(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
	var globalRegistry = globalThis.__zod_globalRegistry;
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/api.js
	/* @__NO_SIDE_EFFECTS__ */
	function _string(Class, params) {
		return new Class({
			type: "string",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _email(Class, params) {
		return new Class({
			type: "string",
			format: "email",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _guid(Class, params) {
		return new Class({
			type: "string",
			format: "guid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _uuid(Class, params) {
		return new Class({
			type: "string",
			format: "uuid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _uuidv4(Class, params) {
		return new Class({
			type: "string",
			format: "uuid",
			check: "string_format",
			abort: false,
			version: "v4",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _uuidv6(Class, params) {
		return new Class({
			type: "string",
			format: "uuid",
			check: "string_format",
			abort: false,
			version: "v6",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _uuidv7(Class, params) {
		return new Class({
			type: "string",
			format: "uuid",
			check: "string_format",
			abort: false,
			version: "v7",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _url(Class, params) {
		return new Class({
			type: "string",
			format: "url",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _emoji(Class, params) {
		return new Class({
			type: "string",
			format: "emoji",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _nanoid(Class, params) {
		return new Class({
			type: "string",
			format: "nanoid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/**
	* @deprecated CUID v1 is deprecated by its authors due to information leakage
	* (timestamps embedded in the id). Use {@link _cuid2} instead.
	* See https://github.com/paralleldrive/cuid.
	*/
	/* @__NO_SIDE_EFFECTS__ */
	function _cuid(Class, params) {
		return new Class({
			type: "string",
			format: "cuid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _cuid2(Class, params) {
		return new Class({
			type: "string",
			format: "cuid2",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _ulid(Class, params) {
		return new Class({
			type: "string",
			format: "ulid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _xid(Class, params) {
		return new Class({
			type: "string",
			format: "xid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _ksuid(Class, params) {
		return new Class({
			type: "string",
			format: "ksuid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _ipv4(Class, params) {
		return new Class({
			type: "string",
			format: "ipv4",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _ipv6(Class, params) {
		return new Class({
			type: "string",
			format: "ipv6",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _cidrv4(Class, params) {
		return new Class({
			type: "string",
			format: "cidrv4",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _cidrv6(Class, params) {
		return new Class({
			type: "string",
			format: "cidrv6",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _base64(Class, params) {
		return new Class({
			type: "string",
			format: "base64",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _base64url(Class, params) {
		return new Class({
			type: "string",
			format: "base64url",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _e164(Class, params) {
		return new Class({
			type: "string",
			format: "e164",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _jwt(Class, params) {
		return new Class({
			type: "string",
			format: "jwt",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _isoDateTime(Class, params) {
		return new Class({
			type: "string",
			format: "datetime",
			check: "string_format",
			offset: false,
			local: false,
			precision: null,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _isoDate(Class, params) {
		return new Class({
			type: "string",
			format: "date",
			check: "string_format",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _isoTime(Class, params) {
		return new Class({
			type: "string",
			format: "time",
			check: "string_format",
			precision: null,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _isoDuration(Class, params) {
		return new Class({
			type: "string",
			format: "duration",
			check: "string_format",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _number(Class, params) {
		return new Class({
			type: "number",
			checks: [],
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _coercedNumber(Class, params) {
		return new Class({
			type: "number",
			coerce: true,
			checks: [],
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _int(Class, params) {
		return new Class({
			type: "number",
			check: "number_format",
			abort: false,
			format: "safeint",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _unknown(Class) {
		return new Class({ type: "unknown" });
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _never(Class, params) {
		return new Class({
			type: "never",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _lt(value, params) {
		return new $ZodCheckLessThan({
			check: "less_than",
			...normalizeParams(params),
			value,
			inclusive: false
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _lte(value, params) {
		return new $ZodCheckLessThan({
			check: "less_than",
			...normalizeParams(params),
			value,
			inclusive: true
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _gt(value, params) {
		return new $ZodCheckGreaterThan({
			check: "greater_than",
			...normalizeParams(params),
			value,
			inclusive: false
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _gte(value, params) {
		return new $ZodCheckGreaterThan({
			check: "greater_than",
			...normalizeParams(params),
			value,
			inclusive: true
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _multipleOf(value, params) {
		return new $ZodCheckMultipleOf({
			check: "multiple_of",
			...normalizeParams(params),
			value
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _maxLength(maximum, params) {
		return new $ZodCheckMaxLength({
			check: "max_length",
			...normalizeParams(params),
			maximum
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _minLength(minimum, params) {
		return new $ZodCheckMinLength({
			check: "min_length",
			...normalizeParams(params),
			minimum
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _length(length, params) {
		return new $ZodCheckLengthEquals({
			check: "length_equals",
			...normalizeParams(params),
			length
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _regex(pattern, params) {
		return new $ZodCheckRegex({
			check: "string_format",
			format: "regex",
			...normalizeParams(params),
			pattern
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _lowercase(params) {
		return new $ZodCheckLowerCase({
			check: "string_format",
			format: "lowercase",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _uppercase(params) {
		return new $ZodCheckUpperCase({
			check: "string_format",
			format: "uppercase",
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _includes(includes, params) {
		return new $ZodCheckIncludes({
			check: "string_format",
			format: "includes",
			...normalizeParams(params),
			includes
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _startsWith(prefix, params) {
		return new $ZodCheckStartsWith({
			check: "string_format",
			format: "starts_with",
			...normalizeParams(params),
			prefix
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _endsWith(suffix, params) {
		return new $ZodCheckEndsWith({
			check: "string_format",
			format: "ends_with",
			...normalizeParams(params),
			suffix
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _overwrite(tx) {
		return new $ZodCheckOverwrite({
			check: "overwrite",
			tx
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _normalize(form) {
		return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _trim() {
		return /* @__PURE__ */ _overwrite((input) => input.trim());
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _toLowerCase() {
		return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _toUpperCase() {
		return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _slugify() {
		return /* @__PURE__ */ _overwrite((input) => slugify(input));
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _array(Class, element, params) {
		return new Class({
			type: "array",
			element,
			...normalizeParams(params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _refine(Class, fn, _params) {
		return new Class({
			type: "custom",
			check: "custom",
			fn,
			...normalizeParams(_params)
		});
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _superRefine(fn, params) {
		const ch = /* @__PURE__ */ _check((payload) => {
			payload.addIssue = (issue$2) => {
				if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
				else {
					const _issue = issue$2;
					if (_issue.fatal) _issue.continue = false;
					_issue.code ?? (_issue.code = "custom");
					_issue.input ?? (_issue.input = payload.value);
					_issue.inst ?? (_issue.inst = ch);
					_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
					payload.issues.push(issue(_issue));
				}
			};
			return fn(payload.value, payload);
		}, params);
		return ch;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function _check(fn, params) {
		const ch = new $ZodCheck({
			check: "custom",
			...normalizeParams(params)
		});
		ch._zod.check = fn;
		return ch;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/to-json-schema.js
	function initializeContext(params) {
		let target = params?.target ?? "draft-2020-12";
		if (target === "draft-4") target = "draft-04";
		if (target === "draft-7") target = "draft-07";
		return {
			processors: params.processors ?? {},
			metadataRegistry: params?.metadata ?? globalRegistry,
			target,
			unrepresentable: params?.unrepresentable ?? "throw",
			override: params?.override ?? (() => {}),
			io: params?.io ?? "output",
			counter: 0,
			seen: /* @__PURE__ */ new Map(),
			cycles: params?.cycles ?? "ref",
			reused: params?.reused ?? "inline",
			external: params?.external ?? void 0
		};
	}
	function process(schema, ctx, _params = {
		path: [],
		schemaPath: []
	}) {
		var _a;
		const def = schema._zod.def;
		const seen = ctx.seen.get(schema);
		if (seen) {
			seen.count++;
			if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
			return seen.schema;
		}
		const result = {
			schema: {},
			count: 1,
			cycle: void 0,
			path: _params.path
		};
		ctx.seen.set(schema, result);
		const overrideSchema = schema._zod.toJSONSchema?.();
		if (overrideSchema) result.schema = overrideSchema;
		else {
			const params = {
				..._params,
				schemaPath: [..._params.schemaPath, schema],
				path: _params.path
			};
			if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
			else {
				const _json = result.schema;
				const processor = ctx.processors[def.type];
				if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
				processor(schema, ctx, _json, params);
			}
			const parent = schema._zod.parent;
			if (parent) {
				if (!result.ref) result.ref = parent;
				process(parent, ctx, params);
				ctx.seen.get(parent).isParent = true;
			}
		}
		const meta = ctx.metadataRegistry.get(schema);
		if (meta) Object.assign(result.schema, meta);
		if (ctx.io === "input" && isTransforming(schema)) {
			delete result.schema.examples;
			delete result.schema.default;
		}
		if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
		delete result.schema._prefault;
		return ctx.seen.get(schema).schema;
	}
	function extractDefs(ctx, schema) {
		const root = ctx.seen.get(schema);
		if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
		const idToSchema = /* @__PURE__ */ new Map();
		for (const entry of ctx.seen.entries()) {
			const id = ctx.metadataRegistry.get(entry[0])?.id;
			if (id) {
				const existing = idToSchema.get(id);
				if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
				idToSchema.set(id, entry[0]);
			}
		}
		const makeURI = (entry) => {
			const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
			if (ctx.external) {
				const externalId = ctx.external.registry.get(entry[0])?.id;
				const uriGenerator = ctx.external.uri ?? ((id) => id);
				if (externalId) return { ref: uriGenerator(externalId) };
				const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
				entry[1].defId = id;
				return {
					defId: id,
					ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
				};
			}
			if (entry[1] === root) return { ref: "#" };
			const defUriPrefix = `#/${defsSegment}/`;
			const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
			return {
				defId,
				ref: defUriPrefix + defId
			};
		};
		const extractToDef = (entry) => {
			if (entry[1].schema.$ref) return;
			const seen = entry[1];
			const { ref, defId } = makeURI(entry);
			seen.def = { ...seen.schema };
			if (defId) seen.defId = defId;
			const schema = seen.schema;
			for (const key in schema) delete schema[key];
			schema.$ref = ref;
		};
		if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
			const seen = entry[1];
			if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
		}
		for (const entry of ctx.seen.entries()) {
			const seen = entry[1];
			if (schema === entry[0]) {
				extractToDef(entry);
				continue;
			}
			if (ctx.external) {
				const ext = ctx.external.registry.get(entry[0])?.id;
				if (schema !== entry[0] && ext) {
					extractToDef(entry);
					continue;
				}
			}
			if (ctx.metadataRegistry.get(entry[0])?.id) {
				extractToDef(entry);
				continue;
			}
			if (seen.cycle) {
				extractToDef(entry);
				continue;
			}
			if (seen.count > 1) {
				if (ctx.reused === "ref") {
					extractToDef(entry);
					continue;
				}
			}
		}
	}
	function finalize(ctx, schema) {
		const root = ctx.seen.get(schema);
		if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
		const flattenRef = (zodSchema) => {
			const seen = ctx.seen.get(zodSchema);
			if (seen.ref === null) return;
			const schema = seen.def ?? seen.schema;
			const _cached = { ...schema };
			const ref = seen.ref;
			seen.ref = null;
			if (ref) {
				flattenRef(ref);
				const refSeen = ctx.seen.get(ref);
				const refSchema = refSeen.schema;
				if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
					schema.allOf = schema.allOf ?? [];
					schema.allOf.push(refSchema);
				} else Object.assign(schema, refSchema);
				Object.assign(schema, _cached);
				if (zodSchema._zod.parent === ref) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (!(key in _cached)) delete schema[key];
				}
				if (refSchema.$ref && refSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
				}
			}
			const parent = zodSchema._zod.parent;
			if (parent && parent !== ref) {
				flattenRef(parent);
				const parentSeen = ctx.seen.get(parent);
				if (parentSeen?.schema.$ref) {
					schema.$ref = parentSeen.schema.$ref;
					if (parentSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
					}
				}
			}
			ctx.override({
				zodSchema,
				jsonSchema: schema,
				path: seen.path ?? []
			});
		};
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		const result = {};
		if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
		else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
		else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
		else if (ctx.target === "openapi-3.0") {}
		if (ctx.external?.uri) {
			const id = ctx.external.registry.get(schema)?.id;
			if (!id) throw new Error("Schema is missing an `id` property");
			result.$id = ctx.external.uri(id);
		}
		Object.assign(result, root.def ?? root.schema);
		const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
		if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
		const defs = ctx.external?.defs ?? {};
		for (const entry of ctx.seen.entries()) {
			const seen = entry[1];
			if (seen.def && seen.defId) {
				if (seen.def.id === seen.defId) delete seen.def.id;
				defs[seen.defId] = seen.def;
			}
		}
		if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
		try {
			const finalized = JSON.parse(JSON.stringify(result));
			Object.defineProperty(finalized, "~standard", {
				value: {
					...schema["~standard"],
					jsonSchema: {
						input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
						output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
					}
				},
				enumerable: false,
				writable: false
			});
			return finalized;
		} catch (_err) {
			throw new Error("Error converting schema to JSON.");
		}
	}
	function isTransforming(_schema, _ctx) {
		const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
		if (ctx.seen.has(_schema)) return false;
		ctx.seen.add(_schema);
		const def = _schema._zod.def;
		if (def.type === "transform") return true;
		if (def.type === "array") return isTransforming(def.element, ctx);
		if (def.type === "set") return isTransforming(def.valueType, ctx);
		if (def.type === "lazy") return isTransforming(def.getter(), ctx);
		if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
		if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
		if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
		if (def.type === "pipe") return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
		if (def.type === "object") {
			for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
			return false;
		}
		if (def.type === "union") {
			for (const option of def.options) if (isTransforming(option, ctx)) return true;
			return false;
		}
		if (def.type === "tuple") {
			for (const item of def.items) if (isTransforming(item, ctx)) return true;
			if (def.rest && isTransforming(def.rest, ctx)) return true;
			return false;
		}
		return false;
	}
	/**
	* Creates a toJSONSchema method for a schema instance.
	* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
	*/
	var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
		const ctx = initializeContext({
			...params,
			processors
		});
		process(schema, ctx);
		extractDefs(ctx, schema);
		return finalize(ctx, schema);
	};
	var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
		const { libraryOptions, target } = params ?? {};
		const ctx = initializeContext({
			...libraryOptions ?? {},
			target,
			io,
			processors
		});
		process(schema, ctx);
		extractDefs(ctx, schema);
		return finalize(ctx, schema);
	};
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/core/json-schema-processors.js
	var formatMap = {
		guid: "uuid",
		url: "uri",
		datetime: "date-time",
		json_string: "json-string",
		regex: ""
	};
	var stringProcessor = (schema, ctx, _json, _params) => {
		const json = _json;
		json.type = "string";
		const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
		if (typeof minimum === "number") json.minLength = minimum;
		if (typeof maximum === "number") json.maxLength = maximum;
		if (format) {
			json.format = formatMap[format] ?? format;
			if (json.format === "") delete json.format;
			if (format === "time") delete json.format;
		}
		if (contentEncoding) json.contentEncoding = contentEncoding;
		if (patterns && patterns.size > 0) {
			const regexes = [...patterns];
			if (regexes.length === 1) json.pattern = regexes[0].source;
			else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
				...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
				pattern: regex.source
			}))];
		}
	};
	var numberProcessor = (schema, ctx, _json, _params) => {
		const json = _json;
		const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
		if (typeof format === "string" && format.includes("int")) json.type = "integer";
		else json.type = "number";
		const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
		const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
		const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
		if (exMin) if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
		else if (typeof minimum === "number") json.minimum = minimum;
		if (exMax) if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
		else if (typeof maximum === "number") json.maximum = maximum;
		if (typeof multipleOf === "number") json.multipleOf = multipleOf;
	};
	var neverProcessor = (_schema, _ctx, json, _params) => {
		json.not = {};
	};
	var unknownProcessor = (_schema, _ctx, _json, _params) => {};
	var enumProcessor = (schema, _ctx, json, _params) => {
		const def = schema._zod.def;
		const values = getEnumValues(def.entries);
		if (values.every((v) => typeof v === "number")) json.type = "number";
		if (values.every((v) => typeof v === "string")) json.type = "string";
		json.enum = values;
	};
	var literalProcessor = (schema, ctx, json, _params) => {
		const def = schema._zod.def;
		const vals = [];
		for (const val of def.values) if (val === void 0) {
			if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
		} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
		else vals.push(Number(val));
		else vals.push(val);
		if (vals.length === 0) {} else if (vals.length === 1) {
			const val = vals[0];
			json.type = val === null ? "null" : typeof val;
			if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
			else json.const = val;
		} else {
			if (vals.every((v) => typeof v === "number")) json.type = "number";
			if (vals.every((v) => typeof v === "string")) json.type = "string";
			if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
			if (vals.every((v) => v === null)) json.type = "null";
			json.enum = vals;
		}
	};
	var customProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
	};
	var transformProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
	};
	var arrayProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		const { minimum, maximum } = schema._zod.bag;
		if (typeof minimum === "number") json.minItems = minimum;
		if (typeof maximum === "number") json.maxItems = maximum;
		json.type = "array";
		json.items = process(def.element, ctx, {
			...params,
			path: [...params.path, "items"]
		});
	};
	var objectProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		json.type = "object";
		json.properties = {};
		const shape = def.shape;
		for (const key in shape) json.properties[key] = process(shape[key], ctx, {
			...params,
			path: [
				...params.path,
				"properties",
				key
			]
		});
		const allKeys = new Set(Object.keys(shape));
		const requiredKeys = new Set([...allKeys].filter((key) => {
			const v = def.shape[key]._zod;
			if (ctx.io === "input") return v.optin === void 0;
			else return v.optout === void 0;
		}));
		if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
		if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
		else if (!def.catchall) {
			if (ctx.io === "output") json.additionalProperties = false;
		} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	};
	var unionProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const isExclusive = def.inclusive === false;
		const options = def.options.map((x, i) => process(x, ctx, {
			...params,
			path: [
				...params.path,
				isExclusive ? "oneOf" : "anyOf",
				i
			]
		}));
		if (isExclusive) json.oneOf = options;
		else json.anyOf = options;
	};
	var intersectionProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const a = process(def.left, ctx, {
			...params,
			path: [
				...params.path,
				"allOf",
				0
			]
		});
		const b = process(def.right, ctx, {
			...params,
			path: [
				...params.path,
				"allOf",
				1
			]
		});
		const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
		json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	};
	var recordProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		json.type = "object";
		const keyType = def.keyType;
		const patterns = keyType._zod.bag?.patterns;
		if (def.mode === "loose" && patterns && patterns.size > 0) {
			const valueSchema = process(def.valueType, ctx, {
				...params,
				path: [
					...params.path,
					"patternProperties",
					"*"
				]
			});
			json.patternProperties = {};
			for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
		} else {
			if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process(def.keyType, ctx, {
				...params,
				path: [...params.path, "propertyNames"]
			});
			json.additionalProperties = process(def.valueType, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		}
		const keyValues = keyType._zod.values;
		if (keyValues) {
			const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
			if (validKeyValues.length > 0) json.required = validKeyValues;
		}
	};
	var nullableProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const inner = process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		if (ctx.target === "openapi-3.0") {
			seen.ref = def.innerType;
			json.nullable = true;
		} else json.anyOf = [inner, { type: "null" }];
	};
	var nonoptionalProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
	};
	var defaultProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		json.default = JSON.parse(JSON.stringify(def.defaultValue));
	};
	var prefaultProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
	};
	var catchProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		let catchValue;
		try {
			catchValue = def.catchValue(void 0);
		} catch {
			throw new Error("Dynamic catch values are not supported in JSON Schema");
		}
		json.default = catchValue;
	};
	var pipeProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
		process(innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = innerType;
	};
	var readonlyProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		json.readOnly = true;
	};
	var optionalProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
	};
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/classic/iso.js
	var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
		$ZodISODateTime.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	function datetime(params) {
		return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
	}
	var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
		$ZodISODate.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	function date(params) {
		return /* @__PURE__ */ _isoDate(ZodISODate, params);
	}
	var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
		$ZodISOTime.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	function time(params) {
		return /* @__PURE__ */ _isoTime(ZodISOTime, params);
	}
	var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
		$ZodISODuration.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	function duration(params) {
		return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/classic/errors.js
	var initializer = (inst, issues) => {
		$ZodError.init(inst, issues);
		inst.name = "ZodError";
		Object.defineProperties(inst, {
			format: { value: (mapper) => formatError(inst, mapper) },
			flatten: { value: (mapper) => flattenError(inst, mapper) },
			addIssue: { value: (issue) => {
				inst.issues.push(issue);
				inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
			} },
			addIssues: { value: (issues) => {
				inst.issues.push(...issues);
				inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
			} },
			isEmpty: { get() {
				return inst.issues.length === 0;
			} }
		});
	};
	var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, { Parent: Error });
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/classic/parse.js
	var parse = /* @__PURE__ */ _parse(ZodRealError);
	var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
	var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
	var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
	var encode = /* @__PURE__ */ _encode(ZodRealError);
	var decode = /* @__PURE__ */ _decode(ZodRealError);
	var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
	var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
	var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
	var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
	var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
	var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/classic/schemas.js
	var _installedGroups = /* @__PURE__ */ new WeakMap();
	function _installLazyMethods(inst, group, methods) {
		const proto = Object.getPrototypeOf(inst);
		let installed = _installedGroups.get(proto);
		if (!installed) {
			installed = /* @__PURE__ */ new Set();
			_installedGroups.set(proto, installed);
		}
		if (installed.has(group)) return;
		installed.add(group);
		for (const key in methods) {
			const fn = methods[key];
			Object.defineProperty(proto, key, {
				configurable: true,
				enumerable: false,
				get() {
					const bound = fn.bind(this);
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable: true,
						value: bound
					});
					return bound;
				},
				set(v) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable: true,
						value: v
					});
				}
			});
		}
	}
	var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
		$ZodType.init(inst, def);
		Object.assign(inst["~standard"], { jsonSchema: {
			input: createStandardJSONSchemaMethod(inst, "input"),
			output: createStandardJSONSchemaMethod(inst, "output")
		} });
		inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
		inst.def = def;
		inst.type = def.type;
		Object.defineProperty(inst, "_def", { value: def });
		inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
		inst.safeParse = (data, params) => safeParse(inst, data, params);
		inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
		inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
		inst.spa = inst.safeParseAsync;
		inst.encode = (data, params) => encode(inst, data, params);
		inst.decode = (data, params) => decode(inst, data, params);
		inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
		inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
		inst.safeEncode = (data, params) => safeEncode(inst, data, params);
		inst.safeDecode = (data, params) => safeDecode(inst, data, params);
		inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
		inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
		_installLazyMethods(inst, "ZodType", {
			check(...chks) {
				const def = this.def;
				return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)] }), { parent: true });
			},
			with(...chks) {
				return this.check(...chks);
			},
			clone(def, params) {
				return clone(this, def, params);
			},
			brand() {
				return this;
			},
			register(reg, meta) {
				reg.add(this, meta);
				return this;
			},
			refine(check, params) {
				return this.check(refine(check, params));
			},
			superRefine(refinement, params) {
				return this.check(superRefine(refinement, params));
			},
			overwrite(fn) {
				return this.check(/* @__PURE__ */ _overwrite(fn));
			},
			optional() {
				return optional(this);
			},
			exactOptional() {
				return exactOptional(this);
			},
			nullable() {
				return nullable(this);
			},
			nullish() {
				return optional(nullable(this));
			},
			nonoptional(params) {
				return nonoptional(this, params);
			},
			array() {
				return array(this);
			},
			or(arg) {
				return union([this, arg]);
			},
			and(arg) {
				return intersection(this, arg);
			},
			transform(tx) {
				return pipe(this, transform(tx));
			},
			default(d) {
				return _default(this, d);
			},
			prefault(d) {
				return prefault(this, d);
			},
			catch(params) {
				return _catch(this, params);
			},
			pipe(target) {
				return pipe(this, target);
			},
			readonly() {
				return readonly(this);
			},
			describe(description) {
				const cl = this.clone();
				globalRegistry.add(cl, { description });
				return cl;
			},
			meta(...args) {
				if (args.length === 0) return globalRegistry.get(this);
				const cl = this.clone();
				globalRegistry.add(cl, args[0]);
				return cl;
			},
			isOptional() {
				return this.safeParse(void 0).success;
			},
			isNullable() {
				return this.safeParse(null).success;
			},
			apply(fn) {
				return fn(this);
			}
		});
		Object.defineProperty(inst, "description", {
			get() {
				return globalRegistry.get(inst)?.description;
			},
			configurable: true
		});
		return inst;
	});
	/** @internal */
	var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
		$ZodString.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
		const bag = inst._zod.bag;
		inst.format = bag.format ?? null;
		inst.minLength = bag.minimum ?? null;
		inst.maxLength = bag.maximum ?? null;
		_installLazyMethods(inst, "_ZodString", {
			regex(...args) {
				return this.check(/* @__PURE__ */ _regex(...args));
			},
			includes(...args) {
				return this.check(/* @__PURE__ */ _includes(...args));
			},
			startsWith(...args) {
				return this.check(/* @__PURE__ */ _startsWith(...args));
			},
			endsWith(...args) {
				return this.check(/* @__PURE__ */ _endsWith(...args));
			},
			min(...args) {
				return this.check(/* @__PURE__ */ _minLength(...args));
			},
			max(...args) {
				return this.check(/* @__PURE__ */ _maxLength(...args));
			},
			length(...args) {
				return this.check(/* @__PURE__ */ _length(...args));
			},
			nonempty(...args) {
				return this.check(/* @__PURE__ */ _minLength(1, ...args));
			},
			lowercase(params) {
				return this.check(/* @__PURE__ */ _lowercase(params));
			},
			uppercase(params) {
				return this.check(/* @__PURE__ */ _uppercase(params));
			},
			trim() {
				return this.check(/* @__PURE__ */ _trim());
			},
			normalize(...args) {
				return this.check(/* @__PURE__ */ _normalize(...args));
			},
			toLowerCase() {
				return this.check(/* @__PURE__ */ _toLowerCase());
			},
			toUpperCase() {
				return this.check(/* @__PURE__ */ _toUpperCase());
			},
			slugify() {
				return this.check(/* @__PURE__ */ _slugify());
			}
		});
	});
	var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
		$ZodString.init(inst, def);
		_ZodString.init(inst, def);
		inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
		inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
		inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
		inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
		inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
		inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
		inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
		inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
		inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
		inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
		inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
		inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
		inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
		inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
		inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
		inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
		inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
		inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
		inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
		inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
		inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
		inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
		inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
		inst.datetime = (params) => inst.check(datetime(params));
		inst.date = (params) => inst.check(date(params));
		inst.time = (params) => inst.check(time(params));
		inst.duration = (params) => inst.check(duration(params));
	});
	function string(params) {
		return /* @__PURE__ */ _string(ZodString, params);
	}
	var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		_ZodString.init(inst, def);
	});
	var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
		$ZodEmail.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
		$ZodGUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
		$ZodUUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
		$ZodURL.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
		$ZodEmoji.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
		$ZodNanoID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	/**
	* @deprecated CUID v1 is deprecated by its authors due to information leakage
	* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
	* See https://github.com/paralleldrive/cuid.
	*/
	var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
		$ZodCUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
		$ZodCUID2.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
		$ZodULID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
		$ZodXID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
		$ZodKSUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
		$ZodIPv4.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
		$ZodIPv6.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
		$ZodCIDRv4.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
		$ZodCIDRv6.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
		$ZodBase64.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
		$ZodBase64URL.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
		$ZodE164.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
		$ZodJWT.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
		$ZodNumber.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
		_installLazyMethods(inst, "ZodNumber", {
			gt(value, params) {
				return this.check(/* @__PURE__ */ _gt(value, params));
			},
			gte(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			min(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			lt(value, params) {
				return this.check(/* @__PURE__ */ _lt(value, params));
			},
			lte(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			max(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			int(params) {
				return this.check(int(params));
			},
			safe(params) {
				return this.check(int(params));
			},
			positive(params) {
				return this.check(/* @__PURE__ */ _gt(0, params));
			},
			nonnegative(params) {
				return this.check(/* @__PURE__ */ _gte(0, params));
			},
			negative(params) {
				return this.check(/* @__PURE__ */ _lt(0, params));
			},
			nonpositive(params) {
				return this.check(/* @__PURE__ */ _lte(0, params));
			},
			multipleOf(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			step(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			finite() {
				return this;
			}
		});
		const bag = inst._zod.bag;
		inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
		inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
		inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
		inst.isFinite = true;
		inst.format = bag.format ?? null;
	});
	function number$1(params) {
		return /* @__PURE__ */ _number(ZodNumber, params);
	}
	var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
		$ZodNumberFormat.init(inst, def);
		ZodNumber.init(inst, def);
	});
	function int(params) {
		return /* @__PURE__ */ _int(ZodNumberFormat, params);
	}
	var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
		$ZodUnknown.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
	});
	function unknown() {
		return /* @__PURE__ */ _unknown(ZodUnknown);
	}
	var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
		$ZodNever.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
	});
	function never(params) {
		return /* @__PURE__ */ _never(ZodNever, params);
	}
	var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
		$ZodArray.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
		inst.element = def.element;
		_installLazyMethods(inst, "ZodArray", {
			min(n, params) {
				return this.check(/* @__PURE__ */ _minLength(n, params));
			},
			nonempty(params) {
				return this.check(/* @__PURE__ */ _minLength(1, params));
			},
			max(n, params) {
				return this.check(/* @__PURE__ */ _maxLength(n, params));
			},
			length(n, params) {
				return this.check(/* @__PURE__ */ _length(n, params));
			},
			unwrap() {
				return this.element;
			}
		});
	});
	function array(element, params) {
		return /* @__PURE__ */ _array(ZodArray, element, params);
	}
	var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
		$ZodObjectJIT.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
		defineLazy(inst, "shape", () => {
			return def.shape;
		});
		_installLazyMethods(inst, "ZodObject", {
			keyof() {
				return _enum(Object.keys(this._zod.def.shape));
			},
			catchall(catchall) {
				return this.clone({
					...this._zod.def,
					catchall
				});
			},
			passthrough() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			loose() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			strict() {
				return this.clone({
					...this._zod.def,
					catchall: never()
				});
			},
			strip() {
				return this.clone({
					...this._zod.def,
					catchall: void 0
				});
			},
			extend(incoming) {
				return extend(this, incoming);
			},
			safeExtend(incoming) {
				return safeExtend(this, incoming);
			},
			merge(other) {
				return merge(this, other);
			},
			pick(mask) {
				return pick(this, mask);
			},
			omit(mask) {
				return omit(this, mask);
			},
			partial(...args) {
				return partial(ZodOptional, this, args[0]);
			},
			required(...args) {
				return required(ZodNonOptional, this, args[0]);
			}
		});
	});
	function object(shape, params) {
		return new ZodObject({
			type: "object",
			shape: shape ?? {},
			...normalizeParams(params)
		});
	}
	var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
		$ZodUnion.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
		inst.options = def.options;
	});
	function union(options, params) {
		return new ZodUnion({
			type: "union",
			options,
			...normalizeParams(params)
		});
	}
	var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
		$ZodIntersection.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
	});
	function intersection(left, right) {
		return new ZodIntersection({
			type: "intersection",
			left,
			right
		});
	}
	var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
		$ZodRecord.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
		inst.keyType = def.keyType;
		inst.valueType = def.valueType;
	});
	function record(keyType, valueType, params) {
		if (!valueType || !valueType._zod) return new ZodRecord({
			type: "record",
			keyType: string(),
			valueType: keyType,
			...normalizeParams(valueType)
		});
		return new ZodRecord({
			type: "record",
			keyType,
			valueType,
			...normalizeParams(params)
		});
	}
	var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
		$ZodEnum.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
		inst.enum = def.entries;
		inst.options = Object.values(def.entries);
		const keys = new Set(Object.keys(def.entries));
		inst.extract = (values, params) => {
			const newEntries = {};
			for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
			else throw new Error(`Key ${value} not found in enum`);
			return new ZodEnum({
				...def,
				checks: [],
				...normalizeParams(params),
				entries: newEntries
			});
		};
		inst.exclude = (values, params) => {
			const newEntries = { ...def.entries };
			for (const value of values) if (keys.has(value)) delete newEntries[value];
			else throw new Error(`Key ${value} not found in enum`);
			return new ZodEnum({
				...def,
				checks: [],
				...normalizeParams(params),
				entries: newEntries
			});
		};
	});
	function _enum(values, params) {
		return new ZodEnum({
			type: "enum",
			entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
			...normalizeParams(params)
		});
	}
	var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
		$ZodLiteral.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
		inst.values = new Set(def.values);
		Object.defineProperty(inst, "value", { get() {
			if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
			return def.values[0];
		} });
	});
	function literal(value, params) {
		return new ZodLiteral({
			type: "literal",
			values: Array.isArray(value) ? value : [value],
			...normalizeParams(params)
		});
	}
	var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
		$ZodTransform.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
		inst._zod.parse = (payload, _ctx) => {
			if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
			payload.addIssue = (issue$1) => {
				if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
				else {
					const _issue = issue$1;
					if (_issue.fatal) _issue.continue = false;
					_issue.code ?? (_issue.code = "custom");
					_issue.input ?? (_issue.input = payload.value);
					_issue.inst ?? (_issue.inst = inst);
					payload.issues.push(issue(_issue));
				}
			};
			const output = def.transform(payload.value, payload);
			if (output instanceof Promise) return output.then((output) => {
				payload.value = output;
				return payload;
			});
			payload.value = output;
			return payload;
		};
	});
	function transform(fn) {
		return new ZodTransform({
			type: "transform",
			transform: fn
		});
	}
	var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
		$ZodOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function optional(innerType) {
		return new ZodOptional({
			type: "optional",
			innerType
		});
	}
	var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
		$ZodExactOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function exactOptional(innerType) {
		return new ZodExactOptional({
			type: "optional",
			innerType
		});
	}
	var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
		$ZodNullable.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function nullable(innerType) {
		return new ZodNullable({
			type: "nullable",
			innerType
		});
	}
	var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
		$ZodDefault.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
		inst.removeDefault = inst.unwrap;
	});
	function _default(innerType, defaultValue) {
		return new ZodDefault({
			type: "default",
			innerType,
			get defaultValue() {
				return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
			}
		});
	}
	var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
		$ZodPrefault.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function prefault(innerType, defaultValue) {
		return new ZodPrefault({
			type: "prefault",
			innerType,
			get defaultValue() {
				return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
			}
		});
	}
	var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
		$ZodNonOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function nonoptional(innerType, params) {
		return new ZodNonOptional({
			type: "nonoptional",
			innerType,
			...normalizeParams(params)
		});
	}
	var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
		$ZodCatch.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
		inst.removeCatch = inst.unwrap;
	});
	function _catch(innerType, catchValue) {
		return new ZodCatch({
			type: "catch",
			innerType,
			catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
		});
	}
	var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
		$ZodPipe.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
		inst.in = def.in;
		inst.out = def.out;
	});
	function pipe(in_, out) {
		return new ZodPipe({
			type: "pipe",
			in: in_,
			out
		});
	}
	var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
		$ZodReadonly.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	function readonly(innerType) {
		return new ZodReadonly({
			type: "readonly",
			innerType
		});
	}
	var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
		$ZodCustom.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
	});
	function refine(fn, _params = {}) {
		return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
	}
	function superRefine(fn, params) {
		return /* @__PURE__ */ _superRefine(fn, params);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/zod@4.4.1/node_modules/zod/v4/classic/coerce.js
	function number(params) {
		return /* @__PURE__ */ _coercedNumber(ZodNumber, params);
	}
	//#endregion
	//#region ../../packages/shared/src/resume-documents.ts
	/** Upper bound for a single resume-side upload (bytes). */
	var RESUME_UPLOAD_MAX_BYTES = 15 * 1024 * 1024;
	var resumeDocumentKindSchema = _enum([
		"resume",
		"cover_letter",
		"portfolio",
		"other"
	]);
	object({
		kind: resumeDocumentKindSchema,
		mimeType: _enum([
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		]),
		sizeBytes: number$1().int().positive().max(RESUME_UPLOAD_MAX_BYTES),
		fileName: string().trim().min(1).max(200).optional()
	});
	object({ finalizeUpload: literal(true) });
	var resumeUploadStatusSchema = _enum(["pending", "ready"]);
	var resumeRecordSchema = object({
		id: string(),
		kind: resumeDocumentKindSchema,
		mimeType: string(),
		sizeBytes: number$1().int(),
		checksum: string(),
		uploadStatus: resumeUploadStatusSchema,
		createdAt: string().datetime(),
		updatedAt: string().datetime()
	});
	object({ resume: resumeRecordSchema });
	object({
		downloadUrl: string().url(),
		expiresInSeconds: number$1().int()
	});
	object({
		resumeId: string(),
		uploadUrl: string().url(),
		method: literal("PUT"),
		headers: object({ "Content-Type": string() }),
		expiresInSeconds: number$1().int()
	});
	object({ resumes: array(resumeRecordSchema) });
	//#endregion
	//#region ../../packages/shared/src/answers/types.ts
	/** Product categories for profile and application answers. */
	var answerCategorySchema = _enum([
		"fact",
		"preference",
		"narrative"
	]);
	/** Where a resolved answer originated. */
	var answerSourceSchema = _enum([
		"user_edit",
		"profile",
		"account",
		"resume",
		"approved_reusable",
		"approved_generated",
		"draft_generated"
	]);
	/** Approval state for answers that may enter autofill. */
	var approvalStatusSchema = _enum([
		"confirmed",
		"draft",
		"rejected",
		"pending"
	]);
	object({
		key: string().min(1),
		value: string(),
		category: answerCategorySchema,
		source: answerSourceSchema,
		approval: approvalStatusSchema,
		label: string().optional()
	});
	//#endregion
	//#region ../../packages/shared/src/resume-extraction.ts
	/** Kind of structured claim extracted from a résumé. */
	var factProposalKindSchema = _enum([
		"work_experience",
		"education",
		"skill",
		"project",
		"contact",
		"summary"
	]);
	/** Source span citation inside extracted document text. */
	var factSourceSpanSchema = object({
		start: number$1().int().nonnegative(),
		end: number$1().int().nonnegative(),
		excerpt: string().optional()
	});
	/** Structured payload for a single résumé extraction proposal. */
	var factProposalPayloadSchema = object({
		company: string().nullable().optional(),
		title: string().nullable().optional(),
		startDate: string().nullable().optional(),
		endDate: string().nullable().optional(),
		description: string().nullable().optional(),
		school: string().nullable().optional(),
		degree: string().nullable().optional(),
		fieldOfStudy: string().nullable().optional(),
		name: string().nullable().optional(),
		category: string().nullable().optional(),
		yearsOfExperience: number$1().nullable().optional(),
		technologies: array(string()).optional(),
		achievements: array(string()).optional(),
		url: string().nullable().optional(),
		rawText: string().nullable().optional()
	});
	object({ proposals: array(object({
		id: string(),
		userId: string(),
		profileId: string().nullable(),
		resumeId: string(),
		kind: factProposalKindSchema,
		status: approvalStatusSchema,
		confidence: number$1().min(0).max(1),
		payload: factProposalPayloadSchema,
		sourceSpan: factSourceSpanSchema.nullable(),
		createdAt: string().datetime(),
		updatedAt: string().datetime(),
		reviewedAt: string().datetime().nullable()
	})) });
	object({
		action: _enum([
			"approve",
			"reject",
			"edit"
		]),
		/** Required when action is edit — replaces proposal payload before approval. */
		payload: factProposalPayloadSchema.optional(),
		profileId: string().optional()
	});
	var documentExtractionStatusSchema = _enum([
		"pending",
		"ready",
		"failed"
	]);
	object({
		id: string(),
		resumeId: string(),
		userId: string(),
		status: documentExtractionStatusSchema,
		extractorVersion: string(),
		extractedTextPreview: string().nullable(),
		errorMessage: string().nullable(),
		createdAt: string().datetime(),
		updatedAt: string().datetime()
	});
	object({
		summary: string().nullable(),
		workExperiences: array(object({
			company: string().nullable(),
			title: string().nullable(),
			startDate: string().nullable(),
			endDate: string().nullable(),
			description: string().nullable(),
			technologies: array(string()).default([]),
			achievements: array(string()).default([]),
			sourceSpan: factSourceSpanSchema.nullable().optional(),
			confidence: number$1().min(0).max(1).default(.5)
		})),
		education: array(object({
			school: string().nullable(),
			degree: string().nullable(),
			fieldOfStudy: string().nullable(),
			startDate: string().nullable(),
			endDate: string().nullable(),
			sourceSpan: factSourceSpanSchema.nullable().optional(),
			confidence: number$1().min(0).max(1).default(.5)
		})),
		skills: array(object({
			name: string().nullable(),
			category: string().nullable(),
			yearsOfExperience: number$1().nullable(),
			confidence: number$1().min(0).max(1).default(.5)
		})),
		projects: array(object({
			name: string().nullable(),
			description: string().nullable(),
			url: string().nullable(),
			technologies: array(string()).default([]),
			confidence: number$1().min(0).max(1).default(.5)
		}))
	});
	//#endregion
	//#region ../../packages/shared/src/jobs/index.ts
	var jobPlatformSchema = _enum([
		"greenhouse",
		"lever",
		"ashby",
		"generic"
	]);
	object({ jobs: array(object({
		sourceUrl: string().url(),
		platform: jobPlatformSchema.default("generic"),
		company: string().trim().default(""),
		title: string().trim().default(""),
		location: string().trim().default(""),
		description: string().trim().default(""),
		requirements: string().trim().default(""),
		extractorVersion: string().trim().default("job-extract-v1"),
		rawEvidence: record(string(), unknown()).default({})
	}).extend({
		id: string(),
		userId: string(),
		createdAt: string().datetime(),
		updatedAt: string().datetime()
	})) });
	//#endregion
	//#region ../../packages/shared/src/applications/index.ts
	var applicationStatusSchema = _enum([
		"saved",
		"started",
		"applied",
		"interviewing",
		"offer",
		"rejected",
		"archived"
	]);
	object({
		profileId: string().nullable().optional(),
		jobPostingId: string().min(1),
		resumeId: string().nullable().optional(),
		status: applicationStatusSchema.default("saved"),
		notes: string().trim().default("")
	});
	object({
		status: applicationStatusSchema.optional(),
		notes: string().trim().optional(),
		profileId: string().nullable().optional(),
		resumeId: string().nullable().optional()
	});
	object({ applications: array(object({
		id: string(),
		userId: string(),
		profileId: string().nullable(),
		jobPostingId: string(),
		resumeId: string().nullable(),
		status: applicationStatusSchema,
		notes: string(),
		createdAt: string().datetime(),
		updatedAt: string().datetime()
	})) });
	//#endregion
	//#region ../../packages/shared/src/generation/index.ts
	var generatedDocumentKindSchema = _enum(["cover_letter", "open_ended_answer"]);
	object({
		kind: generatedDocumentKindSchema.default("cover_letter"),
		profileId: string().min(1),
		jobPostingId: string().min(1),
		/** Confirmed evidence strings the model may use — never invent beyond these. */
		evidence: array(object({
			id: string(),
			label: string(),
			value: string().min(1)
		})).min(1),
		question: string().trim().optional(),
		tone: _enum([
			"professional",
			"confident",
			"friendly"
		]).default("professional")
	});
	object({
		id: string(),
		userId: string(),
		profileId: string().nullable(),
		jobPostingId: string().nullable(),
		kind: generatedDocumentKindSchema,
		content: string(),
		status: _enum([
			"draft",
			"confirmed",
			"rejected"
		]),
		evidenceJson: object({
			factIds: array(string()),
			notes: string().optional()
		}),
		model: string(),
		promptVersion: string(),
		createdAt: string().datetime(),
		updatedAt: string().datetime(),
		approvedAt: string().datetime().nullable()
	});
	object({
		action: _enum([
			"approve",
			"reject",
			"edit"
		]),
		content: string().optional()
	});
	//#endregion
	//#region ../../packages/shared/src/index.ts
	var SEARCHPARTY_APP = {
		name: "SearchParty",
		webDevUrl: "http://localhost:3001"
	};
	var healthStatusSchema = _enum(["ok"]);
	object({
		app: literal(SEARCHPARTY_APP.name),
		status: healthStatusSchema,
		timestamp: string().datetime(),
		version: string()
	});
	var applicantProfileToneSchema = _enum([
		"professional",
		"confident",
		"friendly"
	]);
	var workExperienceInputSchema = object({
		company: string().trim().min(1, "Company is required"),
		title: string().trim().min(1, "Title is required"),
		startDate: string().trim().min(1, "Start date is required"),
		endDate: string().trim().optional().default(""),
		description: string().trim().optional().default(""),
		technologies: array(string().trim().min(1)).default([]),
		achievements: array(string().trim().min(1)).default([])
	});
	var profileSkillInputSchema = object({
		name: string().trim().min(1, "Skill name is required"),
		category: string().trim().min(1, "Skill category is required"),
		yearsOfExperience: number().min(0).max(80).default(0)
	});
	var profileProjectInputSchema = object({
		name: string().trim().min(1, "Project name is required"),
		description: string().trim().optional().default(""),
		technologies: array(string().trim().min(1)).default([]),
		url: string().trim().url().or(literal("")).default("")
	});
	var optionalUrl = string().trim().url().or(literal("")).optional().default("");
	/** Arbitrary onboarding answers keyed by profile-question field id (JSON-safe). */
	var profileOnboardingAnswersSchema = record(string(), unknown());
	object({ answers: profileOnboardingAnswersSchema });
	object({
		name: string().trim().min(1, "Profile name is required"),
		targetRole: string().trim().min(1, "Target role is required"),
		summary: string().trim().optional().default(""),
		preferredTone: applicantProfileToneSchema.default("professional"),
		firstName: string().trim().optional().default(""),
		lastName: string().trim().optional().default(""),
		phone: string().trim().optional().default(""),
		address: string().trim().optional().default(""),
		linkedinUrl: optionalUrl,
		githubUrl: optionalUrl,
		portfolioUrl: optionalUrl,
		onboardingAnswers: profileOnboardingAnswersSchema.default({}),
		workExperiences: array(workExperienceInputSchema).default([]),
		skills: array(profileSkillInputSchema).default([]),
		projects: array(profileProjectInputSchema).default([])
	}).partial();
	var workExperienceSchema = workExperienceInputSchema.extend({
		id: string(),
		profileId: string()
	});
	var profileSkillSchema = profileSkillInputSchema.extend({
		id: string(),
		profileId: string()
	});
	var profileProjectSchema = profileProjectInputSchema.extend({
		id: string(),
		profileId: string()
	});
	object({
		profiles: array(object({
			id: string(),
			userId: string(),
			name: string(),
			targetRole: string(),
			summary: string(),
			preferredTone: applicantProfileToneSchema,
			firstName: string(),
			lastName: string(),
			phone: string(),
			address: string(),
			linkedinUrl: string(),
			githubUrl: string(),
			portfolioUrl: string(),
			onboardingAnswers: profileOnboardingAnswersSchema,
			createdAt: string().datetime(),
			updatedAt: string().datetime(),
			workExperiences: array(workExperienceSchema),
			skills: array(profileSkillSchema),
			projects: array(profileProjectSchema)
		})),
		activeProfileId: string().nullable()
	});
	object({ profileId: string().nullable() });
	object({ user: object({
		id: string(),
		email: string().email(),
		name: string(),
		image: string().nullable().optional()
	}) });
	object({ name: string().trim().min(1, "Name is required") });
	var customUrlSchema = object({
		label: string().trim().min(1, "Label is required"),
		url: string().trim().url("Must be a valid URL")
	});
	object({
		firstName: string().trim().optional().default(""),
		lastName: string().trim().optional().default(""),
		phone: string().trim().optional().default(""),
		addressStreet: string().trim().optional().default(""),
		addressState: string().trim().optional().default(""),
		addressCity: string().trim().optional().default(""),
		addressZip: string().trim().optional().default(""),
		addressUnit: string().trim().optional().default(""),
		urls: array(customUrlSchema).default([])
	}).extend({
		accountOnboardingCompletedAt: string().datetime().nullable(),
		accountOnboardingAnswers: profileOnboardingAnswersSchema
	});
	//#endregion
	//#region entrypoints/background.ts
	var DEBUG_INGEST_URL = "http://127.0.0.1:7539/ingest/0a8e9746-11ca-43d9-8b26-b8265e0be1a8";
	var DEBUG_SESSION = "210883";
	/**
	* Injected into the page **MAIN** world so page JS (React, ATS widgets) observes
	* `HTMLInputElement.files` and bubbling events. Must stay self-contained.
	*/
	function searchPartyMainWorldAssignResume(arg) {
		const el = document.querySelector(arg.selector);
		if (!el || !(el instanceof HTMLInputElement)) return {
			ok: false,
			reason: "Tagged field was not found or is not an input.",
			filesLen: 0
		};
		if (el.type !== "file") return {
			ok: false,
			reason: "Tagged input is not type=file.",
			filesLen: 0
		};
		let bytes;
		const rawBuf = arg.buffer;
		if (rawBuf instanceof ArrayBuffer) bytes = new Uint8Array(rawBuf);
		else if (ArrayBuffer.isView(rawBuf)) {
			const v = rawBuf;
			bytes = new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength));
		} else return {
			ok: false,
			reason: "Invalid résumé byte payload.",
			filesLen: 0
		};
		const file = new File([new Uint8Array(bytes)], arg.fileName, { type: arg.mimeType || "application/pdf" });
		const dt = new DataTransfer();
		dt.items.add(file);
		el.files = dt.files;
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
		el.dispatchEvent(new Event("blur", { bubbles: true }));
		const filesLen = el.files?.length ?? 0;
		return {
			ok: filesLen === 1,
			reason: filesLen === 1 ? void 0 : "The file input did not accept the attachment.",
			filesLen
		};
	}
	var background_default = defineBackground(() => {
		applyPanelOpenBehavior();
		browser.runtime.onInstalled.addListener(() => {
			applyPanelOpenBehavior();
		});
		browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (typeof message === "object" && message !== null && "type" in message && message.type === "searchPartyPreferencesChanged") applyPanelOpenBehavior();
			if (typeof message === "object" && message !== null && "type" in message && message.type === "searchparty/debug-agent-log") {
				const payload = message;
				fetch(DEBUG_INGEST_URL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Debug-Session-Id": DEBUG_SESSION
					},
					body: JSON.stringify({
						sessionId: DEBUG_SESSION,
						timestamp: Date.now(),
						...payload
					})
				}).catch(() => {});
			}
			if (typeof message === "object" && message !== null && "type" in message && message.type === "searchparty/extension/fetch-blob" && "url" in message && typeof message.url === "string") {
				const url = message.url.trim();
				if (!/^https?:\/\//i.test(url)) {
					sendResponse({
						ok: false,
						error: "Only http(s) download URLs are allowed."
					});
					return;
				}
				(async () => {
					let host = "";
					try {
						host = new URL(url).hostname;
					} catch {
						host = "(invalid)";
					}
					try {
						const res = await fetch(url);
						if (!res.ok) {
							sendResponse({
								ok: false,
								error: `HTTP ${String(res.status)}`
							});
							return;
						}
						const lenHeader = res.headers.get("content-length");
						if (lenHeader) {
							const n = Number(lenHeader);
							if (Number.isFinite(n) && n > 8388608) {
								sendResponse({
									ok: false,
									error: "Résumé exceeds the autofill size limit."
								});
								return;
							}
						}
						const buffer = await res.arrayBuffer();
						if (buffer.byteLength > 8388608) {
							sendResponse({
								ok: false,
								error: "Résumé exceeds the autofill size limit."
							});
							return;
						}
						const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "application/octet-stream";
						fetch(DEBUG_INGEST_URL, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-Debug-Session-Id": DEBUG_SESSION
							},
							body: JSON.stringify({
								sessionId: DEBUG_SESSION,
								timestamp: Date.now(),
								hypothesisId: "H-bg-fetch",
								location: "background.ts:fetch-blob",
								message: "Background fetch resume ok",
								data: {
									host,
									bytes: buffer.byteLength,
									contentType
								}
							})
						}).catch(() => {});
						sendResponse({
							ok: true,
							buffer,
							contentType
						});
					} catch (error) {
						const errMsg = error instanceof Error ? error.message : String(error);
						fetch(DEBUG_INGEST_URL, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-Debug-Session-Id": DEBUG_SESSION
							},
							body: JSON.stringify({
								sessionId: DEBUG_SESSION,
								timestamp: Date.now(),
								hypothesisId: "H-bg-fetch-err",
								location: "background.ts:fetch-blob",
								message: "Background fetch resume failed",
								data: {
									host,
									errMsg
								}
							})
						}).catch(() => {});
						sendResponse({
							ok: false,
							error: errMsg
						});
					}
				})();
				return true;
			}
			if (typeof message === "object" && message !== null && "type" in message && message.type === "searchparty/extension/main-world-assign-file" && "selector" in message && "buffer" in message && "fileName" in message && "mimeType" in message) {
				const tabId = sender.tab?.id;
				if (tabId === void 0) {
					sendResponse({
						ok: false,
						error: "No sender tab for MAIN-world assign."
					});
					return;
				}
				const payload = message;
				(async () => {
					try {
						const result = (await browser.scripting.executeScript({
							target: { tabId },
							world: "MAIN",
							func: searchPartyMainWorldAssignResume,
							args: [{
								selector: payload.selector,
								buffer: payload.buffer,
								fileName: payload.fileName,
								mimeType: payload.mimeType
							}]
						}))[0]?.result;
						fetch(DEBUG_INGEST_URL, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-Debug-Session-Id": DEBUG_SESSION
							},
							body: JSON.stringify({
								sessionId: DEBUG_SESSION,
								timestamp: Date.now(),
								hypothesisId: "H-main-world-exec",
								location: "background.ts:main-world-assign",
								message: "MAIN world resume assign finished",
								data: {
									ok: result?.ok ?? false,
									filesLen: result?.filesLen
								}
							})
						}).catch(() => {});
						sendResponse({
							ok: true,
							result: result ?? {
								ok: false,
								reason: "No injection result."
							}
						});
					} catch (error) {
						const errMsg = error instanceof Error ? error.message : String(error);
						fetch(DEBUG_INGEST_URL, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"X-Debug-Session-Id": DEBUG_SESSION
							},
							body: JSON.stringify({
								sessionId: DEBUG_SESSION,
								timestamp: Date.now(),
								hypothesisId: "H-main-world-exec-err",
								location: "background.ts:main-world-assign",
								message: "executeScript failed",
								data: { errMsg }
							})
						}).catch(() => {});
						sendResponse({
							ok: false,
							error: errMsg
						});
					}
				})();
				return true;
			}
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJfYSIsIkYiLCJpbml0aWFsaXplciIsInV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyIiwiY29yZS4kWm9kQXN5bmNFcnJvciIsInV0aWwuZmluYWxpemVJc3N1ZSIsImNvcmUuY29uZmlnIiwiZXJyb3JzLiRab2RFcnJvciIsInNhZmVQYXJzZSIsImVycm9ycy4kWm9kUmVhbEVycm9yIiwic2FmZVBhcnNlQXN5bmMiLCJkdXJhdGlvbiIsIl9lbW9qaSIsImRhdGUiLCJ0aW1lIiwiZGF0ZXRpbWUiLCJzdHJpbmciLCJudW1iZXIiLCJ1dGlsLmZsb2F0U2FmZVJlbWFpbmRlciIsInV0aWwuTlVNQkVSX0ZPUk1BVF9SQU5HRVMiLCJyZWdleGVzLmludGVnZXIiLCJ1dGlsLm51bGxpc2giLCJ1dGlsLmdldExlbmd0aGFibGVPcmlnaW4iLCJyZWdleGVzLmxvd2VyY2FzZSIsInJlZ2V4ZXMudXBwZXJjYXNlIiwidXRpbC5lc2NhcGVSZWdleCIsImNvbnRlbnQiLCJ1dGlsLmFib3J0ZWQiLCJ1dGlsLmV4cGxpY2l0bHlBYm9ydGVkIiwiY29yZS4kWm9kQXN5bmNFcnJvciIsInNhZmVQYXJzZSIsInNhZmVQYXJzZUFzeW5jIiwicmVnZXhlcy5zdHJpbmciLCJyZWdleGVzLmd1aWQiLCJyZWdleGVzLnV1aWQiLCJyZWdleGVzLmVtYWlsIiwicmVnZXhlcy5lbW9qaSIsInJlZ2V4ZXMubmFub2lkIiwicmVnZXhlcy5jdWlkIiwicmVnZXhlcy5jdWlkMiIsInJlZ2V4ZXMudWxpZCIsInJlZ2V4ZXMueGlkIiwicmVnZXhlcy5rc3VpZCIsInJlZ2V4ZXMuZGF0ZXRpbWUiLCJyZWdleGVzLmRhdGUiLCJyZWdleGVzLnRpbWUiLCJyZWdleGVzLmR1cmF0aW9uIiwicmVnZXhlcy5pcHY0IiwicmVnZXhlcy5pcHY2IiwicmVnZXhlcy5jaWRydjQiLCJyZWdleGVzLmNpZHJ2NiIsInJlZ2V4ZXMuYmFzZTY0IiwicmVnZXhlcy5iYXNlNjR1cmwiLCJyZWdleGVzLmUxNjQiLCJyZWdleGVzLm51bWJlciIsInV0aWwucHJlZml4SXNzdWVzIiwidXRpbC5vcHRpb25hbEtleXMiLCJ1dGlsLmNhY2hlZCIsImlzT2JqZWN0IiwidXRpbC5pc09iamVjdCIsInV0aWwuZXNjIiwiYWxsb3dzRXZhbCIsInV0aWwuYWxsb3dzRXZhbCIsInV0aWwuZmluYWxpemVJc3N1ZSIsImNvcmUuY29uZmlnIiwidXRpbC5jbGVhblJlZ2V4IiwidXRpbC5pc1BsYWluT2JqZWN0IiwidXRpbC5nZXRFbnVtVmFsdWVzIiwidXRpbC5lc2NhcGVSZWdleCIsImNvcmUuJFpvZEVuY29kZUVycm9yIiwidXRpbC5pc3N1ZSIsInV0aWwubm9ybWFsaXplUGFyYW1zIiwiY2hlY2tzLiRab2RDaGVja0xlc3NUaGFuIiwiY2hlY2tzLiRab2RDaGVja0dyZWF0ZXJUaGFuIiwiY2hlY2tzLiRab2RDaGVja011bHRpcGxlT2YiLCJjaGVja3MuJFpvZENoZWNrTWF4TGVuZ3RoIiwiY2hlY2tzLiRab2RDaGVja01pbkxlbmd0aCIsImNoZWNrcy4kWm9kQ2hlY2tMZW5ndGhFcXVhbHMiLCJjaGVja3MuJFpvZENoZWNrUmVnZXgiLCJjaGVja3MuJFpvZENoZWNrTG93ZXJDYXNlIiwiY2hlY2tzLiRab2RDaGVja1VwcGVyQ2FzZSIsImNoZWNrcy4kWm9kQ2hlY2tJbmNsdWRlcyIsImNoZWNrcy4kWm9kQ2hlY2tTdGFydHNXaXRoIiwiY2hlY2tzLiRab2RDaGVja0VuZHNXaXRoIiwiY2hlY2tzLiRab2RDaGVja092ZXJ3cml0ZSIsInV0aWwuc2x1Z2lmeSIsImlzc3VlIiwidXRpbC5pc3N1ZSIsImNoZWNrcy4kWm9kQ2hlY2siLCJjb3JlLl9pc29EYXRlVGltZSIsImNvcmUuX2lzb0RhdGUiLCJjb3JlLl9pc29UaW1lIiwiY29yZS5faXNvRHVyYXRpb24iLCJjb3JlLmZvcm1hdEVycm9yIiwiY29yZS5mbGF0dGVuRXJyb3IiLCJ1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlciIsInBhcnNlLnBhcnNlIiwicGFyc2Uuc2FmZVBhcnNlIiwicGFyc2UucGFyc2VBc3luYyIsInBhcnNlLnNhZmVQYXJzZUFzeW5jIiwicGFyc2UuZW5jb2RlIiwicGFyc2UuZGVjb2RlIiwicGFyc2UuZW5jb2RlQXN5bmMiLCJwYXJzZS5kZWNvZGVBc3luYyIsInBhcnNlLnNhZmVFbmNvZGUiLCJwYXJzZS5zYWZlRGVjb2RlIiwicGFyc2Uuc2FmZUVuY29kZUFzeW5jIiwicGFyc2Uuc2FmZURlY29kZUFzeW5jIiwidXRpbC5tZXJnZURlZnMiLCJjb3JlLmNsb25lIiwiY2hlY2tzLm92ZXJ3cml0ZSIsInByb2Nlc3NvcnMuc3RyaW5nUHJvY2Vzc29yIiwiY2hlY2tzLnJlZ2V4IiwiY2hlY2tzLmluY2x1ZGVzIiwiY2hlY2tzLnN0YXJ0c1dpdGgiLCJjaGVja3MuZW5kc1dpdGgiLCJjaGVja3MubWluTGVuZ3RoIiwiY2hlY2tzLm1heExlbmd0aCIsImNoZWNrcy5sZW5ndGgiLCJjaGVja3MubG93ZXJjYXNlIiwiY2hlY2tzLnVwcGVyY2FzZSIsImNoZWNrcy50cmltIiwiY2hlY2tzLm5vcm1hbGl6ZSIsImNoZWNrcy50b0xvd2VyQ2FzZSIsImNoZWNrcy50b1VwcGVyQ2FzZSIsImNoZWNrcy5zbHVnaWZ5IiwiY29yZS5fZW1haWwiLCJjb3JlLl91cmwiLCJjb3JlLl9qd3QiLCJjb3JlLl9lbW9qaSIsImNvcmUuX2d1aWQiLCJjb3JlLl91dWlkIiwiY29yZS5fdXVpZHY0IiwiY29yZS5fdXVpZHY2IiwiY29yZS5fdXVpZHY3IiwiY29yZS5fbmFub2lkIiwiY29yZS5fY3VpZCIsImNvcmUuX2N1aWQyIiwiY29yZS5fdWxpZCIsImNvcmUuX2Jhc2U2NCIsImNvcmUuX2Jhc2U2NHVybCIsImNvcmUuX3hpZCIsImNvcmUuX2tzdWlkIiwiY29yZS5faXB2NCIsImNvcmUuX2lwdjYiLCJjb3JlLl9jaWRydjQiLCJjb3JlLl9jaWRydjYiLCJjb3JlLl9lMTY0IiwiaXNvLmRhdGV0aW1lIiwiaXNvLmRhdGUiLCJpc28udGltZSIsImlzby5kdXJhdGlvbiIsImNvcmUuX3N0cmluZyIsInByb2Nlc3NvcnMubnVtYmVyUHJvY2Vzc29yIiwiY2hlY2tzLmd0IiwiY2hlY2tzLmd0ZSIsImNoZWNrcy5sdCIsImNoZWNrcy5sdGUiLCJjaGVja3MubXVsdGlwbGVPZiIsIm51bWJlciIsImNvcmUuX251bWJlciIsImNvcmUuX2ludCIsInByb2Nlc3NvcnMudW5rbm93blByb2Nlc3NvciIsImNvcmUuX3Vua25vd24iLCJwcm9jZXNzb3JzLm5ldmVyUHJvY2Vzc29yIiwiY29yZS5fbmV2ZXIiLCJwcm9jZXNzb3JzLmFycmF5UHJvY2Vzc29yIiwiY29yZS5fYXJyYXkiLCJwcm9jZXNzb3JzLm9iamVjdFByb2Nlc3NvciIsInV0aWwuZXh0ZW5kIiwidXRpbC5zYWZlRXh0ZW5kIiwidXRpbC5tZXJnZSIsInV0aWwucGljayIsInV0aWwub21pdCIsInV0aWwucGFydGlhbCIsInV0aWwucmVxdWlyZWQiLCJ1dGlsLm5vcm1hbGl6ZVBhcmFtcyIsInByb2Nlc3NvcnMudW5pb25Qcm9jZXNzb3IiLCJwcm9jZXNzb3JzLmludGVyc2VjdGlvblByb2Nlc3NvciIsInByb2Nlc3NvcnMucmVjb3JkUHJvY2Vzc29yIiwicHJvY2Vzc29ycy5lbnVtUHJvY2Vzc29yIiwicHJvY2Vzc29ycy5saXRlcmFsUHJvY2Vzc29yIiwicHJvY2Vzc29ycy50cmFuc2Zvcm1Qcm9jZXNzb3IiLCJjb3JlLiRab2RFbmNvZGVFcnJvciIsImlzc3VlIiwidXRpbC5pc3N1ZSIsInByb2Nlc3NvcnMub3B0aW9uYWxQcm9jZXNzb3IiLCJwcm9jZXNzb3JzLm51bGxhYmxlUHJvY2Vzc29yIiwicHJvY2Vzc29ycy5kZWZhdWx0UHJvY2Vzc29yIiwidXRpbC5zaGFsbG93Q2xvbmUiLCJwcm9jZXNzb3JzLnByZWZhdWx0UHJvY2Vzc29yIiwicHJvY2Vzc29ycy5ub25vcHRpb25hbFByb2Nlc3NvciIsInByb2Nlc3NvcnMuY2F0Y2hQcm9jZXNzb3IiLCJwcm9jZXNzb3JzLnBpcGVQcm9jZXNzb3IiLCJwcm9jZXNzb3JzLnJlYWRvbmx5UHJvY2Vzc29yIiwicHJvY2Vzc29ycy5jdXN0b21Qcm9jZXNzb3IiLCJjb3JlLl9yZWZpbmUiLCJjb3JlLl9zdXBlclJlZmluZSIsImNvcmUuX2NvZXJjZWROdW1iZXIiLCJzY2hlbWFzLlpvZE51bWJlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yNV9AdHlwZXMrbm9kZUAyMi4xOS4xN19lc2xpbnRAOS4zOS40X2ppdGlAMi42LjFfX2ppdGlAMi42LjFfdHN4QDQuMjEuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvZGVmaW5lLWJhY2tncm91bmQubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B3eHQtZGV2K2Jyb3dzZXJAMC4xLjQwL25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjVfQHR5cGVzK25vZGVAMjIuMTkuMTdfZXNsaW50QDkuMzkuNF9qaXRpQDIuNi4xX19qaXRpQDIuNi4xX3RzeEA0LjIxLjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIubWpzIiwiLi4vLi4vbGliL2V4dGVuc2lvbi1wcmVmZXJlbmNlcy50cyIsIi4uLy4uL2xpYi9hZ2VudC1kZWJ1Zy1sb2cudHMiLCIuLi8uLi9saWIvZXh0ZW5zaW9uLWZldGNoLWJsb2IudHMiLCIuLi8uLi9saWIvZXh0ZW5zaW9uLW1haW4td29ybGQtYXNzaWduLnRzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvY29yZS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjEvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL3V0aWwuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9lcnJvcnMuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9wYXJzZS5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjEvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL3JlZ2V4ZXMuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9jaGVja3MuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9kb2MuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS92ZXJzaW9ucy5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RANC40LjEvbm9kZV9tb2R1bGVzL3pvZC92NC9jb3JlL3NjaGVtYXMuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9yZWdpc3RyaWVzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvYXBpLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NvcmUvdG8tanNvbi1zY2hlbWEuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY29yZS9qc29uLXNjaGVtYS1wcm9jZXNzb3JzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NsYXNzaWMvaXNvLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NsYXNzaWMvZXJyb3JzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NsYXNzaWMvcGFyc2UuanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDQuNC4xL25vZGVfbW9kdWxlcy96b2QvdjQvY2xhc3NpYy9zY2hlbWFzLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEA0LjQuMS9ub2RlX21vZHVsZXMvem9kL3Y0L2NsYXNzaWMvY29lcmNlLmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9yZXN1bWUtZG9jdW1lbnRzLnRzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9hbnN3ZXJzL3R5cGVzLnRzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9yZXN1bWUtZXh0cmFjdGlvbi50cyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvam9icy9pbmRleC50cyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3NoYXJlZC9zcmMvYXBwbGljYXRpb25zL2luZGV4LnRzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9nZW5lcmF0aW9uL2luZGV4LnRzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvc2hhcmVkL3NyYy9pbmRleC50cyIsIi4uLy4uL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHdlYmV4dC1jb3JlK21hdGNoLXBhdHRlcm5zQDEuMC4zL25vZGVfbW9kdWxlcy9Ad2ViZXh0LWNvcmUvbWF0Y2gtcGF0dGVybnMvbGliL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vI3JlZ2lvbiBzcmMvdXRpbHMvZGVmaW5lLWJhY2tncm91bmQudHNcbmZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG5cdGlmIChhcmcgPT0gbnVsbCB8fCB0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuXHRyZXR1cm4gYXJnO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVCYWNrZ3JvdW5kIH07XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiZXhwb3J0IHR5cGUgRXh0ZW5zaW9uVGhlbWVQcmVmZXJlbmNlID1cbiAgfCBcImxpZ2h0XCJcbiAgfCBcImRhcmtcIlxuICB8IFwic3lzdGVtXCI7XG5cbmV4cG9ydCB0eXBlIEV4dGVuc2lvbk9wZW5CZWhhdmlvciA9IFwicG9wdXBcIiB8IFwic2lkZXBhbmVsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZW5zaW9uUHJlZmVyZW5jZXMge1xuICB0aGVtZTogRXh0ZW5zaW9uVGhlbWVQcmVmZXJlbmNlO1xuICBvcGVuQmVoYXZpb3I6IEV4dGVuc2lvbk9wZW5CZWhhdmlvcjtcbn1cblxuZXhwb3J0IGNvbnN0IGV4dGVuc2lvblByZWZlcmVuY2VLZXlzID0ge1xuICB0aGVtZTogXCJzZWFyY2hQYXJ0eVRoZW1lUHJlZmVyZW5jZVwiLFxuICBvcGVuQmVoYXZpb3I6IFwic2VhcmNoUGFydHlPcGVuQmVoYXZpb3JcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBleHRlbnNpb25QcmVmZXJlbmNlTWVzc2FnZVR5cGUgPVxuICBcInNlYXJjaFBhcnR5UHJlZmVyZW5jZXNDaGFuZ2VkXCI7XG5cbmNvbnN0IGRlZmF1bHRQcmVmZXJlbmNlczogRXh0ZW5zaW9uUHJlZmVyZW5jZXMgPSB7XG4gIHRoZW1lOiBcInN5c3RlbVwiLFxuICBvcGVuQmVoYXZpb3I6IFwic2lkZXBhbmVsXCIsXG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0RXh0ZW5zaW9uUHJlZmVyZW5jZXMoKTogUHJvbWlzZTxFeHRlbnNpb25QcmVmZXJlbmNlcz4ge1xuICBjb25zdCBzdG9yZWQgPSBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KFtcbiAgICBleHRlbnNpb25QcmVmZXJlbmNlS2V5cy50aGVtZSxcbiAgICBleHRlbnNpb25QcmVmZXJlbmNlS2V5cy5vcGVuQmVoYXZpb3IsXG4gIF0pO1xuXG4gIHJldHVybiB7XG4gICAgdGhlbWU6IHBhcnNlVGhlbWVQcmVmZXJlbmNlKFxuICAgICAgc3RvcmVkW2V4dGVuc2lvblByZWZlcmVuY2VLZXlzLnRoZW1lXVxuICAgICksXG4gICAgb3BlbkJlaGF2aW9yOiBwYXJzZU9wZW5CZWhhdmlvcihcbiAgICAgIHN0b3JlZFtleHRlbnNpb25QcmVmZXJlbmNlS2V5cy5vcGVuQmVoYXZpb3JdXG4gICAgKSxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNldFRoZW1lUHJlZmVyZW5jZShcbiAgdGhlbWU6IEV4dGVuc2lvblRoZW1lUHJlZmVyZW5jZVxuKSB7XG4gIGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5zZXQoe1xuICAgIFtleHRlbnNpb25QcmVmZXJlbmNlS2V5cy50aGVtZV06IHRoZW1lLFxuICB9KTtcbiAgYXBwbHlUaGVtZVByZWZlcmVuY2UodGhlbWUpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0T3BlbkJlaGF2aW9yUHJlZmVyZW5jZShcbiAgb3BlbkJlaGF2aW9yOiBFeHRlbnNpb25PcGVuQmVoYXZpb3Jcbikge1xuICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHtcbiAgICBbZXh0ZW5zaW9uUHJlZmVyZW5jZUtleXMub3BlbkJlaGF2aW9yXTogb3BlbkJlaGF2aW9yLFxuICB9KTtcbiAgYXdhaXQgbm90aWZ5UHJlZmVyZW5jZUNoYW5nZSgpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXBwbHlTdG9yZWRUaGVtZSgpIHtcbiAgY29uc3QgeyB0aGVtZSB9ID0gYXdhaXQgZ2V0RXh0ZW5zaW9uUHJlZmVyZW5jZXMoKTtcbiAgYXBwbHlUaGVtZVByZWZlcmVuY2UodGhlbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlUaGVtZVByZWZlcmVuY2UoXG4gIHRoZW1lOiBFeHRlbnNpb25UaGVtZVByZWZlcmVuY2Vcbikge1xuICBjb25zdCBwcmVmZXJzRGFyayA9XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHdpbmRvdy5tYXRjaE1lZGlhPy4oXCIocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspXCIpLm1hdGNoZXM7XG4gIGNvbnN0IHNob3VsZFVzZURhcmsgPVxuICAgIHRoZW1lID09PSBcImRhcmtcIiB8fCAodGhlbWUgPT09IFwic3lzdGVtXCIgJiYgcHJlZmVyc0RhcmspO1xuXG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFxuICAgIFwiZGFya1wiLFxuICAgIHNob3VsZFVzZURhcmtcbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFwcGx5UGFuZWxPcGVuQmVoYXZpb3IoKSB7XG4gIGlmICghYnJvd3Nlci5zaWRlUGFuZWw/LnNldFBhbmVsQmVoYXZpb3IpIHJldHVybjtcblxuICBjb25zdCB7IG9wZW5CZWhhdmlvciB9ID0gYXdhaXQgZ2V0RXh0ZW5zaW9uUHJlZmVyZW5jZXMoKTtcbiAgYXdhaXQgYnJvd3Nlci5zaWRlUGFuZWwuc2V0UGFuZWxCZWhhdmlvcih7XG4gICAgb3BlblBhbmVsT25BY3Rpb25DbGljazogb3BlbkJlaGF2aW9yID09PSBcInNpZGVwYW5lbFwiLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VUaGVtZVByZWZlcmVuY2UoXG4gIHZhbHVlOiB1bmtub3duXG4pOiBFeHRlbnNpb25UaGVtZVByZWZlcmVuY2Uge1xuICBpZiAoXG4gICAgdmFsdWUgPT09IFwibGlnaHRcIiB8fFxuICAgIHZhbHVlID09PSBcImRhcmtcIiB8fFxuICAgIHZhbHVlID09PSBcInN5c3RlbVwiXG4gICkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBkZWZhdWx0UHJlZmVyZW5jZXMudGhlbWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3BlbkJlaGF2aW9yKFxuICB2YWx1ZTogdW5rbm93blxuKTogRXh0ZW5zaW9uT3BlbkJlaGF2aW9yIHtcbiAgaWYgKHZhbHVlID09PSBcInBvcHVwXCIgfHwgdmFsdWUgPT09IFwic2lkZXBhbmVsXCIpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdFByZWZlcmVuY2VzLm9wZW5CZWhhdmlvcjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbm90aWZ5UHJlZmVyZW5jZUNoYW5nZSgpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgdHlwZTogZXh0ZW5zaW9uUHJlZmVyZW5jZU1lc3NhZ2VUeXBlLFxuICAgIH0pO1xuICB9IGNhdGNoIHtcbiAgICAvLyBUaGUgc2V0dGluZ3Mgc2NyZWVuIGNhbiBzdGlsbCBwZXJzaXN0IHByZWZlcmVuY2VzIGlmIG5vIGxpc3RlbmVyIGlzIGFjdGl2ZS5cbiAgfVxufVxuIiwiLyoqIFJ1bnRpbWUgZGVidWcgcmVsYXkg4oaSIGJhY2tncm91bmQg4oaSIE5ESlNPTiBpbmdlc3QgKHNlc3Npb24gMjEwODgzKS4gKi9cbmV4cG9ydCBjb25zdCBleHRlbnNpb25EZWJ1Z0FnZW50TG9nTWVzc2FnZVR5cGUgPVxuICBcInNlYXJjaHBhcnR5L2RlYnVnLWFnZW50LWxvZ1wiIGFzIGNvbnN0O1xuXG5jb25zdCBERUJVR19TRVNTSU9OID0gXCIyMTA4ODNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFnZW50RGVidWdMb2coaW5wdXQ6IHtcbiAgcnVuSWQ/OiBzdHJpbmc7XG4gIGh5cG90aGVzaXNJZDogc3RyaW5nO1xuICBsb2NhdGlvbjogc3RyaW5nO1xuICBtZXNzYWdlOiBzdHJpbmc7XG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufSk6IHZvaWQge1xuICBpZiAoXG4gICAgdHlwZW9mIGJyb3dzZXIgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICB0eXBlb2YgYnJvd3Nlci5ydW50aW1lPy5zZW5kTWVzc2FnZSAhPT0gXCJmdW5jdGlvblwiXG4gICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2b2lkIGJyb3dzZXIucnVudGltZVxuICAgIC5zZW5kTWVzc2FnZSh7XG4gICAgICB0eXBlOiBleHRlbnNpb25EZWJ1Z0FnZW50TG9nTWVzc2FnZVR5cGUsXG4gICAgICBzZXNzaW9uSWQ6IERFQlVHX1NFU1NJT04sXG4gICAgICAuLi5pbnB1dCxcbiAgICB9KVxuICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xufVxuIiwiLyoqIEJhY2tncm91bmQgcGVyZm9ybXMgYGZldGNoYCBmb3IgYmxvYnMgdGhlIGNvbnRlbnQgc2NyaXB0IGNhbm5vdCBsb2FkIChlLmcuIENPUlMpLiAqL1xuZXhwb3J0IGNvbnN0IGV4dGVuc2lvbkZldGNoQmxvYk1lc3NhZ2VUeXBlID1cbiAgXCJzZWFyY2hwYXJ0eS9leHRlbnNpb24vZmV0Y2gtYmxvYlwiIGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBFeHRlbnNpb25GZXRjaEJsb2JNZXNzYWdlID0ge1xuICB0eXBlOiB0eXBlb2YgZXh0ZW5zaW9uRmV0Y2hCbG9iTWVzc2FnZVR5cGU7XG4gIHVybDogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgRXh0ZW5zaW9uRmV0Y2hCbG9iUmVzcG9uc2UgPVxuICB8IHsgb2s6IHRydWU7IGJ1ZmZlcjogQXJyYXlCdWZmZXI7IGNvbnRlbnRUeXBlOiBzdHJpbmcgfVxuICB8IHsgb2s6IGZhbHNlOyBlcnJvcjogc3RyaW5nIH07XG5cbi8qKiBDaHJvbWUgc3RydWN0dXJlZC1jbG9uZSBtYXkgZGVsaXZlciBieXRlcyBhcyBBcnJheUJ1ZmZlciBvciBhIHR5cGVkIGFycmF5LiAqL1xuZnVuY3Rpb24gdG9BcnJheUJ1ZmZlckZyb21NZXNzYWdlKHZhbHVlOiB1bmtub3duKTogQXJyYXlCdWZmZXIgfCBudWxsIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICBjb25zdCB2ID0gdmFsdWUgYXMgQXJyYXlCdWZmZXJWaWV3O1xuICAgIGNvbnN0IGNvcHkgPSBuZXcgVWludDhBcnJheSh2LmJ5dGVMZW5ndGgpO1xuICAgIGNvcHkuc2V0KG5ldyBVaW50OEFycmF5KHYuYnVmZmVyLCB2LmJ5dGVPZmZzZXQsIHYuYnl0ZUxlbmd0aCkpO1xuICAgIHJldHVybiBjb3B5LmJ1ZmZlcjtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBMb2FkcyBieXRlcyBmb3IgYW4gaHR0cChzKSBVUkwgdmlhIHRoZSBzZXJ2aWNlIHdvcmtlciAoaG9zdF9wZXJtaXNzaW9ucyksXG4gKiB3aXRoIGEgVml0ZXN0IC8gbm9uLWV4dGVuc2lvbiBmYWxsYmFjayB0byBgZmV0Y2hgIGluIHRoZSBjYWxsZXIgY29udGV4dC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQmxvYlZpYUV4dGVuc2lvbihcbiAgdXJsOiBzdHJpbmcsXG4pOiBQcm9taXNlPEV4dGVuc2lvbkZldGNoQmxvYlJlc3BvbnNlPiB7XG4gIGlmIChcbiAgICB0eXBlb2YgYnJvd3NlciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHR5cGVvZiBicm93c2VyLnJ1bnRpbWU/LnNlbmRNZXNzYWdlID09PSBcImZ1bmN0aW9uXCJcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdzogdW5rbm93biA9IGF3YWl0IGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IGV4dGVuc2lvbkZldGNoQmxvYk1lc3NhZ2VUeXBlLFxuICAgICAgICB1cmwsXG4gICAgICB9IHNhdGlzZmllcyBFeHRlbnNpb25GZXRjaEJsb2JNZXNzYWdlKTtcbiAgICAgIGlmIChcbiAgICAgICAgcmF3ICYmXG4gICAgICAgIHR5cGVvZiByYXcgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgXCJva1wiIGluIHJhdyAmJlxuICAgICAgICAocmF3IGFzIEV4dGVuc2lvbkZldGNoQmxvYlJlc3BvbnNlKS5vayA9PT0gdHJ1ZSAmJlxuICAgICAgICBcImJ1ZmZlclwiIGluIHJhd1xuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRvQXJyYXlCdWZmZXJGcm9tTWVzc2FnZShcbiAgICAgICAgICAocmF3IGFzIHsgYnVmZmVyOiB1bmtub3duIH0pLmJ1ZmZlcixcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgY29udGVudFR5cGVSYXcgPSAocmF3IGFzIHsgY29udGVudFR5cGU/OiB1bmtub3duIH0pXG4gICAgICAgICAgLmNvbnRlbnRUeXBlO1xuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9XG4gICAgICAgICAgdHlwZW9mIGNvbnRlbnRUeXBlUmF3ID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICBjb250ZW50VHlwZVJhdy50cmltKCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgPyBjb250ZW50VHlwZVJhdy50cmltKClcbiAgICAgICAgICAgIDogXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIjtcbiAgICAgICAgaWYgKGJ1ZmZlciAhPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgcmF3ICYmXG4gICAgICAgIHR5cGVvZiByYXcgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgXCJva1wiIGluIHJhdyAmJlxuICAgICAgICAocmF3IGFzIEV4dGVuc2lvbkZldGNoQmxvYlJlc3BvbnNlKS5vayA9PT0gZmFsc2UgJiZcbiAgICAgICAgXCJlcnJvclwiIGluIHJhd1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybiByYXcgYXMgRXh0ZW5zaW9uRmV0Y2hCbG9iUmVzcG9uc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBcIlVuZXhwZWN0ZWQgcmVzcG9uc2UgZnJvbSB0aGUgZXh0ZW5zaW9uIGJhY2tncm91bmQuXCIsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBjb25zdCBtc2cgPVxuICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIGVycm9yOiBtc2csXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG9rOiBmYWxzZSxcbiAgICBlcnJvcjogXCJFeHRlbnNpb24gbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUuXCIsXG4gIH07XG59XG4iLCIvKiogQXNrIHRoZSBzZXJ2aWNlIHdvcmtlciB0byBhc3NpZ24gYSByw6lzdW3DqSBmaWxlIGluIHRoZSBwYWdlIE1BSU4gSlMgd29ybGQuICovXG5leHBvcnQgY29uc3QgZXh0ZW5zaW9uTWFpbldvcmxkQXNzaWduRmlsZU1lc3NhZ2VUeXBlID1cbiAgXCJzZWFyY2hwYXJ0eS9leHRlbnNpb24vbWFpbi13b3JsZC1hc3NpZ24tZmlsZVwiIGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBFeHRlbnNpb25NYWluV29ybGRBc3NpZ25GaWxlTWVzc2FnZSA9IHtcbiAgdHlwZTogdHlwZW9mIGV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVNZXNzYWdlVHlwZTtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgYnVmZmVyOiBBcnJheUJ1ZmZlcjtcbiAgZmlsZU5hbWU6IHN0cmluZztcbiAgbWltZVR5cGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZSA9XG4gIHwge1xuICAgIG9rOiB0cnVlO1xuICAgIHJlc3VsdDoge1xuICAgICAgb2s6IGJvb2xlYW47XG4gICAgICByZWFzb24/OiBzdHJpbmc7XG4gICAgICBmaWxlc0xlbj86IG51bWJlcjtcbiAgICB9O1xuICB9XG4gIHwgeyBvazogZmFsc2U7IGVycm9yOiBzdHJpbmcgfTtcblxuLyoqXG4gKiBSdW5zIGBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHRgIGluIE1BSU4gd29ybGQgKHJlcXVpcmVzIGJhY2tncm91bmQpLlxuICogRmFsbHMgYmFjayB0byBjYWxsZXIgd2hlbiBtZXNzYWdpbmcgaXMgdW5hdmFpbGFibGUgKGUuZy4gVml0ZXN0KS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVlc3RNYWluV29ybGRSZXN1bWVGaWxlQXNzaWduKFxuICBpbnB1dDogRXh0ZW5zaW9uTWFpbldvcmxkQXNzaWduRmlsZU1lc3NhZ2UsXG4pOiBQcm9taXNlPEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZT4ge1xuICBpZiAoXG4gICAgdHlwZW9mIGJyb3dzZXIgPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICB0eXBlb2YgYnJvd3Nlci5ydW50aW1lPy5zZW5kTWVzc2FnZSAhPT0gXCJmdW5jdGlvblwiXG4gICkge1xuICAgIHJldHVybiB7XG4gICAgICBvazogZmFsc2UsXG4gICAgICBlcnJvcjogXCJFeHRlbnNpb24gbWVzc2FnaW5nIGlzIG5vdCBhdmFpbGFibGUuXCIsXG4gICAgfTtcbiAgfVxuICBjb25zdCByYXc6IHVua25vd24gPSBhd2FpdCBicm93c2VyLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoaW5wdXQpO1xuICBpZiAoXG4gICAgcmF3ICYmXG4gICAgdHlwZW9mIHJhdyA9PT0gXCJvYmplY3RcIiAmJlxuICAgIFwib2tcIiBpbiByYXcgJiZcbiAgICAocmF3IGFzIEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZSkub2sgPT09IHRydWUgJiZcbiAgICBcInJlc3VsdFwiIGluIHJhd1xuICApIHtcbiAgICByZXR1cm4gcmF3IGFzIEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZTtcbiAgfVxuICBpZiAoXG4gICAgcmF3ICYmXG4gICAgdHlwZW9mIHJhdyA9PT0gXCJvYmplY3RcIiAmJlxuICAgIFwib2tcIiBpbiByYXcgJiZcbiAgICAocmF3IGFzIEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZSkub2sgPT09IGZhbHNlICYmXG4gICAgXCJlcnJvclwiIGluIHJhd1xuICApIHtcbiAgICByZXR1cm4gcmF3IGFzIEV4dGVuc2lvbk1haW5Xb3JsZEFzc2lnbkZpbGVSZXNwb25zZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG9rOiBmYWxzZSxcbiAgICBlcnJvcjogXCJVbmV4cGVjdGVkIHJlc3BvbnNlIGZyb20gdGhlIGV4dGVuc2lvbiBiYWNrZ3JvdW5kLlwiLFxuICB9O1xufVxuIiwidmFyIF9hO1xuLyoqIEEgc3BlY2lhbCBjb25zdGFudCB3aXRoIHR5cGUgYG5ldmVyYCAqL1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gLypAX19QVVJFX18qLyBPYmplY3QuZnJlZXplKHtcbiAgICBzdGF0dXM6IFwiYWJvcnRlZFwiLFxufSk7XG5leHBvcnQgLypAX19OT19TSURFX0VGRkVDVFNfXyovIGZ1bmN0aW9uICRjb25zdHJ1Y3RvcihuYW1lLCBpbml0aWFsaXplciwgcGFyYW1zKSB7XG4gICAgZnVuY3Rpb24gaW5pdChpbnN0LCBkZWYpIHtcbiAgICAgICAgaWYgKCFpbnN0Ll96b2QpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcIl96b2RcIiwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZixcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyOiBfLFxuICAgICAgICAgICAgICAgICAgICB0cmFpdHM6IG5ldyBTZXQoKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluc3QuX3pvZC50cmFpdHMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaW5zdC5fem9kLnRyYWl0cy5hZGQobmFtZSk7XG4gICAgICAgIGluaXRpYWxpemVyKGluc3QsIGRlZik7XG4gICAgICAgIC8vIHN1cHBvcnQgcHJvdG90eXBlIG1vZGlmaWNhdGlvbnNcbiAgICAgICAgY29uc3QgcHJvdG8gPSBfLnByb3RvdHlwZTtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb3RvKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIGlmICghKGsgaW4gaW5zdCkpIHtcbiAgICAgICAgICAgICAgICBpbnN0W2tdID0gcHJvdG9ba10uYmluZChpbnN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBkb2Vzbid0IHdvcmsgaWYgUGFyZW50IGhhcyBhIGNvbnN0cnVjdG9yIHdpdGggYXJndW1lbnRzXG4gICAgY29uc3QgUGFyZW50ID0gcGFyYW1zPy5QYXJlbnQgPz8gT2JqZWN0O1xuICAgIGNsYXNzIERlZmluaXRpb24gZXh0ZW5kcyBQYXJlbnQge1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGVmaW5pdGlvbiwgXCJuYW1lXCIsIHsgdmFsdWU6IG5hbWUgfSk7XG4gICAgZnVuY3Rpb24gXyhkZWYpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBpbnN0ID0gcGFyYW1zPy5QYXJlbnQgPyBuZXcgRGVmaW5pdGlvbigpIDogdGhpcztcbiAgICAgICAgaW5pdChpbnN0LCBkZWYpO1xuICAgICAgICAoX2EgPSBpbnN0Ll96b2QpLmRlZmVycmVkID8/IChfYS5kZWZlcnJlZCA9IFtdKTtcbiAgICAgICAgZm9yIChjb25zdCBmbiBvZiBpbnN0Ll96b2QuZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIGZuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfLCBcImluaXRcIiwgeyB2YWx1ZTogaW5pdCB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXywgU3ltYm9sLmhhc0luc3RhbmNlLCB7XG4gICAgICAgIHZhbHVlOiAoaW5zdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBhcmFtcz8uUGFyZW50ICYmIGluc3QgaW5zdGFuY2VvZiBwYXJhbXMuUGFyZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGluc3Q/Ll96b2Q/LnRyYWl0cz8uaGFzKG5hbWUpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfLCBcIm5hbWVcIiwgeyB2YWx1ZTogbmFtZSB9KTtcbiAgICByZXR1cm4gXztcbn1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAgIFVUSUxJVElFUyAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGNvbnN0ICRicmFuZCA9IFN5bWJvbChcInpvZF9icmFuZFwiKTtcbmV4cG9ydCBjbGFzcyAkWm9kQXN5bmNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoYEVuY291bnRlcmVkIFByb21pc2UgZHVyaW5nIHN5bmNocm9ub3VzIHBhcnNlLiBVc2UgLnBhcnNlQXN5bmMoKSBpbnN0ZWFkLmApO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyAkWm9kRW5jb2RlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobmFtZSkge1xuICAgICAgICBzdXBlcihgRW5jb3VudGVyZWQgdW5pZGlyZWN0aW9uYWwgdHJhbnNmb3JtIGR1cmluZyBlbmNvZGU6ICR7bmFtZX1gKTtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJab2RFbmNvZGVFcnJvclwiO1xuICAgIH1cbn1cbihfYSA9IGdsb2JhbFRoaXMpLl9fem9kX2dsb2JhbENvbmZpZyA/PyAoX2EuX196b2RfZ2xvYmFsQ29uZmlnID0ge30pO1xuZXhwb3J0IGNvbnN0IGdsb2JhbENvbmZpZyA9IGdsb2JhbFRoaXMuX196b2RfZ2xvYmFsQ29uZmlnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZyhuZXdDb25maWcpIHtcbiAgICBpZiAobmV3Q29uZmlnKVxuICAgICAgICBPYmplY3QuYXNzaWduKGdsb2JhbENvbmZpZywgbmV3Q29uZmlnKTtcbiAgICByZXR1cm4gZ2xvYmFsQ29uZmlnO1xufVxuIiwiaW1wb3J0IHsgZ2xvYmFsQ29uZmlnIH0gZnJvbSBcIi4vY29yZS5qc1wiO1xuLy8gZnVuY3Rpb25zXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0RXF1YWwodmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnROb3RFcXVhbCh2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydElzKF9hcmcpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5ldmVyKF94KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCB2YWx1ZSBpbiBleGhhdXN0aXZlIGNoZWNrXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChfKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnVtVmFsdWVzKGVudHJpZXMpIHtcbiAgICBjb25zdCBudW1lcmljVmFsdWVzID0gT2JqZWN0LnZhbHVlcyhlbnRyaWVzKS5maWx0ZXIoKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiKTtcbiAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QuZW50cmllcyhlbnRyaWVzKVxuICAgICAgICAuZmlsdGVyKChbaywgX10pID0+IG51bWVyaWNWYWx1ZXMuaW5kZXhPZigraykgPT09IC0xKVxuICAgICAgICAubWFwKChbXywgdl0pID0+IHYpO1xuICAgIHJldHVybiB2YWx1ZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gam9pblZhbHVlcyhhcnJheSwgc2VwYXJhdG9yID0gXCJ8XCIpIHtcbiAgICByZXR1cm4gYXJyYXkubWFwKCh2YWwpID0+IHN0cmluZ2lmeVByaW1pdGl2ZSh2YWwpKS5qb2luKHNlcGFyYXRvcik7XG59XG5leHBvcnQgZnVuY3Rpb24ganNvblN0cmluZ2lmeVJlcGxhY2VyKF8sIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJiaWdpbnRcIilcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhY2hlZChnZXR0ZXIpIHtcbiAgICBjb25zdCBzZXQgPSBmYWxzZTtcbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgICAgICBpZiAoIXNldCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0dGVyKCk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidmFsdWVcIiwgeyB2YWx1ZSB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWNoZWQgdmFsdWUgYWxyZWFkeSBzZXRcIik7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBudWxsaXNoKGlucHV0KSB7XG4gICAgcmV0dXJuIGlucHV0ID09PSBudWxsIHx8IGlucHV0ID09PSB1bmRlZmluZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY2xlYW5SZWdleChzb3VyY2UpIHtcbiAgICBjb25zdCBzdGFydCA9IHNvdXJjZS5zdGFydHNXaXRoKFwiXlwiKSA/IDEgOiAwO1xuICAgIGNvbnN0IGVuZCA9IHNvdXJjZS5lbmRzV2l0aChcIiRcIikgPyBzb3VyY2UubGVuZ3RoIC0gMSA6IHNvdXJjZS5sZW5ndGg7XG4gICAgcmV0dXJuIHNvdXJjZS5zbGljZShzdGFydCwgZW5kKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbG9hdFNhZmVSZW1haW5kZXIodmFsLCBzdGVwKSB7XG4gICAgY29uc3QgcmF0aW8gPSB2YWwgLyBzdGVwO1xuICAgIGNvbnN0IHJvdW5kZWRSYXRpbyA9IE1hdGgucm91bmQocmF0aW8pO1xuICAgIC8vIFVzZSBhIHJlbGF0aXZlIGVwc2lsb24gc2NhbGVkIHRvIHRoZSBtYWduaXR1ZGUgb2YgdGhlIHJlc3VsdFxuICAgIGNvbnN0IHRvbGVyYW5jZSA9IE51bWJlci5FUFNJTE9OICogTWF0aC5tYXgoTWF0aC5hYnMocmF0aW8pLCAxKTtcbiAgICBpZiAoTWF0aC5hYnMocmF0aW8gLSByb3VuZGVkUmF0aW8pIDwgdG9sZXJhbmNlKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gcmF0aW8gLSByb3VuZGVkUmF0aW87XG59XG5jb25zdCBFVkFMVUFUSU5HID0gLyogQF9fUFVSRV9fKi8gU3ltYm9sKFwiZXZhbHVhdGluZ1wiKTtcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVMYXp5KG9iamVjdCwga2V5LCBnZXR0ZXIpIHtcbiAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gRVZBTFVBVElORykge1xuICAgICAgICAgICAgICAgIC8vIENpcmN1bGFyIHJlZmVyZW5jZSBkZXRlY3RlZCwgcmV0dXJuIHVuZGVmaW5lZCB0byBicmVhayB0aGUgY3ljbGVcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IEVWQUxVQVRJTkc7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBnZXR0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHYpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gb2JqZWN0W2tleV0gPSB2O1xuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0Q2xvbmUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaikpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnblByb3AodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3AsIHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZWZzKC4uLmRlZnMpIHtcbiAgICBjb25zdCBtZXJnZWREZXNjcmlwdG9ycyA9IHt9O1xuICAgIGZvciAoY29uc3QgZGVmIG9mIGRlZnMpIHtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvcnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhkZWYpO1xuICAgICAgICBPYmplY3QuYXNzaWduKG1lcmdlZERlc2NyaXB0b3JzLCBkZXNjcmlwdG9ycyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh7fSwgbWVyZ2VkRGVzY3JpcHRvcnMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lRGVmKHNjaGVtYSkge1xuICAgIHJldHVybiBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QXRQYXRoKG9iaiwgcGF0aCkge1xuICAgIGlmICghcGF0aClcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gcGF0aC5yZWR1Y2UoKGFjYywga2V5KSA9PiBhY2M/LltrZXldLCBvYmopO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2VBbGxPYmplY3QocHJvbWlzZXNPYmopIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMocHJvbWlzZXNPYmopO1xuICAgIGNvbnN0IHByb21pc2VzID0ga2V5cy5tYXAoKGtleSkgPT4gcHJvbWlzZXNPYmpba2V5XSk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkT2JqID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzb2x2ZWRPYmpba2V5c1tpXV0gPSByZXN1bHRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZE9iajtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHJpbmcobGVuZ3RoID0gMTApIHtcbiAgICBjb25zdCBjaGFycyA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIjtcbiAgICBsZXQgc3RyID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0ciArPSBjaGFyc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFycy5sZW5ndGgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBlc2Moc3RyKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0cik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2x1Z2lmeShpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dFxuICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAudHJpbSgpXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcd1xccy1dL2csIFwiXCIpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxzXy1dKy9nLCBcIi1cIilcbiAgICAgICAgLnJlcGxhY2UoL14tK3wtKyQvZywgXCJcIik7XG59XG5leHBvcnQgY29uc3QgY2FwdHVyZVN0YWNrVHJhY2UgPSAoXCJjYXB0dXJlU3RhY2tUcmFjZVwiIGluIEVycm9yID8gRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UgOiAoLi4uX2FyZ3MpID0+IHsgfSk7XG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiBkYXRhICE9PSBudWxsICYmICFBcnJheS5pc0FycmF5KGRhdGEpO1xufVxuZXhwb3J0IGNvbnN0IGFsbG93c0V2YWwgPSAvKiBAX19QVVJFX18qLyBjYWNoZWQoKCkgPT4ge1xuICAgIC8vIFNraXAgdGhlIHByb2JlIHVuZGVyIGBqaXRsZXNzYDogc3RyaWN0IENTUHMgcmVwb3J0IHRoZSBjYXVnaHQgYG5ldyBGdW5jdGlvbmBcbiAgICAvLyBhcyBhIGBzZWN1cml0eXBvbGljeXZpb2xhdGlvbmAgZXZlbiB0aG91Z2ggdGhlIHRocm93IGlzIHN3YWxsb3dlZC5cbiAgICBpZiAoZ2xvYmFsQ29uZmlnLmppdGxlc3MpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09IFwidW5kZWZpbmVkXCIgJiYgbmF2aWdhdG9yPy51c2VyQWdlbnQ/LmluY2x1ZGVzKFwiQ2xvdWRmbGFyZVwiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IEYgPSBGdW5jdGlvbjtcbiAgICAgICAgbmV3IEYoXCJcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCAoXykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSk7XG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvKSB7XG4gICAgaWYgKGlzT2JqZWN0KG8pID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIG1vZGlmaWVkIGNvbnN0cnVjdG9yXG4gICAgY29uc3QgY3RvciA9IG8uY29uc3RydWN0b3I7XG4gICAgaWYgKGN0b3IgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKHR5cGVvZiBjdG9yICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIC8vIG1vZGlmaWVkIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3QgPSBjdG9yLnByb3RvdHlwZTtcbiAgICBpZiAoaXNPYmplY3QocHJvdCkgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gY3RvciBkb2Vzbid0IGhhdmUgc3RhdGljIGBpc1Byb3RvdHlwZU9mYFxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocHJvdCwgXCJpc1Byb3RvdHlwZU9mXCIpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNoYWxsb3dDbG9uZShvKSB7XG4gICAgaWYgKGlzUGxhaW5PYmplY3QobykpXG4gICAgICAgIHJldHVybiB7IC4uLm8gfTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvKSlcbiAgICAgICAgcmV0dXJuIFsuLi5vXTtcbiAgICBpZiAobyBpbnN0YW5jZW9mIE1hcClcbiAgICAgICAgcmV0dXJuIG5ldyBNYXAobyk7XG4gICAgaWYgKG8gaW5zdGFuY2VvZiBTZXQpXG4gICAgICAgIHJldHVybiBuZXcgU2V0KG8pO1xuICAgIHJldHVybiBvO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG51bUtleXMoZGF0YSkge1xuICAgIGxldCBrZXlDb3VudCA9IDA7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGF0YSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkpIHtcbiAgICAgICAgICAgIGtleUNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleUNvdW50O1xufVxuZXhwb3J0IGNvbnN0IGdldFBhcnNlZFR5cGUgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IHQgPSB0eXBlb2YgZGF0YTtcbiAgICBzd2l0Y2ggKHQpIHtcbiAgICAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidW5kZWZpbmVkXCI7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgIHJldHVybiBcInN0cmluZ1wiO1xuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGEpID8gXCJuYW5cIiA6IFwibnVtYmVyXCI7XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJib29sZWFuXCI7XG4gICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIjtcbiAgICAgICAgY2FzZSBcImJpZ2ludFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiYmlnaW50XCI7XG4gICAgICAgIGNhc2UgXCJzeW1ib2xcIjpcbiAgICAgICAgICAgIHJldHVybiBcInN5bWJvbFwiO1xuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImFycmF5XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnRoZW4gJiYgdHlwZW9mIGRhdGEudGhlbiA9PT0gXCJmdW5jdGlvblwiICYmIGRhdGEuY2F0Y2ggJiYgdHlwZW9mIGRhdGEuY2F0Y2ggPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcInByb21pc2VcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgTWFwICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJtYXBcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgU2V0ICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJzZXRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImRhdGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGlmICh0eXBlb2YgRmlsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRmlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcImZpbGVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBcIm9iamVjdFwiO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRhdGEgdHlwZTogJHt0fWApO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgcHJvcGVydHlLZXlUeXBlcyA9IC8qIEBfX1BVUkVfXyovIG5ldyBTZXQoW1wic3RyaW5nXCIsIFwibnVtYmVyXCIsIFwic3ltYm9sXCJdKTtcbmV4cG9ydCBjb25zdCBwcmltaXRpdmVUeXBlcyA9IC8qIEBfX1BVUkVfXyovIG5ldyBTZXQoW1xuICAgIFwic3RyaW5nXCIsXG4gICAgXCJudW1iZXJcIixcbiAgICBcImJpZ2ludFwiLFxuICAgIFwiYm9vbGVhblwiLFxuICAgIFwic3ltYm9sXCIsXG4gICAgXCJ1bmRlZmluZWRcIixcbl0pO1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuLy8gem9kLXNwZWNpZmljIHV0aWxzXG5leHBvcnQgZnVuY3Rpb24gY2xvbmUoaW5zdCwgZGVmLCBwYXJhbXMpIHtcbiAgICBjb25zdCBjbCA9IG5ldyBpbnN0Ll96b2QuY29uc3RyKGRlZiA/PyBpbnN0Ll96b2QuZGVmKTtcbiAgICBpZiAoIWRlZiB8fCBwYXJhbXM/LnBhcmVudClcbiAgICAgICAgY2wuX3pvZC5wYXJlbnQgPSBpbnN0O1xuICAgIHJldHVybiBjbDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVQYXJhbXMoX3BhcmFtcykge1xuICAgIGNvbnN0IHBhcmFtcyA9IF9wYXJhbXM7XG4gICAgaWYgKCFwYXJhbXMpXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIHsgZXJyb3I6ICgpID0+IHBhcmFtcyB9O1xuICAgIGlmIChwYXJhbXM/Lm1lc3NhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocGFyYW1zPy5lcnJvciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHNwZWNpZnkgYm90aCBgbWVzc2FnZWAgYW5kIGBlcnJvcmAgcGFyYW1zXCIpO1xuICAgICAgICBwYXJhbXMuZXJyb3IgPSBwYXJhbXMubWVzc2FnZTtcbiAgICB9XG4gICAgZGVsZXRlIHBhcmFtcy5tZXNzYWdlO1xuICAgIGlmICh0eXBlb2YgcGFyYW1zLmVycm9yID09PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4geyAuLi5wYXJhbXMsIGVycm9yOiAoKSA9PiBwYXJhbXMuZXJyb3IgfTtcbiAgICByZXR1cm4gcGFyYW1zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zcGFyZW50UHJveHkoZ2V0dGVyKSB7XG4gICAgbGV0IHRhcmdldDtcbiAgICByZXR1cm4gbmV3IFByb3h5KHt9LCB7XG4gICAgICAgIGdldChfLCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgdGFyZ2V0ID8/ICh0YXJnZXQgPSBnZXR0ZXIoKSk7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldChfLCBwcm9wLCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFzKF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5KF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3duS2V5cyhfKSB7XG4gICAgICAgICAgICB0YXJnZXQgPz8gKHRhcmdldCA9IGdldHRlcigpKTtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0Lm93bktleXModGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKF8sIHByb3ApIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlZmluZVByb3BlcnR5KF8sIHByb3AsIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgIHRhcmdldCA/PyAodGFyZ2V0ID0gZ2V0dGVyKCkpO1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzdHJpbmdpZnlQcmltaXRpdmUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcImJpZ2ludFwiKVxuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKSArIFwiblwiO1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBgXCIke3ZhbHVlfVwiYDtcbiAgICByZXR1cm4gYCR7dmFsdWV9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25hbEtleXMoc2hhcGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc2hhcGUpLmZpbHRlcigoaykgPT4ge1xuICAgICAgICByZXR1cm4gc2hhcGVba10uX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiICYmIHNoYXBlW2tdLl96b2Qub3B0b3V0ID09PSBcIm9wdGlvbmFsXCI7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgTlVNQkVSX0ZPUk1BVF9SQU5HRVMgPSB7XG4gICAgc2FmZWludDogW051bWJlci5NSU5fU0FGRV9JTlRFR0VSLCBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUl0sXG4gICAgaW50MzI6IFstMjE0NzQ4MzY0OCwgMjE0NzQ4MzY0N10sXG4gICAgdWludDMyOiBbMCwgNDI5NDk2NzI5NV0sXG4gICAgZmxvYXQzMjogWy0zLjQwMjgyMzQ2NjM4NTI4ODZlMzgsIDMuNDAyODIzNDY2Mzg1Mjg4NmUzOF0sXG4gICAgZmxvYXQ2NDogWy1OdW1iZXIuTUFYX1ZBTFVFLCBOdW1iZXIuTUFYX1ZBTFVFXSxcbn07XG5leHBvcnQgY29uc3QgQklHSU5UX0ZPUk1BVF9SQU5HRVMgPSB7XG4gICAgaW50NjQ6IFsvKiBAX19QVVJFX18qLyBCaWdJbnQoXCItOTIyMzM3MjAzNjg1NDc3NTgwOFwiKSwgLyogQF9fUFVSRV9fKi8gQmlnSW50KFwiOTIyMzM3MjAzNjg1NDc3NTgwN1wiKV0sXG4gICAgdWludDY0OiBbLyogQF9fUFVSRV9fKi8gQmlnSW50KDApLCAvKiBAX19QVVJFX18qLyBCaWdJbnQoXCIxODQ0Njc0NDA3MzcwOTU1MTYxNVwiKV0sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2soc2NoZW1hLCBtYXNrKSB7XG4gICAgY29uc3QgY3VyckRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBjb25zdCBjaGVja3MgPSBjdXJyRGVmLmNoZWNrcztcbiAgICBjb25zdCBoYXNDaGVja3MgPSBjaGVja3MgJiYgY2hlY2tzLmxlbmd0aCA+IDA7XG4gICAgaWYgKGhhc0NoZWNrcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIucGljaygpIGNhbm5vdCBiZSB1c2VkIG9uIG9iamVjdCBzY2hlbWFzIGNvbnRhaW5pbmcgcmVmaW5lbWVudHNcIik7XG4gICAgfVxuICAgIGNvbnN0IGRlZiA9IG1lcmdlRGVmcyhzY2hlbWEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgbmV3U2hhcGUgPSB7fTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG1hc2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gY3VyckRlZi5zaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQga2V5OiBcIiR7a2V5fVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBuZXdTaGFwZVtrZXldID0gY3VyckRlZi5zaGFwZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIG5ld1NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gbmV3U2hhcGU7XG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrczogW10sXG4gICAgfSk7XG4gICAgcmV0dXJuIGNsb25lKHNjaGVtYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvbWl0KHNjaGVtYSwgbWFzaykge1xuICAgIGNvbnN0IGN1cnJEZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgY2hlY2tzID0gY3VyckRlZi5jaGVja3M7XG4gICAgY29uc3QgaGFzQ2hlY2tzID0gY2hlY2tzICYmIGNoZWNrcy5sZW5ndGggPiAwO1xuICAgIGlmIChoYXNDaGVja3MpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiLm9taXQoKSBjYW5ub3QgYmUgdXNlZCBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzXCIpO1xuICAgIH1cbiAgICBjb25zdCBkZWYgPSBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmLCB7XG4gICAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NoYXBlID0geyAuLi5zY2hlbWEuX3pvZC5kZWYuc2hhcGUgfTtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG1hc2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gY3VyckRlZi5zaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnJlY29nbml6ZWQga2V5OiBcIiR7a2V5fVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3U2hhcGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFzc2lnblByb3AodGhpcywgXCJzaGFwZVwiLCBuZXdTaGFwZSk7IC8vIHNlbGYtY2FjaGluZ1xuICAgICAgICAgICAgcmV0dXJuIG5ld1NoYXBlO1xuICAgICAgICB9LFxuICAgICAgICBjaGVja3M6IFtdLFxuICAgIH0pO1xuICAgIHJldHVybiBjbG9uZShzY2hlbWEsIGRlZik7XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHNjaGVtYSwgc2hhcGUpIHtcbiAgICBpZiAoIWlzUGxhaW5PYmplY3Qoc2hhcGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaW5wdXQgdG8gZXh0ZW5kOiBleHBlY3RlZCBhIHBsYWluIG9iamVjdFwiKTtcbiAgICB9XG4gICAgY29uc3QgY2hlY2tzID0gc2NoZW1hLl96b2QuZGVmLmNoZWNrcztcbiAgICBjb25zdCBoYXNDaGVja3MgPSBjaGVja3MgJiYgY2hlY2tzLmxlbmd0aCA+IDA7XG4gICAgaWYgKGhhc0NoZWNrcykge1xuICAgICAgICAvLyBPbmx5IHRocm93IGlmIG5ldyBzaGFwZSBvdmVybGFwcyB3aXRoIGV4aXN0aW5nIHNoYXBlXG4gICAgICAgIC8vIFVzZSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgdG8gY2hlY2sga2V5IGV4aXN0ZW5jZSB3aXRob3V0IGFjY2Vzc2luZyB2YWx1ZXNcbiAgICAgICAgY29uc3QgZXhpc3RpbmdTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2hhcGUpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGV4aXN0aW5nU2hhcGUsIGtleSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBvdmVyd3JpdGUga2V5cyBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzLiBVc2UgYC5zYWZlRXh0ZW5kKClgIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRlZiA9IG1lcmdlRGVmcyhzY2hlbWEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgX3NoYXBlID0geyAuLi5zY2hlbWEuX3pvZC5kZWYuc2hhcGUsIC4uLnNoYXBlIH07XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgX3NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gX3NoYXBlO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBjbG9uZShzY2hlbWEsIGRlZik7XG59XG5leHBvcnQgZnVuY3Rpb24gc2FmZUV4dGVuZChzY2hlbWEsIHNoYXBlKSB7XG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KHNoYXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGlucHV0IHRvIHNhZmVFeHRlbmQ6IGV4cGVjdGVkIGEgcGxhaW4gb2JqZWN0XCIpO1xuICAgIH1cbiAgICBjb25zdCBkZWYgPSBtZXJnZURlZnMoc2NoZW1hLl96b2QuZGVmLCB7XG4gICAgICAgIGdldCBzaGFwZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IF9zaGFwZSA9IHsgLi4uc2NoZW1hLl96b2QuZGVmLnNoYXBlLCAuLi5zaGFwZSB9O1xuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIF9zaGFwZSk7IC8vIHNlbGYtY2FjaGluZ1xuICAgICAgICAgICAgcmV0dXJuIF9zaGFwZTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoc2NoZW1hLCBkZWYpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlKGEsIGIpIHtcbiAgICBpZiAoYS5fem9kLmRlZi5jaGVja3M/Lmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIubWVyZ2UoKSBjYW5ub3QgYmUgdXNlZCBvbiBvYmplY3Qgc2NoZW1hcyBjb250YWluaW5nIHJlZmluZW1lbnRzLiBVc2UgLnNhZmVFeHRlbmQoKSBpbnN0ZWFkLlwiKTtcbiAgICB9XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKGEuX3pvZC5kZWYsIHtcbiAgICAgICAgZ2V0IHNoYXBlKCkge1xuICAgICAgICAgICAgY29uc3QgX3NoYXBlID0geyAuLi5hLl96b2QuZGVmLnNoYXBlLCAuLi5iLl96b2QuZGVmLnNoYXBlIH07XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgX3NoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gX3NoYXBlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQgY2F0Y2hhbGwoKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5fem9kLmRlZi5jYXRjaGFsbDtcbiAgICAgICAgfSxcbiAgICAgICAgY2hlY2tzOiBiLl96b2QuZGVmLmNoZWNrcyA/PyBbXSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aWFsKENsYXNzLCBzY2hlbWEsIG1hc2spIHtcbiAgICBjb25zdCBjdXJyRGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IGNoZWNrcyA9IGN1cnJEZWYuY2hlY2tzO1xuICAgIGNvbnN0IGhhc0NoZWNrcyA9IGNoZWNrcyAmJiBjaGVja3MubGVuZ3RoID4gMDtcbiAgICBpZiAoaGFzQ2hlY2tzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIi5wYXJ0aWFsKCkgY2Fubm90IGJlIHVzZWQgb24gb2JqZWN0IHNjaGVtYXMgY29udGFpbmluZyByZWZpbmVtZW50c1wiKTtcbiAgICB9XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKHNjaGVtYS5fem9kLmRlZiwge1xuICAgICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0geyAuLi5vbGRTaGFwZSB9O1xuICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBtYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBvbGRTaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGtleTogXCIke2tleX1cImApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChvbGRTaGFwZVtrZXldIS5fem9kLm9wdGluID09PSBcIm9wdGlvbmFsXCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gQ2xhc3NcbiAgICAgICAgICAgICAgICAgICAgICAgID8gbmV3IENsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm9wdGlvbmFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUeXBlOiBvbGRTaGFwZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogb2xkU2hhcGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvbGRTaGFwZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAob2xkU2hhcGVba2V5XSEuX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVba2V5XSA9IENsYXNzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG5ldyBDbGFzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJvcHRpb25hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVHlwZTogb2xkU2hhcGVba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG9sZFNoYXBlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzaWduUHJvcCh0aGlzLCBcInNoYXBlXCIsIHNoYXBlKTsgLy8gc2VsZi1jYWNoaW5nXG4gICAgICAgICAgICByZXR1cm4gc2hhcGU7XG4gICAgICAgIH0sXG4gICAgICAgIGNoZWNrczogW10sXG4gICAgfSk7XG4gICAgcmV0dXJuIGNsb25lKHNjaGVtYSwgZGVmKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZChDbGFzcywgc2NoZW1hLCBtYXNrKSB7XG4gICAgY29uc3QgZGVmID0gbWVyZ2VEZWZzKHNjaGVtYS5fem9kLmRlZiwge1xuICAgICAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTaGFwZSA9IHNjaGVtYS5fem9kLmRlZi5zaGFwZTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0geyAuLi5vbGRTaGFwZSB9O1xuICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBtYXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKGtleSBpbiBzaGFwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5yZWNvZ25pemVkIGtleTogXCIke2tleX1cImApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWFza1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIG92ZXJ3cml0ZSB3aXRoIG5vbi1vcHRpb25hbFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gbmV3IENsYXNzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibm9ub3B0aW9uYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlubmVyVHlwZTogb2xkU2hhcGVba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gb2xkU2hhcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3ZlcndyaXRlIHdpdGggbm9uLW9wdGlvbmFsXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlW2tleV0gPSBuZXcgQ2xhc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJub25vcHRpb25hbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUeXBlOiBvbGRTaGFwZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3NpZ25Qcm9wKHRoaXMsIFwic2hhcGVcIiwgc2hhcGUpOyAvLyBzZWxmLWNhY2hpbmdcbiAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2xvbmUoc2NoZW1hLCBkZWYpO1xufVxuLy8gaW52YWxpZF90eXBlIHwgdG9vX2JpZyB8IHRvb19zbWFsbCB8IGludmFsaWRfZm9ybWF0IHwgbm90X211bHRpcGxlX29mIHwgdW5yZWNvZ25pemVkX2tleXMgfCBpbnZhbGlkX3VuaW9uIHwgaW52YWxpZF9rZXkgfCBpbnZhbGlkX2VsZW1lbnQgfCBpbnZhbGlkX3ZhbHVlIHwgY3VzdG9tXG5leHBvcnQgZnVuY3Rpb24gYWJvcnRlZCh4LCBzdGFydEluZGV4ID0gMCkge1xuICAgIGlmICh4LmFib3J0ZWQgPT09IHRydWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgeC5pc3N1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHguaXNzdWVzW2ldPy5jb250aW51ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8gQ2hlY2tzIGZvciBleHBsaWNpdCBhYm9ydCAoY29udGludWUgPT09IGZhbHNlKSwgYXMgb3Bwb3NlZCB0byBpbXBsaWNpdCBhYm9ydCAoY29udGludWUgPT09IHVuZGVmaW5lZCkuXG4vLyBVc2VkIHRvIHJlc3BlY3QgYGFib3J0OiB0cnVlYCBpbiAucmVmaW5lKCkgZXZlbiBmb3IgY2hlY2tzIHRoYXQgaGF2ZSBhIGB3aGVuYCBmdW5jdGlvbi5cbmV4cG9ydCBmdW5jdGlvbiBleHBsaWNpdGx5QWJvcnRlZCh4LCBzdGFydEluZGV4ID0gMCkge1xuICAgIGlmICh4LmFib3J0ZWQgPT09IHRydWUpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpIDwgeC5pc3N1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHguaXNzdWVzW2ldPy5jb250aW51ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwcmVmaXhJc3N1ZXMocGF0aCwgaXNzdWVzKSB7XG4gICAgcmV0dXJuIGlzc3Vlcy5tYXAoKGlzcykgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IGlzcykucGF0aCA/PyAoX2EucGF0aCA9IFtdKTtcbiAgICAgICAgaXNzLnBhdGgudW5zaGlmdChwYXRoKTtcbiAgICAgICAgcmV0dXJuIGlzcztcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1bndyYXBNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBtZXNzYWdlIDogbWVzc2FnZT8ubWVzc2FnZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb25maWcpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gaXNzLm1lc3NhZ2VcbiAgICAgICAgPyBpc3MubWVzc2FnZVxuICAgICAgICA6ICh1bndyYXBNZXNzYWdlKGlzcy5pbnN0Py5fem9kLmRlZj8uZXJyb3I/Lihpc3MpKSA/P1xuICAgICAgICAgICAgdW53cmFwTWVzc2FnZShjdHg/LmVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIHVud3JhcE1lc3NhZ2UoY29uZmlnLmN1c3RvbUVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIHVud3JhcE1lc3NhZ2UoY29uZmlnLmxvY2FsZUVycm9yPy4oaXNzKSkgPz9cbiAgICAgICAgICAgIFwiSW52YWxpZCBpbnB1dFwiKTtcbiAgICBjb25zdCB7IGluc3Q6IF9pbnN0LCBjb250aW51ZTogX2NvbnRpbnVlLCBpbnB1dDogX2lucHV0LCAuLi5yZXN0IH0gPSBpc3M7XG4gICAgcmVzdC5wYXRoID8/IChyZXN0LnBhdGggPSBbXSk7XG4gICAgcmVzdC5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICBpZiAoY3R4Py5yZXBvcnRJbnB1dCkge1xuICAgICAgICByZXN0LmlucHV0ID0gX2lucHV0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaXphYmxlT3JpZ2luKGlucHV0KSB7XG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgU2V0KVxuICAgICAgICByZXR1cm4gXCJzZXRcIjtcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBNYXApXG4gICAgICAgIHJldHVybiBcIm1hcFwiO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBGaWxlKVxuICAgICAgICByZXR1cm4gXCJmaWxlXCI7XG4gICAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldExlbmd0aGFibGVPcmlnaW4oaW5wdXQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpXG4gICAgICAgIHJldHVybiBcImFycmF5XCI7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIFwic3RyaW5nXCI7XG4gICAgcmV0dXJuIFwidW5rbm93blwiO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlZFR5cGUoZGF0YSkge1xuICAgIGNvbnN0IHQgPSB0eXBlb2YgZGF0YTtcbiAgICBzd2l0Y2ggKHQpIHtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOiB7XG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyLmlzTmFOKGRhdGEpID8gXCJuYW5cIiA6IFwibnVtYmVyXCI7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOiB7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiYXJyYXlcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IGRhdGE7XG4gICAgICAgICAgICBpZiAob2JqICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopICE9PSBPYmplY3QucHJvdG90eXBlICYmIFwiY29uc3RydWN0b3JcIiBpbiBvYmogJiYgb2JqLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzc3VlKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBbaXNzLCBpbnB1dCwgaW5zdF0gPSBhcmdzO1xuICAgIGlmICh0eXBlb2YgaXNzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBtZXNzYWdlOiBpc3MsXG4gICAgICAgICAgICBjb2RlOiBcImN1c3RvbVwiLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4geyAuLi5pc3MgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkVudW0ob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG9iailcbiAgICAgICAgLmZpbHRlcigoW2ssIF9dKSA9PiB7XG4gICAgICAgIC8vIHJldHVybiB0cnVlIGlmIE5hTiwgbWVhbmluZyBpdCdzIG5vdCBhIG51bWJlciwgdGh1cyBhIHN0cmluZyBrZXlcbiAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihOdW1iZXIucGFyc2VJbnQoaywgMTApKTtcbiAgICB9KVxuICAgICAgICAubWFwKChlbCkgPT4gZWxbMV0pO1xufVxuLy8gQ29kZWMgdXRpbGl0eSBmdW5jdGlvbnNcbmV4cG9ydCBmdW5jdGlvbiBiYXNlNjRUb1VpbnQ4QXJyYXkoYmFzZTY0KSB7XG4gICAgY29uc3QgYmluYXJ5U3RyaW5nID0gYXRvYihiYXNlNjQpO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5U3RyaW5nLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiaW5hcnlTdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcykge1xuICAgIGxldCBiaW5hcnlTdHJpbmcgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYmluYXJ5U3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYnRvYShiaW5hcnlTdHJpbmcpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NHVybFRvVWludDhBcnJheShiYXNlNjR1cmwpIHtcbiAgICBjb25zdCBiYXNlNjQgPSBiYXNlNjR1cmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgY29uc3QgcGFkZGluZyA9IFwiPVwiLnJlcGVhdCgoNCAtIChiYXNlNjQubGVuZ3RoICUgNCkpICUgNCk7XG4gICAgcmV0dXJuIGJhc2U2NFRvVWludDhBcnJheShiYXNlNjQgKyBwYWRkaW5nKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9CYXNlNjR1cmwoYnl0ZXMpIHtcbiAgICByZXR1cm4gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzKS5yZXBsYWNlKC9cXCsvZywgXCItXCIpLnJlcGxhY2UoL1xcLy9nLCBcIl9cIikucmVwbGFjZSgvPS9nLCBcIlwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1VpbnQ4QXJyYXkoaGV4KSB7XG4gICAgY29uc3QgY2xlYW5IZXggPSBoZXgucmVwbGFjZSgvXjB4LywgXCJcIik7XG4gICAgaWYgKGNsZWFuSGV4Lmxlbmd0aCAlIDIgIT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBoZXggc3RyaW5nIGxlbmd0aFwiKTtcbiAgICB9XG4gICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShjbGVhbkhleC5sZW5ndGggLyAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsZWFuSGV4Lmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGJ5dGVzW2kgLyAyXSA9IE51bWJlci5wYXJzZUludChjbGVhbkhleC5zbGljZShpLCBpICsgMiksIDE2KTtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0hleChieXRlcykge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGJ5dGVzKVxuICAgICAgICAubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpXG4gICAgICAgIC5qb2luKFwiXCIpO1xufVxuLy8gaW5zdGFuY2VvZlxuZXhwb3J0IGNsYXNzIENsYXNzIHtcbiAgICBjb25zdHJ1Y3RvciguLi5fYXJncykgeyB9XG59XG4iLCJpbXBvcnQgeyAkY29uc3RydWN0b3IgfSBmcm9tIFwiLi9jb3JlLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbmNvbnN0IGluaXRpYWxpemVyID0gKGluc3QsIGRlZikgPT4ge1xuICAgIGluc3QubmFtZSA9IFwiJFpvZEVycm9yXCI7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3QsIFwiX3pvZFwiLCB7XG4gICAgICAgIHZhbHVlOiBpbnN0Ll96b2QsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcImlzc3Vlc1wiLCB7XG4gICAgICAgIHZhbHVlOiBkZWYsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIH0pO1xuICAgIGluc3QubWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGRlZiwgdXRpbC5qc29uU3RyaW5naWZ5UmVwbGFjZXIsIDIpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcInRvU3RyaW5nXCIsIHtcbiAgICAgICAgdmFsdWU6ICgpID0+IGluc3QubWVzc2FnZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0ICRab2RFcnJvciA9ICRjb25zdHJ1Y3RvcihcIiRab2RFcnJvclwiLCBpbml0aWFsaXplcik7XG5leHBvcnQgY29uc3QgJFpvZFJlYWxFcnJvciA9ICRjb25zdHJ1Y3RvcihcIiRab2RFcnJvclwiLCBpbml0aWFsaXplciwgeyBQYXJlbnQ6IEVycm9yIH0pO1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5FcnJvcihlcnJvciwgbWFwcGVyID0gKGlzc3VlKSA9PiBpc3N1ZS5tZXNzYWdlKSB7XG4gICAgY29uc3QgZmllbGRFcnJvcnMgPSB7fTtcbiAgICBjb25zdCBmb3JtRXJyb3JzID0gW107XG4gICAgZm9yIChjb25zdCBzdWIgb2YgZXJyb3IuaXNzdWVzKSB7XG4gICAgICAgIGlmIChzdWIucGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmaWVsZEVycm9yc1tzdWIucGF0aFswXV0gPSBmaWVsZEVycm9yc1tzdWIucGF0aFswXV0gfHwgW107XG4gICAgICAgICAgICBmaWVsZEVycm9yc1tzdWIucGF0aFswXV0ucHVzaChtYXBwZXIoc3ViKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3JtRXJyb3JzLnB1c2gobWFwcGVyKHN1YikpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGZvcm1FcnJvcnMsIGZpZWxkRXJyb3JzIH07XG59XG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RXJyb3IoZXJyb3IsIG1hcHBlciA9IChpc3N1ZSkgPT4gaXNzdWUubWVzc2FnZSkge1xuICAgIGNvbnN0IGZpZWxkRXJyb3JzID0geyBfZXJyb3JzOiBbXSB9O1xuICAgIGNvbnN0IHByb2Nlc3NFcnJvciA9IChlcnJvciwgcGF0aCA9IFtdKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgaXNzdWUgb2YgZXJyb3IuaXNzdWVzKSB7XG4gICAgICAgICAgICBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX3VuaW9uXCIgJiYgaXNzdWUuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlzc3VlLmVycm9ycy5tYXAoKGlzc3VlcykgPT4gcHJvY2Vzc0Vycm9yKHsgaXNzdWVzIH0sIFsuLi5wYXRoLCAuLi5pc3N1ZS5wYXRoXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX2tleVwiKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0Vycm9yKHsgaXNzdWVzOiBpc3N1ZS5pc3N1ZXMgfSwgWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF9lbGVtZW50XCIpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzRXJyb3IoeyBpc3N1ZXM6IGlzc3VlLmlzc3VlcyB9LCBbLi4ucGF0aCwgLi4uaXNzdWUucGF0aF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnVsbHBhdGggPSBbLi4ucGF0aCwgLi4uaXNzdWUucGF0aF07XG4gICAgICAgICAgICAgICAgaWYgKGZ1bGxwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZEVycm9ycy5fZXJyb3JzLnB1c2gobWFwcGVyKGlzc3VlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY3VyciA9IGZpZWxkRXJyb3JzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgZnVsbHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGZ1bGxwYXRoW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVybWluYWwgPSBpID09PSBmdWxscGF0aC5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0ZXJtaW5hbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgeyBfZXJyb3JzOiBbXSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycltlbF0gPSBjdXJyW2VsXSB8fCB7IF9lcnJvcnM6IFtdIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycltlbF0uX2Vycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyciA9IGN1cnJbZWxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm9jZXNzRXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiBmaWVsZEVycm9ycztcbn1cbmV4cG9ydCBmdW5jdGlvbiB0cmVlaWZ5RXJyb3IoZXJyb3IsIG1hcHBlciA9IChpc3N1ZSkgPT4gaXNzdWUubWVzc2FnZSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZXJyb3JzOiBbXSB9O1xuICAgIGNvbnN0IHByb2Nlc3NFcnJvciA9IChlcnJvciwgcGF0aCA9IFtdKSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGZvciAoY29uc3QgaXNzdWUgb2YgZXJyb3IuaXNzdWVzKSB7XG4gICAgICAgICAgICBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX3VuaW9uXCIgJiYgaXNzdWUuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgdW5pb24gZXJyb3JcbiAgICAgICAgICAgICAgICBpc3N1ZS5lcnJvcnMubWFwKChpc3N1ZXMpID0+IHByb2Nlc3NFcnJvcih7IGlzc3VlcyB9LCBbLi4ucGF0aCwgLi4uaXNzdWUucGF0aF0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF9rZXlcIikge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NFcnJvcih7IGlzc3VlczogaXNzdWUuaXNzdWVzIH0sIFsuLi5wYXRoLCAuLi5pc3N1ZS5wYXRoXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0Vycm9yKHsgaXNzdWVzOiBpc3N1ZS5pc3N1ZXMgfSwgWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxwYXRoID0gWy4uLnBhdGgsIC4uLmlzc3VlLnBhdGhdO1xuICAgICAgICAgICAgICAgIGlmIChmdWxscGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmVycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGN1cnIgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpIDwgZnVsbHBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZnVsbHBhdGhbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmFsID0gaSA9PT0gZnVsbHBhdGgubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyci5wcm9wZXJ0aWVzID8/IChjdXJyLnByb3BlcnRpZXMgPSB7fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSBjdXJyLnByb3BlcnRpZXMpW2VsXSA/PyAoX2FbZWxdID0geyBlcnJvcnM6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyciA9IGN1cnIucHJvcGVydGllc1tlbF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyLml0ZW1zID8/IChjdXJyLml0ZW1zID0gW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgKF9iID0gY3Vyci5pdGVtcylbZWxdID8/IChfYltlbF0gPSB7IGVycm9yczogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyID0gY3Vyci5pdGVtc1tlbF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlcm1pbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyLmVycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb2Nlc3NFcnJvcihlcnJvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBGb3JtYXQgYSBab2RFcnJvciBhcyBhIGh1bWFuLXJlYWRhYmxlIHN0cmluZyBpbiB0aGUgZm9sbG93aW5nIGZvcm0uXG4gKlxuICogRnJvbVxuICpcbiAqIGBgYHRzXG4gKiBab2RFcnJvciB7XG4gKiAgIGlzc3VlczogW1xuICogICAgIHtcbiAqICAgICAgIGV4cGVjdGVkOiAnc3RyaW5nJyxcbiAqICAgICAgIGNvZGU6ICdpbnZhbGlkX3R5cGUnLFxuICogICAgICAgcGF0aDogWyAndXNlcm5hbWUnIF0sXG4gKiAgICAgICBtZXNzYWdlOiAnSW52YWxpZCBpbnB1dDogZXhwZWN0ZWQgc3RyaW5nJ1xuICogICAgIH0sXG4gKiAgICAge1xuICogICAgICAgZXhwZWN0ZWQ6ICdudW1iZXInLFxuICogICAgICAgY29kZTogJ2ludmFsaWRfdHlwZScsXG4gKiAgICAgICBwYXRoOiBbICdmYXZvcml0ZU51bWJlcnMnLCAxIF0sXG4gKiAgICAgICBtZXNzYWdlOiAnSW52YWxpZCBpbnB1dDogZXhwZWN0ZWQgbnVtYmVyJ1xuICogICAgIH1cbiAqICAgXTtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIHRvXG4gKlxuICogYGBgXG4gKiB1c2VybmFtZVxuICogICDinJYgRXhwZWN0ZWQgbnVtYmVyLCByZWNlaXZlZCBzdHJpbmcgYXQgXCJ1c2VybmFtZVxuICogZmF2b3JpdGVOdW1iZXJzWzBdXG4gKiAgIOKcliBJbnZhbGlkIGlucHV0OiBleHBlY3RlZCBudW1iZXJcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9Eb3RQYXRoKF9wYXRoKSB7XG4gICAgY29uc3Qgc2VncyA9IFtdO1xuICAgIGNvbnN0IHBhdGggPSBfcGF0aC5tYXAoKHNlZykgPT4gKHR5cGVvZiBzZWcgPT09IFwib2JqZWN0XCIgPyBzZWcua2V5IDogc2VnKSk7XG4gICAgZm9yIChjb25zdCBzZWcgb2YgcGF0aCkge1xuICAgICAgICBpZiAodHlwZW9mIHNlZyA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHNlZ3MucHVzaChgWyR7c2VnfV1gKTtcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHNlZyA9PT0gXCJzeW1ib2xcIilcbiAgICAgICAgICAgIHNlZ3MucHVzaChgWyR7SlNPTi5zdHJpbmdpZnkoU3RyaW5nKHNlZykpfV1gKTtcbiAgICAgICAgZWxzZSBpZiAoL1teXFx3JF0vLnRlc3Qoc2VnKSlcbiAgICAgICAgICAgIHNlZ3MucHVzaChgWyR7SlNPTi5zdHJpbmdpZnkoc2VnKX1dYCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNlZ3MubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHNlZ3MucHVzaChcIi5cIik7XG4gICAgICAgICAgICBzZWdzLnB1c2goc2VnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2Vncy5qb2luKFwiXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByZXR0aWZ5RXJyb3IoZXJyb3IpIHtcbiAgICBjb25zdCBsaW5lcyA9IFtdO1xuICAgIC8vIHNvcnQgYnkgcGF0aCBsZW5ndGhcbiAgICBjb25zdCBpc3N1ZXMgPSBbLi4uZXJyb3IuaXNzdWVzXS5zb3J0KChhLCBiKSA9PiAoYS5wYXRoID8/IFtdKS5sZW5ndGggLSAoYi5wYXRoID8/IFtdKS5sZW5ndGgpO1xuICAgIC8vIFByb2Nlc3MgZWFjaCBpc3N1ZVxuICAgIGZvciAoY29uc3QgaXNzdWUgb2YgaXNzdWVzKSB7XG4gICAgICAgIGxpbmVzLnB1c2goYOKcliAke2lzc3VlLm1lc3NhZ2V9YCk7XG4gICAgICAgIGlmIChpc3N1ZS5wYXRoPy5sZW5ndGgpXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAgIOKGkiBhdCAke3RvRG90UGF0aChpc3N1ZS5wYXRoKX1gKTtcbiAgICB9XG4gICAgLy8gQ29udmVydCBNYXAgdG8gZm9ybWF0dGVkIHN0cmluZ1xuICAgIHJldHVybiBsaW5lcy5qb2luKFwiXFxuXCIpO1xufVxuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlLmpzXCI7XG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSBcIi4vZXJyb3JzLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbmV4cG9ydCBjb25zdCBfcGFyc2UgPSAoX0VycikgPT4gKHNjaGVtYSwgdmFsdWUsIF9jdHgsIF9wYXJhbXMpID0+IHtcbiAgICBjb25zdCBjdHggPSBfY3R4ID8geyAuLi5fY3R4LCBhc3luYzogZmFsc2UgfSA6IHsgYXN5bmM6IGZhbHNlIH07XG4gICAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLl96b2QucnVuKHsgdmFsdWUsIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kQXN5bmNFcnJvcigpO1xuICAgIH1cbiAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZSA9IG5ldyAoX3BhcmFtcz8uRXJyID8/IF9FcnIpKHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpKTtcbiAgICAgICAgdXRpbC5jYXB0dXJlU3RhY2tUcmFjZShlLCBfcGFyYW1zPy5jYWxsZWUpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xufTtcbmV4cG9ydCBjb25zdCBwYXJzZSA9IC8qIEBfX1BVUkVfXyovIF9wYXJzZShlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX3BhcnNlQXN5bmMgPSAoX0VycikgPT4gYXN5bmMgKHNjaGVtYSwgdmFsdWUsIF9jdHgsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGFzeW5jOiB0cnVlIH0gOiB7IGFzeW5jOiB0cnVlIH07XG4gICAgbGV0IHJlc3VsdCA9IHNjaGVtYS5fem9kLnJ1bih7IHZhbHVlLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlc3VsdDtcbiAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZSA9IG5ldyAocGFyYW1zPy5FcnIgPz8gX0VycikocmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSkpO1xuICAgICAgICB1dGlsLmNhcHR1cmVTdGFja1RyYWNlKGUsIHBhcmFtcz8uY2FsbGVlKTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbn07XG5leHBvcnQgY29uc3QgcGFyc2VBc3luYyA9IC8qIEBfX1BVUkVfXyovIF9wYXJzZUFzeW5jKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfc2FmZVBhcnNlID0gKF9FcnIpID0+IChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgY29uc3QgY3R4ID0gX2N0eCA/IHsgLi4uX2N0eCwgYXN5bmM6IGZhbHNlIH0gOiB7IGFzeW5jOiBmYWxzZSB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5fem9kLnJ1bih7IHZhbHVlLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IGNvcmUuJFpvZEFzeW5jRXJyb3IoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC5pc3N1ZXMubGVuZ3RoXG4gICAgICAgID8ge1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogbmV3IChfRXJyID8/IGVycm9ycy4kWm9kRXJyb3IpKHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpKSxcbiAgICAgICAgfVxuICAgICAgICA6IHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0LnZhbHVlIH07XG59O1xuZXhwb3J0IGNvbnN0IHNhZmVQYXJzZSA9IC8qIEBfX1BVUkVfXyovIF9zYWZlUGFyc2UoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9zYWZlUGFyc2VBc3luYyA9IChfRXJyKSA9PiBhc3luYyAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGFzeW5jOiB0cnVlIH0gOiB7IGFzeW5jOiB0cnVlIH07XG4gICAgbGV0IHJlc3VsdCA9IHNjaGVtYS5fem9kLnJ1bih7IHZhbHVlLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpXG4gICAgICAgIHJlc3VsdCA9IGF3YWl0IHJlc3VsdDtcbiAgICByZXR1cm4gcmVzdWx0Lmlzc3Vlcy5sZW5ndGhcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiBuZXcgX0VycihyZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSksXG4gICAgICAgIH1cbiAgICAgICAgOiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdC52YWx1ZSB9O1xufTtcbmV4cG9ydCBjb25zdCBzYWZlUGFyc2VBc3luYyA9IC8qIEBfX1BVUkVfXyovIF9zYWZlUGFyc2VBc3luYyhlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX2VuY29kZSA9IChfRXJyKSA9PiAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH0gOiB7IGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH07XG4gICAgcmV0dXJuIF9wYXJzZShfRXJyKShzY2hlbWEsIHZhbHVlLCBjdHgpO1xufTtcbmV4cG9ydCBjb25zdCBlbmNvZGUgPSAvKiBAX19QVVJFX18qLyBfZW5jb2RlKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfZGVjb2RlID0gKF9FcnIpID0+IChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgcmV0dXJuIF9wYXJzZShfRXJyKShzY2hlbWEsIHZhbHVlLCBfY3R4KTtcbn07XG5leHBvcnQgY29uc3QgZGVjb2RlID0gLyogQF9fUFVSRV9fKi8gX2RlY29kZShlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX2VuY29kZUFzeW5jID0gKF9FcnIpID0+IGFzeW5jIChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgY29uc3QgY3R4ID0gX2N0eCA/IHsgLi4uX2N0eCwgZGlyZWN0aW9uOiBcImJhY2t3YXJkXCIgfSA6IHsgZGlyZWN0aW9uOiBcImJhY2t3YXJkXCIgfTtcbiAgICByZXR1cm4gX3BhcnNlQXN5bmMoX0Vycikoc2NoZW1hLCB2YWx1ZSwgY3R4KTtcbn07XG5leHBvcnQgY29uc3QgZW5jb2RlQXN5bmMgPSAvKiBAX19QVVJFX18qLyBfZW5jb2RlQXN5bmMoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9kZWNvZGVBc3luYyA9IChfRXJyKSA9PiBhc3luYyAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIHJldHVybiBfcGFyc2VBc3luYyhfRXJyKShzY2hlbWEsIHZhbHVlLCBfY3R4KTtcbn07XG5leHBvcnQgY29uc3QgZGVjb2RlQXN5bmMgPSAvKiBAX19QVVJFX18qLyBfZGVjb2RlQXN5bmMoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9zYWZlRW5jb2RlID0gKF9FcnIpID0+IChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgY29uc3QgY3R4ID0gX2N0eCA/IHsgLi4uX2N0eCwgZGlyZWN0aW9uOiBcImJhY2t3YXJkXCIgfSA6IHsgZGlyZWN0aW9uOiBcImJhY2t3YXJkXCIgfTtcbiAgICByZXR1cm4gX3NhZmVQYXJzZShfRXJyKShzY2hlbWEsIHZhbHVlLCBjdHgpO1xufTtcbmV4cG9ydCBjb25zdCBzYWZlRW5jb2RlID0gLyogQF9fUFVSRV9fKi8gX3NhZmVFbmNvZGUoZXJyb3JzLiRab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IF9zYWZlRGVjb2RlID0gKF9FcnIpID0+IChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgcmV0dXJuIF9zYWZlUGFyc2UoX0Vycikoc2NoZW1hLCB2YWx1ZSwgX2N0eCk7XG59O1xuZXhwb3J0IGNvbnN0IHNhZmVEZWNvZGUgPSAvKiBAX19QVVJFX18qLyBfc2FmZURlY29kZShlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgX3NhZmVFbmNvZGVBc3luYyA9IChfRXJyKSA9PiBhc3luYyAoc2NoZW1hLCB2YWx1ZSwgX2N0eCkgPT4ge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPyB7IC4uLl9jdHgsIGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH0gOiB7IGRpcmVjdGlvbjogXCJiYWNrd2FyZFwiIH07XG4gICAgcmV0dXJuIF9zYWZlUGFyc2VBc3luYyhfRXJyKShzY2hlbWEsIHZhbHVlLCBjdHgpO1xufTtcbmV4cG9ydCBjb25zdCBzYWZlRW5jb2RlQXN5bmMgPSAvKiBAX19QVVJFX18qLyBfc2FmZUVuY29kZUFzeW5jKGVycm9ycy4kWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBfc2FmZURlY29kZUFzeW5jID0gKF9FcnIpID0+IGFzeW5jIChzY2hlbWEsIHZhbHVlLCBfY3R4KSA9PiB7XG4gICAgcmV0dXJuIF9zYWZlUGFyc2VBc3luYyhfRXJyKShzY2hlbWEsIHZhbHVlLCBfY3R4KTtcbn07XG5leHBvcnQgY29uc3Qgc2FmZURlY29kZUFzeW5jID0gLyogQF9fUFVSRV9fKi8gX3NhZmVEZWNvZGVBc3luYyhlcnJvcnMuJFpvZFJlYWxFcnJvcik7XG4iLCJpbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbi8qKlxuICogQGRlcHJlY2F0ZWQgQ1VJRCB2MSBpcyBkZXByZWNhdGVkIGJ5IGl0cyBhdXRob3JzIGR1ZSB0byBpbmZvcm1hdGlvbiBsZWFrYWdlXG4gKiAodGltZXN0YW1wcyBlbWJlZGRlZCBpbiB0aGUgaWQpLiBVc2Uge0BsaW5rIGN1aWQyfSBpbnN0ZWFkLlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXJhbGxlbGRyaXZlL2N1aWQuXG4gKi9cbmV4cG9ydCBjb25zdCBjdWlkID0gL15bY0NdWzAtOWEtel17Nix9JC87XG5leHBvcnQgY29uc3QgY3VpZDIgPSAvXlswLTlhLXpdKyQvO1xuZXhwb3J0IGNvbnN0IHVsaWQgPSAvXlswLTlBLUhKS01OUC1UVi1aYS1oamttbnAtdHYtel17MjZ9JC87XG5leHBvcnQgY29uc3QgeGlkID0gL15bMC05YS12QS1WXXsyMH0kLztcbmV4cG9ydCBjb25zdCBrc3VpZCA9IC9eW0EtWmEtejAtOV17Mjd9JC87XG5leHBvcnQgY29uc3QgbmFub2lkID0gL15bYS16QS1aMC05Xy1dezIxfSQvO1xuLyoqIElTTyA4NjAxLTEgZHVyYXRpb24gcmVnZXguIERvZXMgbm90IHN1cHBvcnQgdGhlIDg2MDEtMiBleHRlbnNpb25zIGxpa2UgbmVnYXRpdmUgZHVyYXRpb25zIG9yIGZyYWN0aW9uYWwvbmVnYXRpdmUgY29tcG9uZW50cy4gKi9cbmV4cG9ydCBjb25zdCBkdXJhdGlvbiA9IC9eUCg/OihcXGQrVyl8KD8hLipXKSg/PVxcZHxUXFxkKShcXGQrWSk/KFxcZCtNKT8oXFxkK0QpPyhUKD89XFxkKShcXGQrSCk/KFxcZCtNKT8oXFxkKyhbLixdXFxkKyk/Uyk/KT8pJC87XG4vKiogSW1wbGVtZW50cyBJU08gODYwMS0yIGV4dGVuc2lvbnMgbGlrZSBleHBsaWNpdCArLSBwcmVmaXhlcywgbWl4aW5nIHdlZWtzIHdpdGggb3RoZXIgdW5pdHMsIGFuZCBmcmFjdGlvbmFsL25lZ2F0aXZlIGNvbXBvbmVudHMuICovXG5leHBvcnQgY29uc3QgZXh0ZW5kZWREdXJhdGlvbiA9IC9eWy0rXT9QKD8hJCkoPzooPzpbLStdP1xcZCtZKXwoPzpbLStdP1xcZCtbLixdXFxkK1kkKSk/KD86KD86Wy0rXT9cXGQrTSl8KD86Wy0rXT9cXGQrWy4sXVxcZCtNJCkpPyg/Oig/OlstK10/XFxkK1cpfCg/OlstK10/XFxkK1suLF1cXGQrVyQpKT8oPzooPzpbLStdP1xcZCtEKXwoPzpbLStdP1xcZCtbLixdXFxkK0QkKSk/KD86VCg/PVtcXGQrLV0pKD86KD86Wy0rXT9cXGQrSCl8KD86Wy0rXT9cXGQrWy4sXVxcZCtIJCkpPyg/Oig/OlstK10/XFxkK00pfCg/OlstK10/XFxkK1suLF1cXGQrTSQpKT8oPzpbLStdP1xcZCsoPzpbLixdXFxkKyk/Uyk/KT8/JC87XG4vKiogQSByZWdleCBmb3IgYW55IFVVSUQtbGlrZSBpZGVudGlmaWVyOiA4LTQtNC00LTEyIGhleCBwYXR0ZXJuICovXG5leHBvcnQgY29uc3QgZ3VpZCA9IC9eKFswLTlhLWZBLUZdezh9LVswLTlhLWZBLUZdezR9LVswLTlhLWZBLUZdezR9LVswLTlhLWZBLUZdezR9LVswLTlhLWZBLUZdezEyfSkkLztcbi8qKiBSZXR1cm5zIGEgcmVnZXggZm9yIHZhbGlkYXRpbmcgYW4gUkZDIDk1NjIvNDEyMiBVVUlELlxuICpcbiAqIEBwYXJhbSB2ZXJzaW9uIE9wdGlvbmFsbHkgc3BlY2lmeSBhIHZlcnNpb24gMS04LiBJZiBubyB2ZXJzaW9uIGlzIHNwZWNpZmllZCwgYWxsIHZlcnNpb25zIGFyZSBzdXBwb3J0ZWQuICovXG5leHBvcnQgY29uc3QgdXVpZCA9ICh2ZXJzaW9uKSA9PiB7XG4gICAgaWYgKCF2ZXJzaW9uKVxuICAgICAgICByZXR1cm4gL14oWzAtOWEtZkEtRl17OH0tWzAtOWEtZkEtRl17NH0tWzEtOF1bMC05YS1mQS1GXXszfS1bODlhYkFCXVswLTlhLWZBLUZdezN9LVswLTlhLWZBLUZdezEyfXwwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDB8ZmZmZmZmZmYtZmZmZi1mZmZmLWZmZmYtZmZmZmZmZmZmZmZmKSQvO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBeKFswLTlhLWZBLUZdezh9LVswLTlhLWZBLUZdezR9LSR7dmVyc2lvbn1bMC05YS1mQS1GXXszfS1bODlhYkFCXVswLTlhLWZBLUZdezN9LVswLTlhLWZBLUZdezEyfSkkYCk7XG59O1xuZXhwb3J0IGNvbnN0IHV1aWQ0ID0gLypAX19QVVJFX18qLyB1dWlkKDQpO1xuZXhwb3J0IGNvbnN0IHV1aWQ2ID0gLypAX19QVVJFX18qLyB1dWlkKDYpO1xuZXhwb3J0IGNvbnN0IHV1aWQ3ID0gLypAX19QVVJFX18qLyB1dWlkKDcpO1xuLyoqIFByYWN0aWNhbCBlbWFpbCB2YWxpZGF0aW9uICovXG5leHBvcnQgY29uc3QgZW1haWwgPSAvXig/IVxcLikoPyEuKlxcLlxcLikoW0EtWmEtejAtOV8nK1xcLVxcLl0qKVtBLVphLXowLTlfKy1dQChbQS1aYS16MC05XVtBLVphLXowLTlcXC1dKlxcLikrW0EtWmEtel17Mix9JC87XG4vKiogRXF1aXZhbGVudCB0byB0aGUgSFRNTDUgaW5wdXRbdHlwZT1lbWFpbF0gdmFsaWRhdGlvbiBpbXBsZW1lbnRlZCBieSBicm93c2Vycy4gU291cmNlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvaW5wdXQvZW1haWwgKi9cbmV4cG9ydCBjb25zdCBodG1sNUVtYWlsID0gL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuLyoqIFRoZSBjbGFzc2ljIGVtYWlscmVnZXguY29tIHJlZ2V4IGZvciBSRkMgNTMyMi1jb21wbGlhbnQgZW1haWxzICovXG5leHBvcnQgY29uc3QgcmZjNTMyMkVtYWlsID0gL14oKFtePD4oKVxcW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpXFxbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC87XG4vKiogQSBsb29zZSByZWdleCB0aGF0IGFsbG93cyBVbmljb2RlIGNoYXJhY3RlcnMsIGVuZm9yY2VzIGxlbmd0aCBsaW1pdHMsIGFuZCB0aGF0J3MgYWJvdXQgaXQuICovXG5leHBvcnQgY29uc3QgdW5pY29kZUVtYWlsID0gL15bXlxcc0BcIl17MSw2NH1AW15cXHNAXXsxLDI1NX0kL3U7XG5leHBvcnQgY29uc3QgaWRuRW1haWwgPSB1bmljb2RlRW1haWw7XG5leHBvcnQgY29uc3QgYnJvd3NlckVtYWlsID0gL15bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dK0BbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuLy8gZnJvbSBodHRwczovL3RoZWtldmluc2NvdHQuY29tL2Vtb2ppcy1pbi1qYXZhc2NyaXB0LyN3cml0aW5nLWEtcmVndWxhci1leHByZXNzaW9uXG5jb25zdCBfZW1vamkgPSBgXihcXFxccHtFeHRlbmRlZF9QaWN0b2dyYXBoaWN9fFxcXFxwe0Vtb2ppX0NvbXBvbmVudH0pKyRgO1xuZXhwb3J0IGZ1bmN0aW9uIGVtb2ppKCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKF9lbW9qaSwgXCJ1XCIpO1xufVxuZXhwb3J0IGNvbnN0IGlwdjQgPSAvXig/Oig/OjI1WzAtNV18MlswLTRdWzAtOV18MVswLTldWzAtOV18WzEtOV1bMC05XXxbMC05XSlcXC4pezN9KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKSQvO1xuZXhwb3J0IGNvbnN0IGlwdjYgPSAvXigoWzAtOWEtZkEtRl17MSw0fTopezd9WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsN306fChbMC05YS1mQS1GXXsxLDR9Oil7MSw2fTpbMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw1fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwyfXwoWzAtOWEtZkEtRl17MSw0fTopezEsNH0oOlswLTlhLWZBLUZdezEsNH0pezEsM318KFswLTlhLWZBLUZdezEsNH06KXsxLDN9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwyfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw1fXxbMC05YS1mQS1GXXsxLDR9OigoOlswLTlhLWZBLUZdezEsNH0pezEsNn0pfDooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDd9fDopKSQvO1xuZXhwb3J0IGNvbnN0IG1hYyA9IChkZWxpbWl0ZXIpID0+IHtcbiAgICBjb25zdCBlc2NhcGVkRGVsaW0gPSB1dGlsLmVzY2FwZVJlZ2V4KGRlbGltaXRlciA/PyBcIjpcIik7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4oPzpbMC05QS1GXXsyfSR7ZXNjYXBlZERlbGltfSl7NX1bMC05QS1GXXsyfSR8Xig/OlswLTlhLWZdezJ9JHtlc2NhcGVkRGVsaW19KXs1fVswLTlhLWZdezJ9JGApO1xufTtcbmV4cG9ydCBjb25zdCBjaWRydjQgPSAvXigoMjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLil7M30oMjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLyhbMC05XXxbMS0yXVswLTldfDNbMC0yXSkkLztcbmV4cG9ydCBjb25zdCBjaWRydjYgPSAvXigoWzAtOWEtZkEtRl17MSw0fTopezd9WzAtOWEtZkEtRl17MSw0fXw6OnwoWzAtOWEtZkEtRl17MSw0fSk/OjooWzAtOWEtZkEtRl17MSw0fTo/KXswLDZ9KVxcLygxMlswLThdfDFbMDFdWzAtOV18WzEtOV0/WzAtOV0pJC87XG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83ODYwMzkyL2RldGVybWluZS1pZi1zdHJpbmctaXMtaW4tYmFzZTY0LXVzaW5nLWphdmFzY3JpcHRcbmV4cG9ydCBjb25zdCBiYXNlNjQgPSAvXiR8Xig/OlswLTlhLXpBLVorL117NH0pKig/Oig/OlswLTlhLXpBLVorL117Mn09PSl8KD86WzAtOWEtekEtWisvXXszfT0pKT8kLztcbmV4cG9ydCBjb25zdCBiYXNlNjR1cmwgPSAvXltBLVphLXowLTlfLV0qJC87XG4vLyBiYXNlZCBvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDYxNzkvcmVndWxhci1leHByZXNzaW9uLXRvLW1hdGNoLWRucy1ob3N0bmFtZS1vci1pcC1hZGRyZXNzXG4vLyBleHBvcnQgY29uc3QgaG9zdG5hbWU6IFJlZ0V4cCA9IC9eKFthLXpBLVowLTktXStcXC4pKlthLXpBLVowLTktXSskLztcbmV4cG9ydCBjb25zdCBob3N0bmFtZSA9IC9eKD89LnsxLDI1M31cXC4/JClbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlstMC05YS16QS1aXXswLDYxfVswLTlhLXpBLVpdKT8pKlxcLj8kLztcbmV4cG9ydCBjb25zdCBkb21haW4gPSAvXihbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT9cXC4pK1thLXpBLVpdezIsfSQvO1xuZXhwb3J0IGNvbnN0IGh0dHBQcm90b2NvbCA9IC9eaHR0cHM/JC87XG4vLyBodHRwczovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL3ZhbGlkYXRlLXBob25lLW51bWJlciNyNC0zIChyZWdleCBzYW5zIHNwYWNlcylcbi8vIEUuMTY0OiBsZWFkaW5nIGRpZ2l0IG11c3QgYmUgMS05OyB0b3RhbCBkaWdpdHMgKGV4Y2x1ZGluZyAnKycpIGJldHdlZW4gNy0xNVxuZXhwb3J0IGNvbnN0IGUxNjQgPSAvXlxcK1sxLTldXFxkezYsMTR9JC87XG4vLyBjb25zdCBkYXRlU291cmNlID0gYCgoXFxcXGRcXFxcZFsyNDY4XVswNDhdfFxcXFxkXFxcXGRbMTM1NzldWzI2XXxcXFxcZFxcXFxkMFs0OF18WzAyNDY4XVswNDhdMDB8WzEzNTc5XVsyNl0wMCktMDItMjl8XFxcXGR7NH0tKCgwWzEzNTc4XXwxWzAyXSktKDBbMS05XXxbMTJdXFxcXGR8M1swMV0pfCgwWzQ2OV18MTEpLSgwWzEtOV18WzEyXVxcXFxkfDMwKXwoMDIpLSgwWzEtOV18MVxcXFxkfDJbMC04XSkpKWA7XG5jb25zdCBkYXRlU291cmNlID0gYCg/Oig/OlxcXFxkXFxcXGRbMjQ2OF1bMDQ4XXxcXFxcZFxcXFxkWzEzNTc5XVsyNl18XFxcXGRcXFxcZDBbNDhdfFswMjQ2OF1bMDQ4XTAwfFsxMzU3OV1bMjZdMDApLTAyLTI5fFxcXFxkezR9LSg/Oig/OjBbMTM1NzhdfDFbMDJdKS0oPzowWzEtOV18WzEyXVxcXFxkfDNbMDFdKXwoPzowWzQ2OV18MTEpLSg/OjBbMS05XXxbMTJdXFxcXGR8MzApfCg/OjAyKS0oPzowWzEtOV18MVxcXFxkfDJbMC04XSkpKWA7XG5leHBvcnQgY29uc3QgZGF0ZSA9IC8qQF9fUFVSRV9fKi8gbmV3IFJlZ0V4cChgXiR7ZGF0ZVNvdXJjZX0kYCk7XG5mdW5jdGlvbiB0aW1lU291cmNlKGFyZ3MpIHtcbiAgICBjb25zdCBoaG1tID0gYCg/OlswMV1cXFxcZHwyWzAtM10pOlswLTVdXFxcXGRgO1xuICAgIGNvbnN0IHJlZ2V4ID0gdHlwZW9mIGFyZ3MucHJlY2lzaW9uID09PSBcIm51bWJlclwiXG4gICAgICAgID8gYXJncy5wcmVjaXNpb24gPT09IC0xXG4gICAgICAgICAgICA/IGAke2hobW19YFxuICAgICAgICAgICAgOiBhcmdzLnByZWNpc2lvbiA9PT0gMFxuICAgICAgICAgICAgICAgID8gYCR7aGhtbX06WzAtNV1cXFxcZGBcbiAgICAgICAgICAgICAgICA6IGAke2hobW19OlswLTVdXFxcXGRcXFxcLlxcXFxkeyR7YXJncy5wcmVjaXNpb259fWBcbiAgICAgICAgOiBgJHtoaG1tfSg/OjpbMC01XVxcXFxkKD86XFxcXC5cXFxcZCspPyk/YDtcbiAgICByZXR1cm4gcmVnZXg7XG59XG5leHBvcnQgZnVuY3Rpb24gdGltZShhcmdzKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke3RpbWVTb3VyY2UoYXJncyl9JGApO1xufVxuLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTQzMjMxXG5leHBvcnQgZnVuY3Rpb24gZGF0ZXRpbWUoYXJncykge1xuICAgIGNvbnN0IHRpbWUgPSB0aW1lU291cmNlKHsgcHJlY2lzaW9uOiBhcmdzLnByZWNpc2lvbiB9KTtcbiAgICBjb25zdCBvcHRzID0gW1wiWlwiXTtcbiAgICBpZiAoYXJncy5sb2NhbClcbiAgICAgICAgb3B0cy5wdXNoKFwiXCIpO1xuICAgIC8vIGlmIChhcmdzLm9mZnNldCkgb3B0cy5wdXNoKGAoWystXVxcXFxkezJ9OlxcXFxkezJ9KWApO1xuICAgIGlmIChhcmdzLm9mZnNldClcbiAgICAgICAgb3B0cy5wdXNoKGAoWystXSg/OlswMV1cXFxcZHwyWzAtM10pOlswLTVdXFxcXGQpYCk7XG4gICAgY29uc3QgdGltZVJlZ2V4ID0gYCR7dGltZX0oPzoke29wdHMuam9pbihcInxcIil9KWA7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke2RhdGVTb3VyY2V9VCg/OiR7dGltZVJlZ2V4fSkkYCk7XG59XG5leHBvcnQgY29uc3Qgc3RyaW5nID0gKHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IHJlZ2V4ID0gcGFyYW1zID8gYFtcXFxcc1xcXFxTXXske3BhcmFtcz8ubWluaW11bSA/PyAwfSwke3BhcmFtcz8ubWF4aW11bSA/PyBcIlwifX1gIDogYFtcXFxcc1xcXFxTXSpgO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBeJHtyZWdleH0kYCk7XG59O1xuZXhwb3J0IGNvbnN0IGJpZ2ludCA9IC9eLT9cXGQrbj8kLztcbmV4cG9ydCBjb25zdCBpbnRlZ2VyID0gL14tP1xcZCskLztcbmV4cG9ydCBjb25zdCBudW1iZXIgPSAvXi0/XFxkKyg/OlxcLlxcZCspPyQvO1xuZXhwb3J0IGNvbnN0IGJvb2xlYW4gPSAvXig/OnRydWV8ZmFsc2UpJC9pO1xuY29uc3QgX251bGwgPSAvXm51bGwkL2k7XG5leHBvcnQgeyBfbnVsbCBhcyBudWxsIH07XG5jb25zdCBfdW5kZWZpbmVkID0gL151bmRlZmluZWQkL2k7XG5leHBvcnQgeyBfdW5kZWZpbmVkIGFzIHVuZGVmaW5lZCB9O1xuLy8gcmVnZXggZm9yIHN0cmluZyB3aXRoIG5vIHVwcGVyY2FzZSBsZXR0ZXJzXG5leHBvcnQgY29uc3QgbG93ZXJjYXNlID0gL15bXkEtWl0qJC87XG4vLyByZWdleCBmb3Igc3RyaW5nIHdpdGggbm8gbG93ZXJjYXNlIGxldHRlcnNcbmV4cG9ydCBjb25zdCB1cHBlcmNhc2UgPSAvXlteYS16XSokLztcbi8vIHJlZ2V4IGZvciBoZXhhZGVjaW1hbCBzdHJpbmdzIChhbnkgbGVuZ3RoKVxuZXhwb3J0IGNvbnN0IGhleCA9IC9eWzAtOWEtZkEtRl0qJC87XG4vLyBIYXNoIHJlZ2V4ZXMgZm9yIGRpZmZlcmVudCBhbGdvcml0aG1zIGFuZCBlbmNvZGluZ3Ncbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYmFzZTY0IHJlZ2V4IHdpdGggZXhhY3QgbGVuZ3RoIGFuZCBwYWRkaW5nXG5mdW5jdGlvbiBmaXhlZEJhc2U2NChib2R5TGVuZ3RoLCBwYWRkaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF5bQS1aYS16MC05Ky9deyR7Ym9keUxlbmd0aH19JHtwYWRkaW5nfSRgKTtcbn1cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjcmVhdGUgYmFzZTY0dXJsIHJlZ2V4IHdpdGggZXhhY3QgbGVuZ3RoIChubyBwYWRkaW5nKVxuZnVuY3Rpb24gZml4ZWRCYXNlNjR1cmwobGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF5bQS1aYS16MC05Xy1deyR7bGVuZ3RofX0kYCk7XG59XG4vLyBNRDUgKDE2IGJ5dGVzKTogYmFzZTY0ID0gMjQgY2hhcnMgdG90YWwgKDIyICsgXCI9PVwiKVxuZXhwb3J0IGNvbnN0IG1kNV9oZXggPSAvXlswLTlhLWZBLUZdezMyfSQvO1xuZXhwb3J0IGNvbnN0IG1kNV9iYXNlNjQgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0KDIyLCBcIj09XCIpO1xuZXhwb3J0IGNvbnN0IG1kNV9iYXNlNjR1cmwgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0dXJsKDIyKTtcbi8vIFNIQTEgKDIwIGJ5dGVzKTogYmFzZTY0ID0gMjggY2hhcnMgdG90YWwgKDI3ICsgXCI9XCIpXG5leHBvcnQgY29uc3Qgc2hhMV9oZXggPSAvXlswLTlhLWZBLUZdezQwfSQvO1xuZXhwb3J0IGNvbnN0IHNoYTFfYmFzZTY0ID0gLypAX19QVVJFX18qLyBmaXhlZEJhc2U2NCgyNywgXCI9XCIpO1xuZXhwb3J0IGNvbnN0IHNoYTFfYmFzZTY0dXJsID0gLypAX19QVVJFX18qLyBmaXhlZEJhc2U2NHVybCgyNyk7XG4vLyBTSEEyNTYgKDMyIGJ5dGVzKTogYmFzZTY0ID0gNDQgY2hhcnMgdG90YWwgKDQzICsgXCI9XCIpXG5leHBvcnQgY29uc3Qgc2hhMjU2X2hleCA9IC9eWzAtOWEtZkEtRl17NjR9JC87XG5leHBvcnQgY29uc3Qgc2hhMjU2X2Jhc2U2NCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjQoNDMsIFwiPVwiKTtcbmV4cG9ydCBjb25zdCBzaGEyNTZfYmFzZTY0dXJsID0gLypAX19QVVJFX18qLyBmaXhlZEJhc2U2NHVybCg0Myk7XG4vLyBTSEEzODQgKDQ4IGJ5dGVzKTogYmFzZTY0ID0gNjQgY2hhcnMgdG90YWwgKG5vIHBhZGRpbmcpXG5leHBvcnQgY29uc3Qgc2hhMzg0X2hleCA9IC9eWzAtOWEtZkEtRl17OTZ9JC87XG5leHBvcnQgY29uc3Qgc2hhMzg0X2Jhc2U2NCA9IC8qQF9fUFVSRV9fKi8gZml4ZWRCYXNlNjQoNjQsIFwiXCIpO1xuZXhwb3J0IGNvbnN0IHNoYTM4NF9iYXNlNjR1cmwgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0dXJsKDY0KTtcbi8vIFNIQTUxMiAoNjQgYnl0ZXMpOiBiYXNlNjQgPSA4OCBjaGFycyB0b3RhbCAoODYgKyBcIj09XCIpXG5leHBvcnQgY29uc3Qgc2hhNTEyX2hleCA9IC9eWzAtOWEtZkEtRl17MTI4fSQvO1xuZXhwb3J0IGNvbnN0IHNoYTUxMl9iYXNlNjQgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0KDg2LCBcIj09XCIpO1xuZXhwb3J0IGNvbnN0IHNoYTUxMl9iYXNlNjR1cmwgPSAvKkBfX1BVUkVfXyovIGZpeGVkQmFzZTY0dXJsKDg2KTtcbiIsIi8vIGltcG9ydCB7ICRab2RUeXBlIH0gZnJvbSBcIi4vc2NoZW1hcy5qc1wiO1xuaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi9jb3JlLmpzXCI7XG5pbXBvcnQgKiBhcyByZWdleGVzIGZyb20gXCIuL3JlZ2V4ZXMuanNcIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcIi4vdXRpbC5qc1wiO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVjayA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIHZhciBfYTtcbiAgICBpbnN0Ll96b2QgPz8gKGluc3QuX3pvZCA9IHt9KTtcbiAgICBpbnN0Ll96b2QuZGVmID0gZGVmO1xuICAgIChfYSA9IGluc3QuX3pvZCkub25hdHRhY2ggPz8gKF9hLm9uYXR0YWNoID0gW10pO1xufSk7XG5jb25zdCBudW1lcmljT3JpZ2luTWFwID0ge1xuICAgIG51bWJlcjogXCJudW1iZXJcIixcbiAgICBiaWdpbnQ6IFwiYmlnaW50XCIsXG4gICAgb2JqZWN0OiBcImRhdGVcIixcbn07XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTGVzc1RoYW4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTGVzc1RoYW5cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3Qgb3JpZ2luID0gbnVtZXJpY09yaWdpbk1hcFt0eXBlb2YgZGVmLnZhbHVlXTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBjb25zdCBjdXJyID0gKGRlZi5pbmNsdXNpdmUgPyBiYWcubWF4aW11bSA6IGJhZy5leGNsdXNpdmVNYXhpbXVtKSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gICAgICAgIGlmIChkZWYudmFsdWUgPCBjdXJyKSB7XG4gICAgICAgICAgICBpZiAoZGVmLmluY2x1c2l2ZSlcbiAgICAgICAgICAgICAgICBiYWcubWF4aW11bSA9IGRlZi52YWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBiYWcuZXhjbHVzaXZlTWF4aW11bSA9IGRlZi52YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChkZWYuaW5jbHVzaXZlID8gcGF5bG9hZC52YWx1ZSA8PSBkZWYudmFsdWUgOiBwYXlsb2FkLnZhbHVlIDwgZGVmLnZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICBjb2RlOiBcInRvb19iaWdcIixcbiAgICAgICAgICAgIG1heGltdW06IHR5cGVvZiBkZWYudmFsdWUgPT09IFwib2JqZWN0XCIgPyBkZWYudmFsdWUuZ2V0VGltZSgpIDogZGVmLnZhbHVlLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGRlZi5pbmNsdXNpdmUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tHcmVhdGVyVGhhbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tHcmVhdGVyVGhhblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBvcmlnaW4gPSBudW1lcmljT3JpZ2luTWFwW3R5cGVvZiBkZWYudmFsdWVdO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGNvbnN0IGN1cnIgPSAoZGVmLmluY2x1c2l2ZSA/IGJhZy5taW5pbXVtIDogYmFnLmV4Y2x1c2l2ZU1pbmltdW0pID8/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgICAgICAgaWYgKGRlZi52YWx1ZSA+IGN1cnIpIHtcbiAgICAgICAgICAgIGlmIChkZWYuaW5jbHVzaXZlKVxuICAgICAgICAgICAgICAgIGJhZy5taW5pbXVtID0gZGVmLnZhbHVlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGJhZy5leGNsdXNpdmVNaW5pbXVtID0gZGVmLnZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGRlZi5pbmNsdXNpdmUgPyBwYXlsb2FkLnZhbHVlID49IGRlZi52YWx1ZSA6IHBheWxvYWQudmFsdWUgPiBkZWYudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIGNvZGU6IFwidG9vX3NtYWxsXCIsXG4gICAgICAgICAgICBtaW5pbXVtOiB0eXBlb2YgZGVmLnZhbHVlID09PSBcIm9iamVjdFwiID8gZGVmLnZhbHVlLmdldFRpbWUoKSA6IGRlZi52YWx1ZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBkZWYuaW5jbHVzaXZlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTXVsdGlwbGVPZiA9IFxuLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja011bHRpcGxlT2ZcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSBpbnN0Ll96b2QuYmFnKS5tdWx0aXBsZU9mID8/IChfYS5tdWx0aXBsZU9mID0gZGVmLnZhbHVlKTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQudmFsdWUgIT09IHR5cGVvZiBkZWYudmFsdWUpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgbWl4IG51bWJlciBhbmQgYmlnaW50IGluIG11bHRpcGxlX29mIGNoZWNrLlwiKTtcbiAgICAgICAgY29uc3QgaXNNdWx0aXBsZSA9IHR5cGVvZiBwYXlsb2FkLnZhbHVlID09PSBcImJpZ2ludFwiXG4gICAgICAgICAgICA/IHBheWxvYWQudmFsdWUgJSBkZWYudmFsdWUgPT09IEJpZ0ludCgwKVxuICAgICAgICAgICAgOiB1dGlsLmZsb2F0U2FmZVJlbWFpbmRlcihwYXlsb2FkLnZhbHVlLCBkZWYudmFsdWUpID09PSAwO1xuICAgICAgICBpZiAoaXNNdWx0aXBsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IHR5cGVvZiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgY29kZTogXCJub3RfbXVsdGlwbGVfb2ZcIixcbiAgICAgICAgICAgIGRpdmlzb3I6IGRlZi52YWx1ZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTnVtYmVyRm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja051bWJlckZvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTsgLy8gbm8gZm9ybWF0IGNoZWNrc1xuICAgIGRlZi5mb3JtYXQgPSBkZWYuZm9ybWF0IHx8IFwiZmxvYXQ2NFwiO1xuICAgIGNvbnN0IGlzSW50ID0gZGVmLmZvcm1hdD8uaW5jbHVkZXMoXCJpbnRcIik7XG4gICAgY29uc3Qgb3JpZ2luID0gaXNJbnQgPyBcImludFwiIDogXCJudW1iZXJcIjtcbiAgICBjb25zdCBbbWluaW11bSwgbWF4aW11bV0gPSB1dGlsLk5VTUJFUl9GT1JNQVRfUkFOR0VTW2RlZi5mb3JtYXRdO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5mb3JtYXQgPSBkZWYuZm9ybWF0O1xuICAgICAgICBiYWcubWluaW11bSA9IG1pbmltdW07XG4gICAgICAgIGJhZy5tYXhpbXVtID0gbWF4aW11bTtcbiAgICAgICAgaWYgKGlzSW50KVxuICAgICAgICAgICAgYmFnLnBhdHRlcm4gPSByZWdleGVzLmludGVnZXI7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAoaXNJbnQpIHtcbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnZhbGlkX2Zvcm1hdCBpc3N1ZVxuICAgICAgICAgICAgICAgIC8vIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIC8vICAgZXhwZWN0ZWQ6IGRlZi5mb3JtYXQsXG4gICAgICAgICAgICAgICAgLy8gICBmb3JtYXQ6IGRlZi5mb3JtYXQsXG4gICAgICAgICAgICAgICAgLy8gICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgLy8gICBpbnB1dCxcbiAgICAgICAgICAgICAgICAvLyAgIGluc3QsXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZF90eXBlIGlzc3VlXG4gICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBvcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZGVmLmZvcm1hdCxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgLy8gbm90X211bHRpcGxlX29mIGlzc3VlXG4gICAgICAgICAgICAgICAgLy8gcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgLy8gICBjb2RlOiBcIm5vdF9tdWx0aXBsZV9vZlwiLFxuICAgICAgICAgICAgICAgIC8vICAgb3JpZ2luOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgIC8vICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgLy8gICBpbnN0LFxuICAgICAgICAgICAgICAgIC8vICAgZGl2aXNvcjogMSxcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghTnVtYmVyLmlzU2FmZUludGVnZXIoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0b29fYmlnXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBcInRvb19iaWdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogXCJJbnRlZ2VycyBtdXN0IGJlIHdpdGhpbiB0aGUgc2FmZSBpbnRlZ2VyIHJhbmdlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvb19zbWFsbFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IE51bWJlci5NSU5fU0FGRV9JTlRFR0VSLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogXCJJbnRlZ2VycyBtdXN0IGJlIHdpdGhpbiB0aGUgc2FmZSBpbnRlZ2VyIHJhbmdlLlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dCA8IG1pbmltdW0pIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG9yaWdpbjogXCJudW1iZXJcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBjb2RlOiBcInRvb19zbWFsbFwiLFxuICAgICAgICAgICAgICAgIG1pbmltdW0sXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgPiBtYXhpbXVtKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICAgICAgbWF4aW11bSxcbiAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja0JpZ0ludEZvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tCaWdJbnRGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7IC8vIG5vIGZvcm1hdCBjaGVja3NcbiAgICBjb25zdCBbbWluaW11bSwgbWF4aW11bV0gPSB1dGlsLkJJR0lOVF9GT1JNQVRfUkFOR0VTW2RlZi5mb3JtYXRdO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5mb3JtYXQgPSBkZWYuZm9ybWF0O1xuICAgICAgICBiYWcubWluaW11bSA9IG1pbmltdW07XG4gICAgICAgIGJhZy5tYXhpbXVtID0gbWF4aW11bTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmIChpbnB1dCA8IG1pbmltdW0pIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIG9yaWdpbjogXCJiaWdpbnRcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBjb2RlOiBcInRvb19zbWFsbFwiLFxuICAgICAgICAgICAgICAgIG1pbmltdW06IG1pbmltdW0sXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQgPiBtYXhpbXVtKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwiYmlnaW50XCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICAgICAgbWF4aW11bSxcbiAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja01heFNpemUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTWF4U2l6ZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgKF9hID0gaW5zdC5fem9kLmRlZikud2hlbiA/PyAoX2Eud2hlbiA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIHJldHVybiAhdXRpbC5udWxsaXNoKHZhbCkgJiYgdmFsLnNpemUgIT09IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyID0gKGluc3QuX3pvZC5iYWcubWF4aW11bSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpO1xuICAgICAgICBpZiAoZGVmLm1heGltdW0gPCBjdXJyKVxuICAgICAgICAgICAgaW5zdC5fem9kLmJhZy5tYXhpbXVtID0gZGVmLm1heGltdW07XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCBzaXplID0gaW5wdXQuc2l6ZTtcbiAgICAgICAgaWYgKHNpemUgPD0gZGVmLm1heGltdW0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luOiB1dGlsLmdldFNpemFibGVPcmlnaW4oaW5wdXQpLFxuICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICBtYXhpbXVtOiBkZWYubWF4aW11bSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTWluU2l6ZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tNaW5TaXplXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICAoX2EgPSBpbnN0Ll96b2QuZGVmKS53aGVuID8/IChfYS53aGVuID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuICF1dGlsLm51bGxpc2godmFsKSAmJiB2YWwuc2l6ZSAhPT0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnIgPSAoaW5zdC5fem9kLmJhZy5taW5pbXVtID8/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSk7XG4gICAgICAgIGlmIChkZWYubWluaW11bSA+IGN1cnIpXG4gICAgICAgICAgICBpbnN0Ll96b2QuYmFnLm1pbmltdW0gPSBkZWYubWluaW11bTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGNvbnN0IHNpemUgPSBpbnB1dC5zaXplO1xuICAgICAgICBpZiAoc2l6ZSA+PSBkZWYubWluaW11bSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IHV0aWwuZ2V0U2l6YWJsZU9yaWdpbihpbnB1dCksXG4gICAgICAgICAgICBjb2RlOiBcInRvb19zbWFsbFwiLFxuICAgICAgICAgICAgbWluaW11bTogZGVmLm1pbmltdW0sXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja1NpemVFcXVhbHMgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrU2l6ZUVxdWFsc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hO1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgKF9hID0gaW5zdC5fem9kLmRlZikud2hlbiA/PyAoX2Eud2hlbiA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIHJldHVybiAhdXRpbC5udWxsaXNoKHZhbCkgJiYgdmFsLnNpemUgIT09IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgICAgICBiYWcubWluaW11bSA9IGRlZi5zaXplO1xuICAgICAgICBiYWcubWF4aW11bSA9IGRlZi5zaXplO1xuICAgICAgICBiYWcuc2l6ZSA9IGRlZi5zaXplO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGlucHV0LnNpemU7XG4gICAgICAgIGlmIChzaXplID09PSBkZWYuc2l6ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgdG9vQmlnID0gc2l6ZSA+IGRlZi5zaXplO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbjogdXRpbC5nZXRTaXphYmxlT3JpZ2luKGlucHV0KSxcbiAgICAgICAgICAgIC4uLih0b29CaWcgPyB7IGNvZGU6IFwidG9vX2JpZ1wiLCBtYXhpbXVtOiBkZWYuc2l6ZSB9IDogeyBjb2RlOiBcInRvb19zbWFsbFwiLCBtaW5pbXVtOiBkZWYuc2l6ZSB9KSxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tNYXhMZW5ndGggPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTWF4TGVuZ3RoXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICAoX2EgPSBpbnN0Ll96b2QuZGVmKS53aGVuID8/IChfYS53aGVuID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuICF1dGlsLm51bGxpc2godmFsKSAmJiB2YWwubGVuZ3RoICE9PSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgY3VyciA9IChpbnN0Ll96b2QuYmFnLm1heGltdW0gPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTtcbiAgICAgICAgaWYgKGRlZi5tYXhpbXVtIDwgY3VycilcbiAgICAgICAgICAgIGluc3QuX3pvZC5iYWcubWF4aW11bSA9IGRlZi5tYXhpbXVtO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoIDw9IGRlZi5tYXhpbXVtKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBvcmlnaW4gPSB1dGlsLmdldExlbmd0aGFibGVPcmlnaW4oaW5wdXQpO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIGNvZGU6IFwidG9vX2JpZ1wiLFxuICAgICAgICAgICAgbWF4aW11bTogZGVmLm1heGltdW0sXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja01pbkxlbmd0aCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tNaW5MZW5ndGhcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIHZhciBfYTtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIChfYSA9IGluc3QuX3pvZC5kZWYpLndoZW4gPz8gKF9hLndoZW4gPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICByZXR1cm4gIXV0aWwubnVsbGlzaCh2YWwpICYmIHZhbC5sZW5ndGggIT09IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2Qub25hdHRhY2gucHVzaCgoaW5zdCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyID0gKGluc3QuX3pvZC5iYWcubWluaW11bSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpO1xuICAgICAgICBpZiAoZGVmLm1pbmltdW0gPiBjdXJyKVxuICAgICAgICAgICAgaW5zdC5fem9kLmJhZy5taW5pbXVtID0gZGVmLm1pbmltdW07XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgICAgIGlmIChsZW5ndGggPj0gZGVmLm1pbmltdW0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IHV0aWwuZ2V0TGVuZ3RoYWJsZU9yaWdpbihpbnB1dCk7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgY29kZTogXCJ0b29fc21hbGxcIixcbiAgICAgICAgICAgIG1pbmltdW06IGRlZi5taW5pbXVtLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tMZW5ndGhFcXVhbHMgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrTGVuZ3RoRXF1YWxzXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICAoX2EgPSBpbnN0Ll96b2QuZGVmKS53aGVuID8/IChfYS53aGVuID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgcmV0dXJuICF1dGlsLm51bGxpc2godmFsKSAmJiB2YWwubGVuZ3RoICE9PSB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICAgICAgYmFnLm1pbmltdW0gPSBkZWYubGVuZ3RoO1xuICAgICAgICBiYWcubWF4aW11bSA9IGRlZi5sZW5ndGg7XG4gICAgICAgIGJhZy5sZW5ndGggPSBkZWYubGVuZ3RoO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoID09PSBkZWYubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBvcmlnaW4gPSB1dGlsLmdldExlbmd0aGFibGVPcmlnaW4oaW5wdXQpO1xuICAgICAgICBjb25zdCB0b29CaWcgPSBsZW5ndGggPiBkZWYubGVuZ3RoO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIC4uLih0b29CaWcgPyB7IGNvZGU6IFwidG9vX2JpZ1wiLCBtYXhpbXVtOiBkZWYubGVuZ3RoIH0gOiB7IGNvZGU6IFwidG9vX3NtYWxsXCIsIG1pbmltdW06IGRlZi5sZW5ndGggfSksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBleGFjdDogdHJ1ZSxcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrU3RyaW5nRm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1N0cmluZ0Zvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5mb3JtYXQgPSBkZWYuZm9ybWF0O1xuICAgICAgICBpZiAoZGVmLnBhdHRlcm4pIHtcbiAgICAgICAgICAgIGJhZy5wYXR0ZXJucyA/PyAoYmFnLnBhdHRlcm5zID0gbmV3IFNldCgpKTtcbiAgICAgICAgICAgIGJhZy5wYXR0ZXJucy5hZGQoZGVmLnBhdHRlcm4pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGRlZi5wYXR0ZXJuKVxuICAgICAgICAoX2EgPSBpbnN0Ll96b2QpLmNoZWNrID8/IChfYS5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICBkZWYucGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaWYgKGRlZi5wYXR0ZXJuLnRlc3QocGF5bG9hZC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IGRlZi5mb3JtYXQsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgLi4uKGRlZi5wYXR0ZXJuID8geyBwYXR0ZXJuOiBkZWYucGF0dGVybi50b1N0cmluZygpIH0gOiB7fSksXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICBlbHNlXG4gICAgICAgIChfYiA9IGluc3QuX3pvZCkuY2hlY2sgPz8gKF9iLmNoZWNrID0gKCkgPT4geyB9KTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja1JlZ2V4ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja1JlZ2V4XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2tTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGRlZi5wYXR0ZXJuLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmIChkZWYucGF0dGVybi50ZXN0KHBheWxvYWQudmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgIGZvcm1hdDogXCJyZWdleFwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBwYXR0ZXJuOiBkZWYucGF0dGVybi50b1N0cmluZygpLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENoZWNrTG93ZXJDYXNlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja0xvd2VyQ2FzZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5sb3dlcmNhc2UpO1xuICAgICRab2RDaGVja1N0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tVcHBlckNhc2UgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrVXBwZXJDYXNlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLnVwcGVyY2FzZSk7XG4gICAgJFpvZENoZWNrU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja0luY2x1ZGVzID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDaGVja0luY2x1ZGVzXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kQ2hlY2suaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvbnN0IGVzY2FwZWRSZWdleCA9IHV0aWwuZXNjYXBlUmVnZXgoZGVmLmluY2x1ZGVzKTtcbiAgICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCh0eXBlb2YgZGVmLnBvc2l0aW9uID09PSBcIm51bWJlclwiID8gYF4ueyR7ZGVmLnBvc2l0aW9ufX0ke2VzY2FwZWRSZWdleH1gIDogZXNjYXBlZFJlZ2V4KTtcbiAgICBkZWYucGF0dGVybiA9IHBhdHRlcm47XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICAgICAgYmFnLnBhdHRlcm5zID8/IChiYWcucGF0dGVybnMgPSBuZXcgU2V0KCkpO1xuICAgICAgICBiYWcucGF0dGVybnMuYWRkKHBhdHRlcm4pO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGlmIChwYXlsb2FkLnZhbHVlLmluY2x1ZGVzKGRlZi5pbmNsdWRlcywgZGVmLnBvc2l0aW9uKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwiaW5jbHVkZXNcIixcbiAgICAgICAgICAgIGluY2x1ZGVzOiBkZWYuaW5jbHVkZXMsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja1N0YXJ0c1dpdGggPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrU3RhcnRzV2l0aFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgXiR7dXRpbC5lc2NhcGVSZWdleChkZWYucHJlZml4KX0uKmApO1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHBhdHRlcm4pO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5wYXR0ZXJucyA/PyAoYmFnLnBhdHRlcm5zID0gbmV3IFNldCgpKTtcbiAgICAgICAgYmFnLnBhdHRlcm5zLmFkZChwYXR0ZXJuKTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZS5zdGFydHNXaXRoKGRlZi5wcmVmaXgpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIG9yaWdpbjogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9mb3JtYXRcIixcbiAgICAgICAgICAgIGZvcm1hdDogXCJzdGFydHNfd2l0aFwiLFxuICAgICAgICAgICAgcHJlZml4OiBkZWYucHJlZml4LFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tFbmRzV2l0aCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tFbmRzV2l0aFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBwYXR0ZXJuID0gbmV3IFJlZ0V4cChgLioke3V0aWwuZXNjYXBlUmVnZXgoZGVmLnN1ZmZpeCl9JGApO1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHBhdHRlcm4pO1xuICAgIGluc3QuX3pvZC5vbmF0dGFjaC5wdXNoKChpbnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgICAgIGJhZy5wYXR0ZXJucyA/PyAoYmFnLnBhdHRlcm5zID0gbmV3IFNldCgpKTtcbiAgICAgICAgYmFnLnBhdHRlcm5zLmFkZChwYXR0ZXJuKTtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZS5lbmRzV2l0aChkZWYuc3VmZml4KSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBvcmlnaW46IFwic3RyaW5nXCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwiZW5kc193aXRoXCIsXG4gICAgICAgICAgICBzdWZmaXg6IGRlZi5zdWZmaXgsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vICAgICRab2RDaGVja1Byb3BlcnR5ICAgIC8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZnVuY3Rpb24gaGFuZGxlQ2hlY2tQcm9wZXJ0eVJlc3VsdChyZXN1bHQsIHBheWxvYWQsIHByb3BlcnR5KSB7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMocHJvcGVydHksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgJFpvZENoZWNrUHJvcGVydHkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENoZWNrUHJvcGVydHlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLnNjaGVtYS5fem9kLnJ1bih7XG4gICAgICAgICAgICB2YWx1ZTogcGF5bG9hZC52YWx1ZVtkZWYucHJvcGVydHldLFxuICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgfSwge30pO1xuICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHQpID0+IGhhbmRsZUNoZWNrUHJvcGVydHlSZXN1bHQocmVzdWx0LCBwYXlsb2FkLCBkZWYucHJvcGVydHkpKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVDaGVja1Byb3BlcnR5UmVzdWx0KHJlc3VsdCwgcGF5bG9hZCwgZGVmLnByb3BlcnR5KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ2hlY2tNaW1lVHlwZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tNaW1lVHlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZENoZWNrLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBtaW1lU2V0ID0gbmV3IFNldChkZWYubWltZSk7XG4gICAgaW5zdC5fem9kLm9uYXR0YWNoLnB1c2goKGluc3QpID0+IHtcbiAgICAgICAgaW5zdC5fem9kLmJhZy5taW1lID0gZGVmLm1pbWU7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKG1pbWVTZXQuaGFzKHBheWxvYWQudmFsdWUudHlwZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3ZhbHVlXCIsXG4gICAgICAgICAgICB2YWx1ZXM6IGRlZi5taW1lLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUudHlwZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDaGVja092ZXJ3cml0ZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2hlY2tPdmVyd3JpdGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IGRlZi50eChwYXlsb2FkLnZhbHVlKTtcbiAgICB9O1xufSk7XG4iLCJleHBvcnQgY2xhc3MgRG9jIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzID0gW10pIHtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gW107XG4gICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgaWYgKHRoaXMpXG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH1cbiAgICBpbmRlbnRlZChmbikge1xuICAgICAgICB0aGlzLmluZGVudCArPSAxO1xuICAgICAgICBmbih0aGlzKTtcbiAgICAgICAgdGhpcy5pbmRlbnQgLT0gMTtcbiAgICB9XG4gICAgd3JpdGUoYXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGFyZyh0aGlzLCB7IGV4ZWN1dGlvbjogXCJzeW5jXCIgfSk7XG4gICAgICAgICAgICBhcmcodGhpcywgeyBleGVjdXRpb246IFwiYXN5bmNcIiB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb250ZW50ID0gYXJnO1xuICAgICAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoXCJcXG5cIikuZmlsdGVyKCh4KSA9PiB4KTtcbiAgICAgICAgY29uc3QgbWluSW5kZW50ID0gTWF0aC5taW4oLi4ubGluZXMubWFwKCh4KSA9PiB4Lmxlbmd0aCAtIHgudHJpbVN0YXJ0KCkubGVuZ3RoKSk7XG4gICAgICAgIGNvbnN0IGRlZGVudGVkID0gbGluZXMubWFwKCh4KSA9PiB4LnNsaWNlKG1pbkluZGVudCkpLm1hcCgoeCkgPT4gXCIgXCIucmVwZWF0KHRoaXMuaW5kZW50ICogMikgKyB4KTtcbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGRlZGVudGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQucHVzaChsaW5lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21waWxlKCkge1xuICAgICAgICBjb25zdCBGID0gRnVuY3Rpb247XG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzPy5hcmdzO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcz8uY29udGVudCA/PyBbYGBdO1xuICAgICAgICBjb25zdCBsaW5lcyA9IFsuLi5jb250ZW50Lm1hcCgoeCkgPT4gYCAgJHt4fWApXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGluZXMuam9pbihcIlxcblwiKSk7XG4gICAgICAgIHJldHVybiBuZXcgRiguLi5hcmdzLCBsaW5lcy5qb2luKFwiXFxuXCIpKTtcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3QgdmVyc2lvbiA9IHtcbiAgICBtYWpvcjogNCxcbiAgICBtaW5vcjogNCxcbiAgICBwYXRjaDogMSxcbn07XG4iLCJpbXBvcnQgKiBhcyBjaGVja3MgZnJvbSBcIi4vY2hlY2tzLmpzXCI7XG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuL2NvcmUuanNcIjtcbmltcG9ydCB7IERvYyB9IGZyb20gXCIuL2RvYy5qc1wiO1xuaW1wb3J0IHsgcGFyc2UsIHBhcnNlQXN5bmMsIHNhZmVQYXJzZSwgc2FmZVBhcnNlQXN5bmMgfSBmcm9tIFwiLi9wYXJzZS5qc1wiO1xuaW1wb3J0ICogYXMgcmVnZXhlcyBmcm9tIFwiLi9yZWdleGVzLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tIFwiLi92ZXJzaW9ucy5qc1wiO1xuZXhwb3J0IGNvbnN0ICRab2RUeXBlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RUeXBlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgaW5zdCA/PyAoaW5zdCA9IHt9KTtcbiAgICBpbnN0Ll96b2QuZGVmID0gZGVmOyAvLyBzZXQgX2RlZiBwcm9wZXJ0eVxuICAgIGluc3QuX3pvZC5iYWcgPSBpbnN0Ll96b2QuYmFnIHx8IHt9OyAvLyBpbml0aWFsaXplIF9iYWcgb2JqZWN0XG4gICAgaW5zdC5fem9kLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIGNvbnN0IGNoZWNrcyA9IFsuLi4oaW5zdC5fem9kLmRlZi5jaGVja3MgPz8gW10pXTtcbiAgICAvLyBpZiBpbnN0IGlzIGl0c2VsZiBhIGNoZWNrcy4kWm9kQ2hlY2ssIHJ1biBpdCBhcyBhIGNoZWNrXG4gICAgaWYgKGluc3QuX3pvZC50cmFpdHMuaGFzKFwiJFpvZENoZWNrXCIpKSB7XG4gICAgICAgIGNoZWNrcy51bnNoaWZ0KGluc3QpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IGNoIG9mIGNoZWNrcykge1xuICAgICAgICBmb3IgKGNvbnN0IGZuIG9mIGNoLl96b2Qub25hdHRhY2gpIHtcbiAgICAgICAgICAgIGZuKGluc3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjaGVja3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGRlZmVycmVkIGluaXRpYWxpemVyXG4gICAgICAgIC8vIGluc3QuX3pvZC5wYXJzZSBpcyBub3QgeWV0IGRlZmluZWRcbiAgICAgICAgKF9hID0gaW5zdC5fem9kKS5kZWZlcnJlZCA/PyAoX2EuZGVmZXJyZWQgPSBbXSk7XG4gICAgICAgIGluc3QuX3pvZC5kZWZlcnJlZD8ucHVzaCgoKSA9PiB7XG4gICAgICAgICAgICBpbnN0Ll96b2QucnVuID0gaW5zdC5fem9kLnBhcnNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHJ1bkNoZWNrcyA9IChwYXlsb2FkLCBjaGVja3MsIGN0eCkgPT4ge1xuICAgICAgICAgICAgbGV0IGlzQWJvcnRlZCA9IHV0aWwuYWJvcnRlZChwYXlsb2FkKTtcbiAgICAgICAgICAgIGxldCBhc3luY1Jlc3VsdDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2ggb2YgY2hlY2tzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoLl96b2QuZGVmLndoZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHV0aWwuZXhwbGljaXRseUFib3J0ZWQocGF5bG9hZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdWxkUnVuID0gY2guX3pvZC5kZWYud2hlbihwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzaG91bGRSdW4pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNBYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyTGVuID0gcGF5bG9hZC5pc3N1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IF8gPSBjaC5fem9kLmNoZWNrKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIGlmIChfIGluc3RhbmNlb2YgUHJvbWlzZSAmJiBjdHg/LmFzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kQXN5bmNFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXN5bmNSZXN1bHQgfHwgXyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmNSZXN1bHQgPSAoYXN5bmNSZXN1bHQgPz8gUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgXztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRMZW4gPSBwYXlsb2FkLmlzc3Vlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dExlbiA9PT0gY3VyckxlbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQWJvcnRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Fib3J0ZWQgPSB1dGlsLmFib3J0ZWQocGF5bG9hZCwgY3Vyckxlbik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dExlbiA9IHBheWxvYWQuaXNzdWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRMZW4gPT09IGN1cnJMZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Fib3J0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Fib3J0ZWQgPSB1dGlsLmFib3J0ZWQocGF5bG9hZCwgY3Vyckxlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFzeW5jUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzeW5jUmVzdWx0LnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoYW5kbGVDYW5hcnlSZXN1bHQgPSAoY2FuYXJ5LCBwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgICAgIC8vIGFib3J0IGlmIHRoZSBjYW5hcnkgaXMgYWJvcnRlZFxuICAgICAgICAgICAgaWYgKHV0aWwuYWJvcnRlZChjYW5hcnkpKSB7XG4gICAgICAgICAgICAgICAgY2FuYXJ5LmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYW5hcnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBydW4gY2hlY2tzIGZpcnN0LCB0aGVuXG4gICAgICAgICAgICBjb25zdCBjaGVja1Jlc3VsdCA9IHJ1bkNoZWNrcyhwYXlsb2FkLCBjaGVja3MsIGN0eCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tSZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eC5hc3luYyA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBjb3JlLiRab2RBc3luY0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrUmVzdWx0LnRoZW4oKGNoZWNrUmVzdWx0KSA9PiBpbnN0Ll96b2QucGFyc2UoY2hlY2tSZXN1bHQsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3QuX3pvZC5wYXJzZShjaGVja1Jlc3VsdCwgY3R4KTtcbiAgICAgICAgfTtcbiAgICAgICAgaW5zdC5fem9kLnJ1biA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgICAgIGlmIChjdHguc2tpcENoZWNrcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0Ll96b2QucGFyc2UocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdHguZGlyZWN0aW9uID09PSBcImJhY2t3YXJkXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBydW4gY2FuYXJ5XG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbCBwYXNzIChubyBjaGVja3MpXG4gICAgICAgICAgICAgICAgY29uc3QgY2FuYXJ5ID0gaW5zdC5fem9kLnBhcnNlKHsgdmFsdWU6IHBheWxvYWQudmFsdWUsIGlzc3VlczogW10gfSwgeyAuLi5jdHgsIHNraXBDaGVja3M6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNhbmFyeSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbmFyeS50aGVuKChjYW5hcnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVDYW5hcnlSZXN1bHQoY2FuYXJ5LCBwYXlsb2FkLCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNhbmFyeVJlc3VsdChjYW5hcnksIHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmb3J3YXJkXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0Ll96b2QucGFyc2UocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGN0eC5hc3luYyA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBjb3JlLiRab2RBc3luY0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChyZXN1bHQpID0+IHJ1bkNoZWNrcyhyZXN1bHQsIGNoZWNrcywgY3R4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVuQ2hlY2tzKHJlc3VsdCwgY2hlY2tzLCBjdHgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBMYXp5IGluaXRpYWxpemUgfnN0YW5kYXJkIHRvIGF2b2lkIGNyZWF0aW5nIG9iamVjdHMgZm9yIGV2ZXJ5IHNjaGVtYVxuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0LCBcIn5zdGFuZGFyZFwiLCAoKSA9PiAoe1xuICAgICAgICB2YWxpZGF0ZTogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSBzYWZlUGFyc2UoaW5zdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiByLnN1Y2Nlc3MgPyB7IHZhbHVlOiByLmRhdGEgfSA6IHsgaXNzdWVzOiByLmVycm9yPy5pc3N1ZXMgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZUFzeW5jKGluc3QsIHZhbHVlKS50aGVuKChyKSA9PiAoci5zdWNjZXNzID8geyB2YWx1ZTogci5kYXRhIH0gOiB7IGlzc3Vlczogci5lcnJvcj8uaXNzdWVzIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdmVuZG9yOiBcInpvZFwiLFxuICAgICAgICB2ZXJzaW9uOiAxLFxuICAgIH0pKTtcbn0pO1xuZXhwb3J0IHsgY2xvbmUgfSBmcm9tIFwiLi91dGlsLmpzXCI7XG5leHBvcnQgY29uc3QgJFpvZFN0cmluZyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kU3RyaW5nXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSBbLi4uKGluc3Q/Ll96b2QuYmFnPy5wYXR0ZXJucyA/PyBbXSldLnBvcCgpID8/IHJlZ2V4ZXMuc3RyaW5nKGluc3QuX3pvZC5iYWcpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfKSA9PiB7XG4gICAgICAgIGlmIChkZWYuY29lcmNlKVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gU3RyaW5nKHBheWxvYWQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF8pIHsgfVxuICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQudmFsdWUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJzdHJpbmdcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFN0cmluZ0Zvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kU3RyaW5nRm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBjaGVjayBpbml0aWFsaXphdGlvbiBtdXN0IGNvbWUgZmlyc3RcbiAgICBjaGVja3MuJFpvZENoZWNrU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICAkWm9kU3RyaW5nLmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RHVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RHVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmd1aWQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFVVSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFVVSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGlmIChkZWYudmVyc2lvbikge1xuICAgICAgICBjb25zdCB2ZXJzaW9uTWFwID0ge1xuICAgICAgICAgICAgdjE6IDEsXG4gICAgICAgICAgICB2MjogMixcbiAgICAgICAgICAgIHYzOiAzLFxuICAgICAgICAgICAgdjQ6IDQsXG4gICAgICAgICAgICB2NTogNSxcbiAgICAgICAgICAgIHY2OiA2LFxuICAgICAgICAgICAgdjc6IDcsXG4gICAgICAgICAgICB2ODogOCxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdiA9IHZlcnNpb25NYXBbZGVmLnZlcnNpb25dO1xuICAgICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFVVSUQgdmVyc2lvbjogXCIke2RlZi52ZXJzaW9ufVwiYCk7XG4gICAgICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMudXVpZCh2KSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy51dWlkKCkpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEVtYWlsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RFbWFpbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5lbWFpbCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kVVJMID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RVUkxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBUcmltIHdoaXRlc3BhY2UgZnJvbSBpbnB1dFxuICAgICAgICAgICAgY29uc3QgdHJpbW1lZCA9IHBheWxvYWQudmFsdWUudHJpbSgpO1xuICAgICAgICAgICAgLy8gV2hlbiBub3JtYWxpemUgaXMgb2ZmLCByZXF1aXJlIDovLyBmb3IgaHR0cC9odHRwcyBVUkxzXG4gICAgICAgICAgICAvLyBUaGlzIHByZXZlbnRzIHN0cmluZ3MgbGlrZSBcImh0dHA6ZXhhbXBsZS5jb21cIiBvciBcImh0dHBzOi9wYXRoXCIgZnJvbSBiZWluZyBzaWxlbnRseSBhY2NlcHRlZFxuICAgICAgICAgICAgaWYgKCFkZWYubm9ybWFsaXplICYmIGRlZi5wcm90b2NvbD8uc291cmNlID09PSByZWdleGVzLmh0dHBQcm90b2NvbC5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoIS9eaHR0cHM/OlxcL1xcLy9pLnRlc3QodHJpbW1lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwidXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlOiBcIkludmFsaWQgVVJMIGZvcm1hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCh0cmltbWVkKTtcbiAgICAgICAgICAgIGlmIChkZWYuaG9zdG5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWYuaG9zdG5hbWUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAoIWRlZi5ob3N0bmFtZS50ZXN0KHVybC5ob3N0bmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwidXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBub3RlOiBcIkludmFsaWQgaG9zdG5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IGRlZi5ob3N0bmFtZS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlZi5wcm90b2NvbCkge1xuICAgICAgICAgICAgICAgIGRlZi5wcm90b2NvbC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGlmICghZGVmLnByb3RvY29sLnRlc3QodXJsLnByb3RvY29sLmVuZHNXaXRoKFwiOlwiKSA/IHVybC5wcm90b2NvbC5zbGljZSgwLCAtMSkgOiB1cmwucHJvdG9jb2wpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcInVybFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZTogXCJJbnZhbGlkIHByb3RvY29sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBkZWYucHJvdG9jb2wuc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCB0aGUgb3V0cHV0IHZhbHVlIGJhc2VkIG9uIG5vcm1hbGl6ZSBmbGFnXG4gICAgICAgICAgICBpZiAoZGVmLm5vcm1hbGl6ZSkge1xuICAgICAgICAgICAgICAgIC8vIFVzZSBub3JtYWxpemVkIFVSTFxuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSB1cmwuaHJlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFByZXNlcnZlIHRoZSBvcmlnaW5hbCBpbnB1dCAodHJpbW1lZClcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gdHJpbW1lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoXykge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJ1cmxcIixcbiAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlOiAhZGVmLmFib3J0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEVtb2ppID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RFbW9qaVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5lbW9qaSgpKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2ROYW5vSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE5hbm9JRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5uYW5vaWQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG4vKipcbiAqIEBkZXByZWNhdGVkIENVSUQgdjEgaXMgZGVwcmVjYXRlZCBieSBpdHMgYXV0aG9ycyBkdWUgdG8gaW5mb3JtYXRpb24gbGVha2FnZVxuICogKHRpbWVzdGFtcHMgZW1iZWRkZWQgaW4gdGhlIGlkKS4gVXNlIHtAbGluayAkWm9kQ1VJRDJ9IGluc3RlYWQuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcmFsbGVsZHJpdmUvY3VpZC5cbiAqL1xuZXhwb3J0IGNvbnN0ICRab2RDVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmN1aWQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZENVSUQyID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDVUlEMlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5jdWlkMik7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kVUxJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVUxJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy51bGlkKTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RYSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFhJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy54aWQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEtTVUlEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RLU1VJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5rc3VpZCk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kSVNPRGF0ZVRpbWUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZElTT0RhdGVUaW1lXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmRhdGV0aW1lKGRlZikpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZElTT0RhdGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZElTT0RhdGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuZGF0ZSk7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kSVNPVGltZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSVNPVGltZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy50aW1lKGRlZikpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgJFpvZElTT0R1cmF0aW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RJU09EdXJhdGlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5kdXJhdGlvbik7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kSVB2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSVB2NFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5pcHY0KTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuYmFnLmZvcm1hdCA9IGBpcHY0YDtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RJUHY2ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RJUHY2XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmlwdjYpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5iYWcuZm9ybWF0ID0gYGlwdjZgO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBuZXcgVVJMKGBodHRwOi8vWyR7cGF5bG9hZC52YWx1ZX1dYCk7XG4gICAgICAgICAgICAvLyByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2gge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJpcHY2XCIsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RNQUMgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE1BQ1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5tYWMoZGVmLmRlbGltaXRlcikpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5iYWcuZm9ybWF0ID0gYG1hY2A7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQ0lEUnY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDSURSdjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuY2lkcnY0KTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDSURSdjYgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZENJRFJ2NlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5jaWRydjYpOyAvLyBub3QgdXNlZCBmb3IgdmFsaWRhdGlvblxuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5jaGVjayA9IChwYXlsb2FkKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gcGF5bG9hZC52YWx1ZS5zcGxpdChcIi9cIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgY29uc3QgW2FkZHJlc3MsIHByZWZpeF0gPSBwYXJ0cztcbiAgICAgICAgICAgIGlmICghcHJlZml4KVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgY29uc3QgcHJlZml4TnVtID0gTnVtYmVyKHByZWZpeCk7XG4gICAgICAgICAgICBpZiAoYCR7cHJlZml4TnVtfWAgIT09IHByZWZpeClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIGlmIChwcmVmaXhOdW0gPCAwIHx8IHByZWZpeE51bSA+IDEyOClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIG5ldyBVUkwoYGh0dHA6Ly9bJHthZGRyZXNzfV1gKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBcImNpZHJ2NlwiLFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAgIFpvZEJhc2U2NCAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRCYXNlNjQoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSBcIlwiKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyBhdG9iIGlnbm9yZXMgd2hpdGVzcGFjZSwgc28gcmVqZWN0IGl0IHVwIGZyb250LlxuICAgIGlmICgvXFxzLy50ZXN0KGRhdGEpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGRhdGEubGVuZ3RoICUgNCAhPT0gMClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgYXRvYihkYXRhKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCAkWm9kQmFzZTY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RCYXNlNjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGRlZi5wYXR0ZXJuID8/IChkZWYucGF0dGVybiA9IHJlZ2V4ZXMuYmFzZTY0KTtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuYmFnLmNvbnRlbnRFbmNvZGluZyA9IFwiYmFzZTY0XCI7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGlzVmFsaWRCYXNlNjQocGF5bG9hZC52YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgY29udGludWU6ICFkZWYuYWJvcnQsXG4gICAgICAgIH0pO1xuICAgIH07XG59KTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyAgIFpvZEJhc2U2NCAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRCYXNlNjRVUkwoZGF0YSkge1xuICAgIGlmICghcmVnZXhlcy5iYXNlNjR1cmwudGVzdChkYXRhKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGJhc2U2NCA9IGRhdGEucmVwbGFjZSgvWy1fXS9nLCAoYykgPT4gKGMgPT09IFwiLVwiID8gXCIrXCIgOiBcIi9cIikpO1xuICAgIGNvbnN0IHBhZGRlZCA9IGJhc2U2NC5wYWRFbmQoTWF0aC5jZWlsKGJhc2U2NC5sZW5ndGggLyA0KSAqIDQsIFwiPVwiKTtcbiAgICByZXR1cm4gaXNWYWxpZEJhc2U2NChwYWRkZWQpO1xufVxuZXhwb3J0IGNvbnN0ICRab2RCYXNlNjRVUkwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEJhc2U2NFVSTFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgZGVmLnBhdHRlcm4gPz8gKGRlZi5wYXR0ZXJuID0gcmVnZXhlcy5iYXNlNjR1cmwpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5iYWcuY29udGVudEVuY29kaW5nID0gXCJiYXNlNjR1cmxcIjtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAoaXNWYWxpZEJhc2U2NFVSTChwYXlsb2FkLnZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwiYmFzZTY0dXJsXCIsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RFMTY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RFMTY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYucGF0dGVybiA/PyAoZGVmLnBhdHRlcm4gPSByZWdleGVzLmUxNjQpO1xuICAgICRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gICBab2RKV1QgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkSldUKHRva2VuLCBhbGdvcml0aG0gPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdG9rZW5zUGFydHMgPSB0b2tlbi5zcGxpdChcIi5cIik7XG4gICAgICAgIGlmICh0b2tlbnNQYXJ0cy5sZW5ndGggIT09IDMpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IFtoZWFkZXJdID0gdG9rZW5zUGFydHM7XG4gICAgICAgIGlmICghaGVhZGVyKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHBhcnNlZEhlYWRlciA9IEpTT04ucGFyc2UoYXRvYihoZWFkZXIpKTtcbiAgICAgICAgaWYgKFwidHlwXCIgaW4gcGFyc2VkSGVhZGVyICYmIHBhcnNlZEhlYWRlcj8udHlwICE9PSBcIkpXVFwiKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoIXBhcnNlZEhlYWRlci5hbGcpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChhbGdvcml0aG0gJiYgKCEoXCJhbGdcIiBpbiBwYXJzZWRIZWFkZXIpIHx8IHBhcnNlZEhlYWRlci5hbGcgIT09IGFsZ29yaXRobSkpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnQgY29uc3QgJFpvZEpXVCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSldUXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAoaXNWYWxpZEpXVChwYXlsb2FkLnZhbHVlLCBkZWYuYWxnKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwiand0XCIsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDdXN0b21TdHJpbmdGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEN1c3RvbVN0cmluZ0Zvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgaWYgKGRlZi5mbihwYXlsb2FkLnZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfZm9ybWF0XCIsXG4gICAgICAgICAgICBmb3JtYXQ6IGRlZi5mb3JtYXQsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICBjb250aW51ZTogIWRlZi5hYm9ydCxcbiAgICAgICAgfSk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2ROdW1iZXIgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE51bWJlclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gaW5zdC5fem9kLmJhZy5wYXR0ZXJuID8/IHJlZ2V4ZXMubnVtYmVyO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGlmIChkZWYuY29lcmNlKVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gTnVtYmVyKHBheWxvYWQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKF8pIHsgfVxuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCIgJiYgIU51bWJlci5pc05hTihpbnB1dCkgJiYgTnVtYmVyLmlzRmluaXRlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjZWl2ZWQgPSB0eXBlb2YgaW5wdXQgPT09IFwibnVtYmVyXCJcbiAgICAgICAgICAgID8gTnVtYmVyLmlzTmFOKGlucHV0KVxuICAgICAgICAgICAgICAgID8gXCJOYU5cIlxuICAgICAgICAgICAgICAgIDogIU51bWJlci5pc0Zpbml0ZShpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgPyBcIkluZmluaXR5XCJcbiAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWRcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIC4uLihyZWNlaXZlZCA/IHsgcmVjZWl2ZWQgfSA6IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTnVtYmVyRm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROdW1iZXJGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNoZWNrcy4kWm9kQ2hlY2tOdW1iZXJGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgICRab2ROdW1iZXIuaW5pdChpbnN0LCBkZWYpOyAvLyBubyBmb3JtYXQgY2hlY2tzXG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQm9vbGVhbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQm9vbGVhblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gcmVnZXhlcy5ib29sZWFuO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGlmIChkZWYuY29lcmNlKVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gQm9vbGVhbihwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7IH1cbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcImJvb2xlYW5cIilcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcImJvb2xlYW5cIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEJpZ0ludCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQmlnSW50XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSByZWdleGVzLmJpZ2ludDtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAoZGVmLmNvZXJjZSlcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IEJpZ0ludChwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChfKSB7IH1cbiAgICAgICAgaWYgKHR5cGVvZiBwYXlsb2FkLnZhbHVlID09PSBcImJpZ2ludFwiKVxuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwiYmlnaW50XCIsXG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RCaWdJbnRGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEJpZ0ludEZvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY2hlY2tzLiRab2RDaGVja0JpZ0ludEZvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgJFpvZEJpZ0ludC5pbml0KGluc3QsIGRlZik7IC8vIG5vIGZvcm1hdCBjaGVja3Ncbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RTeW1ib2wgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFN5bWJvbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJzeW1ib2xcIilcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcInN5bWJvbFwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kVW5kZWZpbmVkID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RVbmRlZmluZWRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IHJlZ2V4ZXMudW5kZWZpbmVkO1xuICAgIGluc3QuX3pvZC52YWx1ZXMgPSBuZXcgU2V0KFt1bmRlZmluZWRdKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJ1bmRlZmluZWRcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE51bGwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE51bGxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IHJlZ2V4ZXMubnVsbDtcbiAgICBpbnN0Ll96b2QudmFsdWVzID0gbmV3IFNldChbbnVsbF0pO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibnVsbFwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kQW55ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RBbnlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCkgPT4gcGF5bG9hZDtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RVbmtub3duID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RVbmtub3duXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQpID0+IHBheWxvYWQ7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTmV2ZXIgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE5ldmVyXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBleHBlY3RlZDogXCJuZXZlclwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kVm9pZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVm9pZFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcInZvaWRcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZERhdGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZERhdGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAoZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gbmV3IERhdGUocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoX2VycikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCBpc0RhdGUgPSBpbnB1dCBpbnN0YW5jZW9mIERhdGU7XG4gICAgICAgIGNvbnN0IGlzVmFsaWREYXRlID0gaXNEYXRlICYmICFOdW1iZXIuaXNOYU4oaW5wdXQuZ2V0VGltZSgpKTtcbiAgICAgICAgaWYgKGlzVmFsaWREYXRlKVxuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgLi4uKGlzRGF0ZSA/IHsgcmVjZWl2ZWQ6IFwiSW52YWxpZCBEYXRlXCIgfSA6IHt9KSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVBcnJheVJlc3VsdChyZXN1bHQsIGZpbmFsLCBpbmRleCkge1xuICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhpbmRleCwgcmVzdWx0Lmlzc3VlcykpO1xuICAgIH1cbiAgICBmaW5hbC52YWx1ZVtpbmRleF0gPSByZXN1bHQudmFsdWU7XG59XG5leHBvcnQgY29uc3QgJFpvZEFycmF5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RBcnJheVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IEFycmF5KGlucHV0Lmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IHByb21zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5lbGVtZW50Ll96b2QucnVuKHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbSxcbiAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgfSwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXMucHVzaChyZXN1bHQudGhlbigocmVzdWx0KSA9PiBoYW5kbGVBcnJheVJlc3VsdChyZXN1bHQsIHBheWxvYWQsIGkpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVBcnJheVJlc3VsdChyZXN1bHQsIHBheWxvYWQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9tcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9tcykudGhlbigoKSA9PiBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF5bG9hZDsgLy9oYW5kbGVBcnJheVJlc3VsdHNBc3luYyhwYXJzZVJlc3VsdHMsIGZpbmFsKTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVQcm9wZXJ0eVJlc3VsdChyZXN1bHQsIGZpbmFsLCBrZXksIGlucHV0LCBpc09wdGlvbmFsSW4sIGlzT3B0aW9uYWxPdXQpIHtcbiAgICBjb25zdCBpc1ByZXNlbnQgPSBrZXkgaW4gaW5wdXQ7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEZvciBvcHRpb25hbC1pbi9vdXQgc2NoZW1hcywgaWdub3JlIGVycm9ycyBvbiBhYnNlbnQga2V5cy5cbiAgICAgICAgaWYgKGlzT3B0aW9uYWxJbiAmJiBpc09wdGlvbmFsT3V0ICYmICFpc1ByZXNlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhrZXksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICB9XG4gICAgaWYgKCFpc1ByZXNlbnQgJiYgIWlzT3B0aW9uYWxJbikge1xuICAgICAgICBpZiAoIXJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJub25vcHRpb25hbFwiLFxuICAgICAgICAgICAgICAgIGlucHV0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcGF0aDogW2tleV0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChyZXN1bHQudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXNQcmVzZW50KSB7XG4gICAgICAgICAgICBmaW5hbC52YWx1ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaW5hbC52YWx1ZVtrZXldID0gcmVzdWx0LnZhbHVlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZURlZihkZWYpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGVmLnNoYXBlKTtcbiAgICBmb3IgKGNvbnN0IGsgb2Yga2V5cykge1xuICAgICAgICBpZiAoIWRlZi5zaGFwZT8uW2tdPy5fem9kPy50cmFpdHM/LmhhcyhcIiRab2RUeXBlXCIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgZWxlbWVudCBhdCBrZXkgXCIke2t9XCI6IGV4cGVjdGVkIGEgWm9kIHNjaGVtYWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG9rZXlzID0gdXRpbC5vcHRpb25hbEtleXMoZGVmLnNoYXBlKTtcbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5kZWYsXG4gICAgICAgIGtleXMsXG4gICAgICAgIGtleVNldDogbmV3IFNldChrZXlzKSxcbiAgICAgICAgbnVtS2V5czoga2V5cy5sZW5ndGgsXG4gICAgICAgIG9wdGlvbmFsS2V5czogbmV3IFNldChva2V5cyksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUNhdGNoYWxsKHByb21zLCBpbnB1dCwgcGF5bG9hZCwgY3R4LCBkZWYsIGluc3QpIHtcbiAgICBjb25zdCB1bnJlY29nbml6ZWQgPSBbXTtcbiAgICBjb25zdCBrZXlTZXQgPSBkZWYua2V5U2V0O1xuICAgIGNvbnN0IF9jYXRjaGFsbCA9IGRlZi5jYXRjaGFsbC5fem9kO1xuICAgIGNvbnN0IHQgPSBfY2F0Y2hhbGwuZGVmLnR5cGU7XG4gICAgY29uc3QgaXNPcHRpb25hbEluID0gX2NhdGNoYWxsLm9wdGluID09PSBcIm9wdGlvbmFsXCI7XG4gICAgY29uc3QgaXNPcHRpb25hbE91dCA9IF9jYXRjaGFsbC5vcHRvdXQgPT09IFwib3B0aW9uYWxcIjtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBpbnB1dCkge1xuICAgICAgICAvLyBza2lwIF9fcHJvdG9fXyBzbyBpdCBjYW4ndCByZXBsYWNlIHRoZSByZXN1bHQgcHJvdG90eXBlIHZpYSB0aGVcbiAgICAgICAgLy8gYXNzaWdubWVudCBzZXR0ZXIgb24gdGhlIHBsYWluIHt9IHdlIGJ1aWxkIGludG9cbiAgICAgICAgaWYgKGtleSA9PT0gXCJfX3Byb3RvX19cIilcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAoa2V5U2V0LmhhcyhrZXkpKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmICh0ID09PSBcIm5ldmVyXCIpIHtcbiAgICAgICAgICAgIHVucmVjb2duaXplZC5wdXNoKGtleSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByID0gX2NhdGNoYWxsLnJ1bih7IHZhbHVlOiBpbnB1dFtrZXldLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgIGlmIChyIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcHJvbXMucHVzaChyLnRoZW4oKHIpID0+IGhhbmRsZVByb3BlcnR5UmVzdWx0KHIsIHBheWxvYWQsIGtleSwgaW5wdXQsIGlzT3B0aW9uYWxJbiwgaXNPcHRpb25hbE91dCkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGhhbmRsZVByb3BlcnR5UmVzdWx0KHIsIHBheWxvYWQsIGtleSwgaW5wdXQsIGlzT3B0aW9uYWxJbiwgaXNPcHRpb25hbE91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHVucmVjb2duaXplZC5sZW5ndGgpIHtcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcInVucmVjb2duaXplZF9rZXlzXCIsXG4gICAgICAgICAgICBrZXlzOiB1bnJlY29nbml6ZWQsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIXByb21zLmxlbmd0aClcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgJFpvZE9iamVjdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kT2JqZWN0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyByZXF1aXJlcyBjYXN0IGJlY2F1c2UgdGVjaG5pY2FsbHkgJFpvZE9iamVjdCBkb2Vzbid0IGV4dGVuZFxuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICAvLyBjb25zdCBzaCA9IGRlZi5zaGFwZTtcbiAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihkZWYsIFwic2hhcGVcIik7XG4gICAgaWYgKCFkZXNjPy5nZXQpIHtcbiAgICAgICAgY29uc3Qgc2ggPSBkZWYuc2hhcGU7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkZWYsIFwic2hhcGVcIiwge1xuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U2ggPSB7IC4uLnNoIH07XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlZiwgXCJzaGFwZVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBuZXdTaCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3U2g7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgX25vcm1hbGl6ZWQgPSB1dGlsLmNhY2hlZCgoKSA9PiBub3JtYWxpemVEZWYoZGVmKSk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBkZWYuc2hhcGU7XG4gICAgICAgIGNvbnN0IHByb3BWYWx1ZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2hhcGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gc2hhcGVba2V5XS5fem9kO1xuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlcykge1xuICAgICAgICAgICAgICAgIHByb3BWYWx1ZXNba2V5XSA/PyAocHJvcFZhbHVlc1trZXldID0gbmV3IFNldCgpKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHYgb2YgZmllbGQudmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsdWVzW2tleV0uYWRkKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wVmFsdWVzO1xuICAgIH0pO1xuICAgIGNvbnN0IGlzT2JqZWN0ID0gdXRpbC5pc09iamVjdDtcbiAgICBjb25zdCBjYXRjaGFsbCA9IGRlZi5jYXRjaGFsbDtcbiAgICBsZXQgdmFsdWU7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICB2YWx1ZSA/PyAodmFsdWUgPSBfbm9ybWFsaXplZC52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCFpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC52YWx1ZSA9IHt9O1xuICAgICAgICBjb25zdCBwcm9tcyA9IFtdO1xuICAgICAgICBjb25zdCBzaGFwZSA9IHZhbHVlLnNoYXBlO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB2YWx1ZS5rZXlzKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IHNoYXBlW2tleV07XG4gICAgICAgICAgICBjb25zdCBpc09wdGlvbmFsSW4gPSBlbC5fem9kLm9wdGluID09PSBcIm9wdGlvbmFsXCI7XG4gICAgICAgICAgICBjb25zdCBpc09wdGlvbmFsT3V0ID0gZWwuX3pvZC5vcHRvdXQgPT09IFwib3B0aW9uYWxcIjtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBlbC5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dFtrZXldLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgICAgICBpZiAociBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBwcm9tcy5wdXNoKHIudGhlbigocikgPT4gaGFuZGxlUHJvcGVydHlSZXN1bHQociwgcGF5bG9hZCwga2V5LCBpbnB1dCwgaXNPcHRpb25hbEluLCBpc09wdGlvbmFsT3V0KSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlUHJvcGVydHlSZXN1bHQociwgcGF5bG9hZCwga2V5LCBpbnB1dCwgaXNPcHRpb25hbEluLCBpc09wdGlvbmFsT3V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNhdGNoYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvbXMubGVuZ3RoID8gUHJvbWlzZS5hbGwocHJvbXMpLnRoZW4oKCkgPT4gcGF5bG9hZCkgOiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVDYXRjaGFsbChwcm9tcywgaW5wdXQsIHBheWxvYWQsIGN0eCwgX25vcm1hbGl6ZWQudmFsdWUsIGluc3QpO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kT2JqZWN0SklUID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RPYmplY3RKSVRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIHJlcXVpcmVzIGNhc3QgYmVjYXVzZSB0ZWNobmljYWxseSAkWm9kT2JqZWN0IGRvZXNuJ3QgZXh0ZW5kXG4gICAgJFpvZE9iamVjdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3Qgc3VwZXJQYXJzZSA9IGluc3QuX3pvZC5wYXJzZTtcbiAgICBjb25zdCBfbm9ybWFsaXplZCA9IHV0aWwuY2FjaGVkKCgpID0+IG5vcm1hbGl6ZURlZihkZWYpKTtcbiAgICBjb25zdCBnZW5lcmF0ZUZhc3RwYXNzID0gKHNoYXBlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRvYyA9IG5ldyBEb2MoW1wic2hhcGVcIiwgXCJwYXlsb2FkXCIsIFwiY3R4XCJdKTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZCA9IF9ub3JtYWxpemVkLnZhbHVlO1xuICAgICAgICBjb25zdCBwYXJzZVN0ciA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGsgPSB1dGlsLmVzYyhrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIGBzaGFwZVske2t9XS5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dFske2t9XSwgaXNzdWVzOiBbXSB9LCBjdHgpYDtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jLndyaXRlKGBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7YCk7XG4gICAgICAgIGNvbnN0IGlkcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygbm9ybWFsaXplZC5rZXlzKSB7XG4gICAgICAgICAgICBpZHNba2V5XSA9IGBrZXlfJHtjb3VudGVyKyt9YDtcbiAgICAgICAgfVxuICAgICAgICAvLyBBOiBwcmVzZXJ2ZSBrZXkgb3JkZXIge1xuICAgICAgICBkb2Mud3JpdGUoYGNvbnN0IG5ld1Jlc3VsdCA9IHt9O2ApO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBub3JtYWxpemVkLmtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gaWRzW2tleV07XG4gICAgICAgICAgICBjb25zdCBrID0gdXRpbC5lc2Moa2V5KTtcbiAgICAgICAgICAgIGNvbnN0IHNjaGVtYSA9IHNoYXBlW2tleV07XG4gICAgICAgICAgICBjb25zdCBpc09wdGlvbmFsSW4gPSBzY2hlbWE/Ll96b2Q/Lm9wdGluID09PSBcIm9wdGlvbmFsXCI7XG4gICAgICAgICAgICBjb25zdCBpc09wdGlvbmFsT3V0ID0gc2NoZW1hPy5fem9kPy5vcHRvdXQgPT09IFwib3B0aW9uYWxcIjtcbiAgICAgICAgICAgIGRvYy53cml0ZShgY29uc3QgJHtpZH0gPSAke3BhcnNlU3RyKGtleSl9O2ApO1xuICAgICAgICAgICAgaWYgKGlzT3B0aW9uYWxJbiAmJiBpc09wdGlvbmFsT3V0KSB7XG4gICAgICAgICAgICAgICAgLy8gRm9yIG9wdGlvbmFsLWluL291dCBzY2hlbWFzLCBpZ25vcmUgZXJyb3JzIG9uIGFic2VudCBrZXlzXG4gICAgICAgICAgICAgICAgZG9jLndyaXRlKGBcbiAgICAgICAgaWYgKCR7aWR9Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoJHtrfSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMgPSBwYXlsb2FkLmlzc3Vlcy5jb25jYXQoJHtpZH0uaXNzdWVzLm1hcChpc3MgPT4gKHtcbiAgICAgICAgICAgICAgLi4uaXNzLFxuICAgICAgICAgICAgICBwYXRoOiBpc3MucGF0aCA/IFske2t9LCAuLi5pc3MucGF0aF0gOiBbJHtrfV1cbiAgICAgICAgICAgIH0pKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoJHtpZH0udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgke2t9IGluIGlucHV0KSB7XG4gICAgICAgICAgICBuZXdSZXN1bHRbJHtrfV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1Jlc3VsdFske2t9XSA9ICR7aWR9LnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghaXNPcHRpb25hbEluKSB7XG4gICAgICAgICAgICAgICAgZG9jLndyaXRlKGBcbiAgICAgICAgY29uc3QgJHtpZH1fcHJlc2VudCA9ICR7a30gaW4gaW5wdXQ7XG4gICAgICAgIGlmICgke2lkfS5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcGF5bG9hZC5pc3N1ZXMgPSBwYXlsb2FkLmlzc3Vlcy5jb25jYXQoJHtpZH0uaXNzdWVzLm1hcChpc3MgPT4gKHtcbiAgICAgICAgICAgIC4uLmlzcyxcbiAgICAgICAgICAgIHBhdGg6IGlzcy5wYXRoID8gWyR7a30sIC4uLmlzcy5wYXRoXSA6IFske2t9XVxuICAgICAgICAgIH0pKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEke2lkfV9wcmVzZW50ICYmICEke2lkfS5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgZXhwZWN0ZWQ6IFwibm9ub3B0aW9uYWxcIixcbiAgICAgICAgICAgIGlucHV0OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYXRoOiBbJHtrfV1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgke2lkfV9wcmVzZW50KSB7XG4gICAgICAgICAgaWYgKCR7aWR9LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld1Jlc3VsdFske2t9XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3UmVzdWx0WyR7a31dID0gJHtpZH0udmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jLndyaXRlKGBcbiAgICAgICAgaWYgKCR7aWR9Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICBwYXlsb2FkLmlzc3VlcyA9IHBheWxvYWQuaXNzdWVzLmNvbmNhdCgke2lkfS5pc3N1ZXMubWFwKGlzcyA9PiAoe1xuICAgICAgICAgICAgLi4uaXNzLFxuICAgICAgICAgICAgcGF0aDogaXNzLnBhdGggPyBbJHtrfSwgLi4uaXNzLnBhdGhdIDogWyR7a31dXG4gICAgICAgICAgfSkpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCR7aWR9LnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoJHtrfSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgbmV3UmVzdWx0WyR7a31dID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdSZXN1bHRbJHtrfV0gPSAke2lkfS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRvYy53cml0ZShgcGF5bG9hZC52YWx1ZSA9IG5ld1Jlc3VsdDtgKTtcbiAgICAgICAgZG9jLndyaXRlKGByZXR1cm4gcGF5bG9hZDtgKTtcbiAgICAgICAgY29uc3QgZm4gPSBkb2MuY29tcGlsZSgpO1xuICAgICAgICByZXR1cm4gKHBheWxvYWQsIGN0eCkgPT4gZm4oc2hhcGUsIHBheWxvYWQsIGN0eCk7XG4gICAgfTtcbiAgICBsZXQgZmFzdHBhc3M7XG4gICAgY29uc3QgaXNPYmplY3QgPSB1dGlsLmlzT2JqZWN0O1xuICAgIGNvbnN0IGppdCA9ICFjb3JlLmdsb2JhbENvbmZpZy5qaXRsZXNzO1xuICAgIGNvbnN0IGFsbG93c0V2YWwgPSB1dGlsLmFsbG93c0V2YWw7XG4gICAgY29uc3QgZmFzdEVuYWJsZWQgPSBqaXQgJiYgYWxsb3dzRXZhbC52YWx1ZTsgLy8gJiYgIWRlZi5jYXRjaGFsbDtcbiAgICBjb25zdCBjYXRjaGFsbCA9IGRlZi5jYXRjaGFsbDtcbiAgICBsZXQgdmFsdWU7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICB2YWx1ZSA/PyAodmFsdWUgPSBfbm9ybWFsaXplZC52YWx1ZSk7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCFpc09iamVjdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcIm9iamVjdFwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGppdCAmJiBmYXN0RW5hYmxlZCAmJiBjdHg/LmFzeW5jID09PSBmYWxzZSAmJiBjdHguaml0bGVzcyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gYWx3YXlzIHN5bmNocm9ub3VzXG4gICAgICAgICAgICBpZiAoIWZhc3RwYXNzKVxuICAgICAgICAgICAgICAgIGZhc3RwYXNzID0gZ2VuZXJhdGVGYXN0cGFzcyhkZWYuc2hhcGUpO1xuICAgICAgICAgICAgcGF5bG9hZCA9IGZhc3RwYXNzKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICBpZiAoIWNhdGNoYWxsKVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNhdGNoYWxsKFtdLCBpbnB1dCwgcGF5bG9hZCwgY3R4LCB2YWx1ZSwgaW5zdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyUGFyc2UocGF5bG9hZCwgY3R4KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVVbmlvblJlc3VsdHMocmVzdWx0cywgZmluYWwsIGluc3QsIGN0eCkge1xuICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmaW5hbC52YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBmaW5hbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBub25hYm9ydGVkID0gcmVzdWx0cy5maWx0ZXIoKHIpID0+ICF1dGlsLmFib3J0ZWQocikpO1xuICAgIGlmIChub25hYm9ydGVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBmaW5hbC52YWx1ZSA9IG5vbmFib3J0ZWRbMF0udmFsdWU7XG4gICAgICAgIHJldHVybiBub25hYm9ydGVkWzBdO1xuICAgIH1cbiAgICBmaW5hbC5pc3N1ZXMucHVzaCh7XG4gICAgICAgIGNvZGU6IFwiaW52YWxpZF91bmlvblwiLFxuICAgICAgICBpbnB1dDogZmluYWwudmFsdWUsXG4gICAgICAgIGluc3QsXG4gICAgICAgIGVycm9yczogcmVzdWx0cy5tYXAoKHJlc3VsdCkgPT4gcmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSkpLFxuICAgIH0pO1xuICAgIHJldHVybiBmaW5hbDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kVW5pb24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFVuaW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYub3B0aW9ucy5zb21lKChvKSA9PiBvLl96b2Qub3B0aW4gPT09IFwib3B0aW9uYWxcIikgPyBcIm9wdGlvbmFsXCIgOiB1bmRlZmluZWQpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwib3B0b3V0XCIsICgpID0+IGRlZi5vcHRpb25zLnNvbWUoKG8pID0+IG8uX3pvZC5vcHRvdXQgPT09IFwib3B0aW9uYWxcIikgPyBcIm9wdGlvbmFsXCIgOiB1bmRlZmluZWQpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IHtcbiAgICAgICAgaWYgKGRlZi5vcHRpb25zLmV2ZXJ5KChvKSA9PiBvLl96b2QudmFsdWVzKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBTZXQoZGVmLm9wdGlvbnMuZmxhdE1hcCgob3B0aW9uKSA9PiBBcnJheS5mcm9tKG9wdGlvbi5fem9kLnZhbHVlcykpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicGF0dGVyblwiLCAoKSA9PiB7XG4gICAgICAgIGlmIChkZWYub3B0aW9ucy5ldmVyeSgobykgPT4gby5fem9kLnBhdHRlcm4pKSB7XG4gICAgICAgICAgICBjb25zdCBwYXR0ZXJucyA9IGRlZi5vcHRpb25zLm1hcCgobykgPT4gby5fem9kLnBhdHRlcm4pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4oJHtwYXR0ZXJucy5tYXAoKHApID0+IHV0aWwuY2xlYW5SZWdleChwLnNvdXJjZSkpLmpvaW4oXCJ8XCIpfSkkYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBjb25zdCBmaXJzdCA9IGRlZi5vcHRpb25zLmxlbmd0aCA9PT0gMSA/IGRlZi5vcHRpb25zWzBdLl96b2QucnVuIDogbnVsbDtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpcnN0KHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFzeW5jID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgZGVmLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG9wdGlvbi5fem9kLnJ1bih7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgIH0sIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIGFzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFzeW5jKVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVVuaW9uUmVzdWx0cyhyZXN1bHRzLCBwYXlsb2FkLCBpbnN0LCBjdHgpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0cykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVVuaW9uUmVzdWx0cyhyZXN1bHRzLCBwYXlsb2FkLCBpbnN0LCBjdHgpO1xuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVFeGNsdXNpdmVVbmlvblJlc3VsdHMocmVzdWx0cywgZmluYWwsIGluc3QsIGN0eCkge1xuICAgIGNvbnN0IHN1Y2Nlc3NlcyA9IHJlc3VsdHMuZmlsdGVyKChyKSA9PiByLmlzc3Vlcy5sZW5ndGggPT09IDApO1xuICAgIGlmIChzdWNjZXNzZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGZpbmFsLnZhbHVlID0gc3VjY2Vzc2VzWzBdLnZhbHVlO1xuICAgICAgICByZXR1cm4gZmluYWw7XG4gICAgfVxuICAgIGlmIChzdWNjZXNzZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIE5vIG1hdGNoZXMgLSBzYW1lIGFzIHJlZ3VsYXIgdW5pb25cbiAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3VuaW9uXCIsXG4gICAgICAgICAgICBpbnB1dDogZmluYWwudmFsdWUsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgZXJyb3JzOiByZXN1bHRzLm1hcCgocmVzdWx0KSA9PiByZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gTXVsdGlwbGUgbWF0Y2hlcyAtIGV4Y2x1c2l2ZSB1bmlvbiBmYWlsdXJlXG4gICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF91bmlvblwiLFxuICAgICAgICAgICAgaW5wdXQ6IGZpbmFsLnZhbHVlLFxuICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgIGVycm9yczogW10sXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbmFsO1xufVxuZXhwb3J0IGNvbnN0ICRab2RYb3IgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFhvclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFVuaW9uLmluaXQoaW5zdCwgZGVmKTtcbiAgICBkZWYuaW5jbHVzaXZlID0gZmFsc2U7XG4gICAgY29uc3QgZmlyc3QgPSBkZWYub3B0aW9ucy5sZW5ndGggPT09IDEgPyBkZWYub3B0aW9uc1swXS5fem9kLnJ1biA6IG51bGw7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBmaXJzdChwYXlsb2FkLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhc3luYyA9IGZhbHNlO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIGRlZi5vcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBvcHRpb24uX3pvZC5ydW4oe1xuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgICAgICBhc3luYyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWFzeW5jKVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUV4Y2x1c2l2ZVVuaW9uUmVzdWx0cyhyZXN1bHRzLCBwYXlsb2FkLCBpbnN0LCBjdHgpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0cykudGhlbigocmVzdWx0cykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUV4Y2x1c2l2ZVVuaW9uUmVzdWx0cyhyZXN1bHRzLCBwYXlsb2FkLCBpbnN0LCBjdHgpO1xuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZERpc2NyaW1pbmF0ZWRVbmlvbiA9IFxuLypAX19QVVJFX18qL1xuY29yZS4kY29uc3RydWN0b3IoXCIkWm9kRGlzY3JpbWluYXRlZFVuaW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBkZWYuaW5jbHVzaXZlID0gZmFsc2U7XG4gICAgJFpvZFVuaW9uLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCBfc3VwZXIgPSBpbnN0Ll96b2QucGFyc2U7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcFZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBkZWYub3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgcHYgPSBvcHRpb24uX3pvZC5wcm9wVmFsdWVzO1xuICAgICAgICAgICAgaWYgKCFwdiB8fCBPYmplY3Qua2V5cyhwdikubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkaXNjcmltaW5hdGVkIHVuaW9uIG9wdGlvbiBhdCBpbmRleCBcIiR7ZGVmLm9wdGlvbnMuaW5kZXhPZihvcHRpb24pfVwiYCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhwdikpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BWYWx1ZXNba10pXG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWx1ZXNba10gPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB2YWwgb2Ygdikge1xuICAgICAgICAgICAgICAgICAgICBwcm9wVmFsdWVzW2tdLmFkZCh2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcFZhbHVlcztcbiAgICB9KTtcbiAgICBjb25zdCBkaXNjID0gdXRpbC5jYWNoZWQoKCkgPT4ge1xuICAgICAgICBjb25zdCBvcHRzID0gZGVmLm9wdGlvbnM7XG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgZm9yIChjb25zdCBvIG9mIG9wdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG8uX3pvZC5wcm9wVmFsdWVzPy5bZGVmLmRpc2NyaW1pbmF0b3JdO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXMgfHwgdmFsdWVzLnNpemUgPT09IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRpc2NyaW1pbmF0ZWQgdW5pb24gb3B0aW9uIGF0IGluZGV4IFwiJHtkZWYub3B0aW9ucy5pbmRleE9mKG8pfVwiYCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHYgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hcC5oYXModikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgZGlzY3JpbWluYXRvciB2YWx1ZSBcIiR7U3RyaW5nKHYpfVwiYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1hcC5zZXQodiwgbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCF1dGlsLmlzT2JqZWN0KGlucHV0KSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJvYmplY3RcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvcHQgPSBkaXNjLnZhbHVlLmdldChpbnB1dD8uW2RlZi5kaXNjcmltaW5hdG9yXSk7XG4gICAgICAgIGlmIChvcHQpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHQuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGYWxsIGJhY2sgdG8gdW5pb24gbWF0Y2hpbmcgd2hlbiB0aGUgZmFzdCBkaXNjcmltaW5hdG9yIHBhdGggZmFpbHM6XG4gICAgICAgIC8vIC0gZXhwbGljaXRseSBlbmFibGVkIHZpYSB1bmlvbkZhbGxiYWNrLCBvclxuICAgICAgICAvLyAtIGR1cmluZyBiYWNrd2FyZCBkaXJlY3Rpb24gKGVuY29kZSksIHNpbmNlIGNvZGVjLWJhc2VkIGRpc2NyaW1pbmF0b3JzXG4gICAgICAgIC8vICAgaGF2ZSBkaWZmZXJlbnQgdmFsdWVzIGluIGZvcndhcmQgdnMgYmFja3dhcmQgZGlyZWN0aW9uc1xuICAgICAgICBpZiAoZGVmLnVuaW9uRmFsbGJhY2sgfHwgY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gX3N1cGVyKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm8gbWF0Y2hpbmcgZGlzY3JpbWluYXRvclxuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF91bmlvblwiLFxuICAgICAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgICAgIG5vdGU6IFwiTm8gbWF0Y2hpbmcgZGlzY3JpbWluYXRvclwiLFxuICAgICAgICAgICAgZGlzY3JpbWluYXRvcjogZGVmLmRpc2NyaW1pbmF0b3IsXG4gICAgICAgICAgICBvcHRpb25zOiBBcnJheS5mcm9tKGRpc2MudmFsdWUua2V5cygpKSxcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgcGF0aDogW2RlZi5kaXNjcmltaW5hdG9yXSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEludGVyc2VjdGlvbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kSW50ZXJzZWN0aW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGNvbnN0IGxlZnQgPSBkZWYubGVmdC5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dCwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICBjb25zdCByaWdodCA9IGRlZi5yaWdodC5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dCwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICBjb25zdCBhc3luYyA9IGxlZnQgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHJpZ2h0IGluc3RhbmNlb2YgUHJvbWlzZTtcbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW2xlZnQsIHJpZ2h0XSkudGhlbigoW2xlZnQsIHJpZ2h0XSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGVJbnRlcnNlY3Rpb25SZXN1bHRzKHBheWxvYWQsIGxlZnQsIHJpZ2h0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVJbnRlcnNlY3Rpb25SZXN1bHRzKHBheWxvYWQsIGxlZnQsIHJpZ2h0KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBtZXJnZVZhbHVlcyhhLCBiKSB7XG4gICAgLy8gY29uc3QgYVR5cGUgPSBwYXJzZS50KGEpO1xuICAgIC8vIGNvbnN0IGJUeXBlID0gcGFyc2UudChiKTtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogYSB9O1xuICAgIH1cbiAgICBpZiAoYSBpbnN0YW5jZW9mIERhdGUgJiYgYiBpbnN0YW5jZW9mIERhdGUgJiYgK2EgPT09ICtiKSB7XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBhIH07XG4gICAgfVxuICAgIGlmICh1dGlsLmlzUGxhaW5PYmplY3QoYSkgJiYgdXRpbC5pc1BsYWluT2JqZWN0KGIpKSB7XG4gICAgICAgIGNvbnN0IGJLZXlzID0gT2JqZWN0LmtleXMoYik7XG4gICAgICAgIGNvbnN0IHNoYXJlZEtleXMgPSBPYmplY3Qua2V5cyhhKS5maWx0ZXIoKGtleSkgPT4gYktleXMuaW5kZXhPZihrZXkpICE9PSAtMSk7XG4gICAgICAgIGNvbnN0IG5ld09iaiA9IHsgLi4uYSwgLi4uYiB9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBzaGFyZWRLZXlzKSB7XG4gICAgICAgICAgICBjb25zdCBzaGFyZWRWYWx1ZSA9IG1lcmdlVmFsdWVzKGFba2V5XSwgYltrZXldKTtcbiAgICAgICAgICAgIGlmICghc2hhcmVkVmFsdWUudmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG1lcmdlRXJyb3JQYXRoOiBba2V5LCAuLi5zaGFyZWRWYWx1ZS5tZXJnZUVycm9yUGF0aF0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld09ialtrZXldID0gc2hhcmVkVmFsdWUuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogbmV3T2JqIH07XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGEpICYmIEFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBtZXJnZUVycm9yUGF0aDogW10gfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1BID0gYVtpbmRleF07XG4gICAgICAgICAgICBjb25zdCBpdGVtQiA9IGJbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3Qgc2hhcmVkVmFsdWUgPSBtZXJnZVZhbHVlcyhpdGVtQSwgaXRlbUIpO1xuICAgICAgICAgICAgaWYgKCFzaGFyZWRWYWx1ZS52YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VFcnJvclBhdGg6IFtpbmRleCwgLi4uc2hhcmVkVmFsdWUubWVyZ2VFcnJvclBhdGhdLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdBcnJheS5wdXNoKHNoYXJlZFZhbHVlLmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBuZXdBcnJheSB9O1xuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIG1lcmdlRXJyb3JQYXRoOiBbXSB9O1xufVxuZnVuY3Rpb24gaGFuZGxlSW50ZXJzZWN0aW9uUmVzdWx0cyhyZXN1bHQsIGxlZnQsIHJpZ2h0KSB7XG4gICAgLy8gVHJhY2sgd2hpY2ggc2lkZShzKSByZXBvcnQgZWFjaCBrZXkgYXMgdW5yZWNvZ25pemVkXG4gICAgY29uc3QgdW5yZWNLZXlzID0gbmV3IE1hcCgpO1xuICAgIGxldCB1bnJlY0lzc3VlO1xuICAgIGZvciAoY29uc3QgaXNzIG9mIGxlZnQuaXNzdWVzKSB7XG4gICAgICAgIGlmIChpc3MuY29kZSA9PT0gXCJ1bnJlY29nbml6ZWRfa2V5c1wiKSB7XG4gICAgICAgICAgICB1bnJlY0lzc3VlID8/ICh1bnJlY0lzc3VlID0gaXNzKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBpc3Mua2V5cykge1xuICAgICAgICAgICAgICAgIGlmICghdW5yZWNLZXlzLmhhcyhrKSlcbiAgICAgICAgICAgICAgICAgICAgdW5yZWNLZXlzLnNldChrLCB7fSk7XG4gICAgICAgICAgICAgICAgdW5yZWNLZXlzLmdldChrKS5sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5pc3N1ZXMucHVzaChpc3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3QgaXNzIG9mIHJpZ2h0Lmlzc3Vlcykge1xuICAgICAgICBpZiAoaXNzLmNvZGUgPT09IFwidW5yZWNvZ25pemVkX2tleXNcIikge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrIG9mIGlzcy5rZXlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1bnJlY0tleXMuaGFzKGspKVxuICAgICAgICAgICAgICAgICAgICB1bnJlY0tleXMuc2V0KGssIHt9KTtcbiAgICAgICAgICAgICAgICB1bnJlY0tleXMuZ2V0KGspLnIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0Lmlzc3Vlcy5wdXNoKGlzcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVwb3J0IG9ubHkga2V5cyB1bnJlY29nbml6ZWQgYnkgQk9USCBzaWRlc1xuICAgIGNvbnN0IGJvdGhLZXlzID0gWy4uLnVucmVjS2V5c10uZmlsdGVyKChbLCBmXSkgPT4gZi5sICYmIGYucikubWFwKChba10pID0+IGspO1xuICAgIGlmIChib3RoS2V5cy5sZW5ndGggJiYgdW5yZWNJc3N1ZSkge1xuICAgICAgICByZXN1bHQuaXNzdWVzLnB1c2goeyAuLi51bnJlY0lzc3VlLCBrZXlzOiBib3RoS2V5cyB9KTtcbiAgICB9XG4gICAgaWYgKHV0aWwuYWJvcnRlZChyZXN1bHQpKVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlVmFsdWVzKGxlZnQudmFsdWUsIHJpZ2h0LnZhbHVlKTtcbiAgICBpZiAoIW1lcmdlZC52YWxpZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVubWVyZ2FibGUgaW50ZXJzZWN0aW9uLiBFcnJvciBwYXRoOiBgICsgYCR7SlNPTi5zdHJpbmdpZnkobWVyZ2VkLm1lcmdlRXJyb3JQYXRoKX1gKTtcbiAgICB9XG4gICAgcmVzdWx0LnZhbHVlID0gbWVyZ2VkLmRhdGE7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kVHVwbGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFR1cGxlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29uc3QgaXRlbXMgPSBkZWYuaXRlbXM7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwidHVwbGVcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLnZhbHVlID0gW107XG4gICAgICAgIGNvbnN0IHByb21zID0gW107XG4gICAgICAgIGNvbnN0IG9wdGluU3RhcnQgPSBnZXRUdXBsZU9wdFN0YXJ0KGl0ZW1zLCBcIm9wdGluXCIpO1xuICAgICAgICBjb25zdCBvcHRvdXRTdGFydCA9IGdldFR1cGxlT3B0U3RhcnQoaXRlbXMsIFwib3B0b3V0XCIpO1xuICAgICAgICBpZiAoIWRlZi5yZXN0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQubGVuZ3RoIDwgb3B0aW5TdGFydCkge1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBcInRvb19zbWFsbFwiLFxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBvcHRpblN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IFwiYXJyYXlcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbnB1dC5sZW5ndGggPiBpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogXCJ0b29fYmlnXCIsXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW06IGl0ZW1zLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBcImFycmF5XCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUnVuIGV2ZXJ5IGl0ZW0gaW4gcGFyYWxsZWwsIGNvbGxlY3RpbmcgcmVzdWx0cyBpbnRvIGFuIGluZGV4ZWRcbiAgICAgICAgLy8gYXJyYXkuIFRoZSBwb3N0LXByb2Nlc3NpbmcgaW4gYGhhbmRsZVR1cGxlUmVzdWx0c2Agd2Fsa3MgdGhlbSBpblxuICAgICAgICAvLyBvcmRlciBzbyBpdCBjYW4gZGVjaWRlIHdoZXRoZXIgYW4gYWJzZW50IG9wdGlvbmFsLW91dHB1dCBlcnJvciBjYW5cbiAgICAgICAgLy8gdHJ1bmNhdGUgdGhlIHRhaWwgb3IgbXVzdCBiZSByZXBvcnRlZCB0byBwcmVzZXJ2ZSByZXF1aXJlZCBvdXRwdXQuXG4gICAgICAgIGNvbnN0IGl0ZW1SZXN1bHRzID0gbmV3IEFycmF5KGl0ZW1zLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBpdGVtc1tpXS5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dFtpXSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHIgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXMucHVzaChyLnRoZW4oKHJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1SZXN1bHRzW2ldID0gcnI7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbVJlc3VsdHNbaV0gPSByO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYucmVzdCkge1xuICAgICAgICAgICAgbGV0IGkgPSBpdGVtcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgY29uc3QgcmVzdCA9IGlucHV0LnNsaWNlKGl0ZW1zLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsIG9mIHJlc3QpIHtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLnJlc3QuX3pvZC5ydW4oeyB2YWx1ZTogZWwsIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9tcy5wdXNoKHJlc3VsdC50aGVuKChyKSA9PiBoYW5kbGVUdXBsZVJlc3VsdChyLCBwYXlsb2FkLCBpKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlVHVwbGVSZXN1bHQocmVzdWx0LCBwYXlsb2FkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb21zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IGhhbmRsZVR1cGxlUmVzdWx0cyhpdGVtUmVzdWx0cywgcGF5bG9hZCwgaXRlbXMsIGlucHV0LCBvcHRvdXRTdGFydCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVUdXBsZVJlc3VsdHMoaXRlbVJlc3VsdHMsIHBheWxvYWQsIGl0ZW1zLCBpbnB1dCwgb3B0b3V0U3RhcnQpO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGdldFR1cGxlT3B0U3RhcnQoaXRlbXMsIGtleSkge1xuICAgIGZvciAobGV0IGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoaXRlbXNbaV0uX3pvZFtrZXldICE9PSBcIm9wdGlvbmFsXCIpXG4gICAgICAgICAgICByZXR1cm4gaSArIDE7XG4gICAgfVxuICAgIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaGFuZGxlVHVwbGVSZXN1bHQocmVzdWx0LCBmaW5hbCwgaW5kZXgpIHtcbiAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoaW5kZXgsIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICB9XG4gICAgZmluYWwudmFsdWVbaW5kZXhdID0gcmVzdWx0LnZhbHVlO1xufVxuZnVuY3Rpb24gaGFuZGxlVHVwbGVSZXN1bHRzKGl0ZW1SZXN1bHRzLCBmaW5hbCwgaXRlbXMsIGlucHV0LCBvcHRvdXRTdGFydCkge1xuICAgIC8vIFdhbGsgcmVzdWx0cyBpbiBvcmRlci4gTWlycm9yICRab2RPYmplY3QncyBzd2FsbG93LW9uLWFic2VudC1vcHRpb25hbFxuICAgIC8vIHJ1bGUsIGJ1dCBvbmx5IGFmdGVyIGBvcHRvdXRTdGFydGA6IHRoZSBmaXJzdCBpbmRleCB3aGVyZSB0aGUgb3V0cHV0XG4gICAgLy8gdHVwbGUgdGFpbCBjYW4gYmUgYWJzZW50LlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgciA9IGl0ZW1SZXN1bHRzW2ldO1xuICAgICAgICBjb25zdCBpc1ByZXNlbnQgPSBpIDwgaW5wdXQubGVuZ3RoO1xuICAgICAgICBpZiAoci5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIWlzUHJlc2VudCAmJiBpID49IG9wdG91dFN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgZmluYWwudmFsdWUubGVuZ3RoID0gaTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKGksIHIuaXNzdWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWwudmFsdWVbaV0gPSByLnZhbHVlO1xuICAgIH1cbiAgICAvLyBEcm9wIHRyYWlsaW5nIHNsb3RzIHRoYXQgcHJvZHVjZWQgYHVuZGVmaW5lZGAgZm9yIGFic2VudCBpbnB1dFxuICAgIC8vICh0aGUgYXJyYXkgYW5hbG9nIG9mIGFuIGFic2VudCBvcHRpb25hbCBrZXkgb24gYW4gb2JqZWN0KS4gVGhlXG4gICAgLy8gYGkgPj0gaW5wdXQubGVuZ3RoYCBmbG9vciBpcyBjcml0aWNhbDogYW4gZXhwbGljaXQgYHVuZGVmaW5lZGBcbiAgICAvLyAqaW5zaWRlKiB0aGUgaW5wdXQgbXVzdCBiZSBwcmVzZXJ2ZWQgZXZlbiB3aGVuIHRoZSBzY2hlbWEgaXNcbiAgICAvLyBvcHRpb25hbC1vdXQgKGUuZy4gYHouc3RyaW5nKCkub3Ioei51bmRlZmluZWQoKSlgIGFjY2VwdGluZyBhblxuICAgIC8vIGV4cGxpY2l0IHVuZGVmaW5lZCB2YWx1ZSkuXG4gICAgZm9yIChsZXQgaSA9IGZpbmFsLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gaW5wdXQubGVuZ3RoOyBpLS0pIHtcbiAgICAgICAgaWYgKGl0ZW1zW2ldLl96b2Qub3B0b3V0ID09PSBcIm9wdGlvbmFsXCIgJiYgZmluYWwudmFsdWVbaV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmluYWwudmFsdWUubGVuZ3RoID0gaTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaW5hbDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kUmVjb3JkID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RSZWNvcmRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCF1dGlsLmlzUGxhaW5PYmplY3QoaW5wdXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJyZWNvcmRcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb21zID0gW107XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IGRlZi5rZXlUeXBlLl96b2QudmFsdWVzO1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0ge307XG4gICAgICAgICAgICBjb25zdCByZWNvcmRLZXlzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGtleSA9PT0gXCJudW1iZXJcIiB8fCB0eXBlb2Yga2V5ID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY29yZEtleXMuYWRkKHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIgPyBrZXkudG9TdHJpbmcoKSA6IGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleVJlc3VsdCA9IGRlZi5rZXlUeXBlLl96b2QucnVuKHsgdmFsdWU6IGtleSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5UmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXN5bmMgc2NoZW1hcyBub3Qgc3VwcG9ydGVkIGluIG9iamVjdCBrZXlzIGN1cnJlbnRseVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5UmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF9rZXlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IFwicmVjb3JkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBrZXlSZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDoga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IFtrZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dEtleSA9IGtleVJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLnZhbHVlVHlwZS5fem9kLnJ1bih7IHZhbHVlOiBpbnB1dFtrZXldLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9tcy5wdXNoKHJlc3VsdC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhrZXksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC52YWx1ZVtvdXRLZXldID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhrZXksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWVbb3V0S2V5XSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB1bnJlY29nbml6ZWQ7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICghcmVjb3JkS2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB1bnJlY29nbml6ZWQgPSB1bnJlY29nbml6ZWQgPz8gW107XG4gICAgICAgICAgICAgICAgICAgIHVucmVjb2duaXplZC5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVucmVjb2duaXplZCAmJiB1bnJlY29nbml6ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBcInVucmVjb2duaXplZF9rZXlzXCIsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICBrZXlzOiB1bnJlY29nbml6ZWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0ge307XG4gICAgICAgICAgICAvLyBSZWZsZWN0Lm93bktleXMgZm9yIFN5bWJvbC1rZXkgc3VwcG9ydDsgZmlsdGVyIG5vbi1lbnVtZXJhYmxlIHRvIG1hdGNoIHoub2JqZWN0KClcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIFJlZmxlY3Qub3duS2V5cyhpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9fcHJvdG9fX1wiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChpbnB1dCwga2V5KSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgbGV0IGtleVJlc3VsdCA9IGRlZi5rZXlUeXBlLl96b2QucnVuKHsgdmFsdWU6IGtleSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgICAgIGlmIChrZXlSZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFzeW5jIHNjaGVtYXMgbm90IHN1cHBvcnRlZCBpbiBvYmplY3Qga2V5cyBjdXJyZW50bHlcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIE51bWVyaWMgc3RyaW5nIGZhbGxiYWNrOiBpZiBrZXkgaXMgYSBudW1lcmljIHN0cmluZyBhbmQgZmFpbGVkLCByZXRyeSB3aXRoIE51bWJlcihrZXkpXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoYW5kbGVzIHoubnVtYmVyKCksIHoubGl0ZXJhbChbMSwgMiwgM10pLCBhbmQgdW5pb25zIGNvbnRhaW5pbmcgbnVtZXJpYyBsaXRlcmFsc1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrTnVtZXJpY0tleSA9IHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYgcmVnZXhlcy5udW1iZXIudGVzdChrZXkpICYmIGtleVJlc3VsdC5pc3N1ZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChjaGVja051bWVyaWNLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0cnlSZXN1bHQgPSBkZWYua2V5VHlwZS5fem9kLnJ1bih7IHZhbHVlOiBOdW1iZXIoa2V5KSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0cnlSZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3luYyBzY2hlbWFzIG5vdCBzdXBwb3J0ZWQgaW4gb2JqZWN0IGtleXMgY3VycmVudGx5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyeVJlc3VsdC5pc3N1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlSZXN1bHQgPSByZXRyeVJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa2V5UmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZi5tb2RlID09PSBcImxvb3NlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhyb3VnaCB1bmNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWVba2V5XSA9IGlucHV0W2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IFwic3RyaWN0XCIgYmVoYXZpb3I6IGVycm9yIG9uIGludmFsaWQga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfa2V5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBcInJlY29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzc3Vlczoga2V5UmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXRoOiBba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi52YWx1ZVR5cGUuX3pvZC5ydW4oeyB2YWx1ZTogaW5wdXRba2V5XSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb21zLnB1c2gocmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCguLi51dGlsLnByZWZpeElzc3VlcyhrZXksIHJlc3VsdC5pc3N1ZXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWVba2V5UmVzdWx0LnZhbHVlXSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKC4uLnV0aWwucHJlZml4SXNzdWVzKGtleSwgcmVzdWx0Lmlzc3VlcykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWVba2V5UmVzdWx0LnZhbHVlXSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb21zLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kTWFwID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RNYXBcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCEoaW5wdXQgaW5zdGFuY2VvZiBNYXApKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJtYXBcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb21zID0gW107XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGlucHV0KSB7XG4gICAgICAgICAgICBjb25zdCBrZXlSZXN1bHQgPSBkZWYua2V5VHlwZS5fem9kLnJ1bih7IHZhbHVlOiBrZXksIGlzc3VlczogW10gfSwgY3R4KTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlUmVzdWx0ID0gZGVmLnZhbHVlVHlwZS5fem9kLnJ1bih7IHZhbHVlOiB2YWx1ZSwgaXNzdWVzOiBbXSB9LCBjdHgpO1xuICAgICAgICAgICAgaWYgKGtleVJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UgfHwgdmFsdWVSZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcHJvbXMucHVzaChQcm9taXNlLmFsbChba2V5UmVzdWx0LCB2YWx1ZVJlc3VsdF0pLnRoZW4oKFtrZXlSZXN1bHQsIHZhbHVlUmVzdWx0XSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVNYXBSZXN1bHQoa2V5UmVzdWx0LCB2YWx1ZVJlc3VsdCwgcGF5bG9hZCwga2V5LCBpbnB1dCwgaW5zdCwgY3R4KTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVNYXBSZXN1bHQoa2V5UmVzdWx0LCB2YWx1ZVJlc3VsdCwgcGF5bG9hZCwga2V5LCBpbnB1dCwgaW5zdCwgY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvbXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IHBheWxvYWQpO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVNYXBSZXN1bHQoa2V5UmVzdWx0LCB2YWx1ZVJlc3VsdCwgZmluYWwsIGtleSwgaW5wdXQsIGluc3QsIGN0eCkge1xuICAgIGlmIChrZXlSZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXRpbC5wcm9wZXJ0eUtleVR5cGVzLmhhcyh0eXBlb2Yga2V5KSkge1xuICAgICAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCBrZXlSZXN1bHQuaXNzdWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2tleVwiLFxuICAgICAgICAgICAgICAgIG9yaWdpbjogXCJtYXBcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGlzc3Vlczoga2V5UmVzdWx0Lmlzc3Vlcy5tYXAoKGlzcykgPT4gdXRpbC5maW5hbGl6ZUlzc3VlKGlzcywgY3R4LCBjb3JlLmNvbmZpZygpKSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodmFsdWVSZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodXRpbC5wcm9wZXJ0eUtleVR5cGVzLmhhcyh0eXBlb2Yga2V5KSkge1xuICAgICAgICAgICAgZmluYWwuaXNzdWVzLnB1c2goLi4udXRpbC5wcmVmaXhJc3N1ZXMoa2V5LCB2YWx1ZVJlc3VsdC5pc3N1ZXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpbmFsLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwibWFwXCIsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2VsZW1lbnRcIixcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgIGlzc3VlczogdmFsdWVSZXN1bHQuaXNzdWVzLm1hcCgoaXNzKSA9PiB1dGlsLmZpbmFsaXplSXNzdWUoaXNzLCBjdHgsIGNvcmUuY29uZmlnKCkpKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpbmFsLnZhbHVlLnNldChrZXlSZXN1bHQudmFsdWUsIHZhbHVlUmVzdWx0LnZhbHVlKTtcbn1cbmV4cG9ydCBjb25zdCAkWm9kU2V0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RTZXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKCEoaW5wdXQgaW5zdGFuY2VvZiBTZXQpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcInNldFwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb21zID0gW107XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpbnB1dCkge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gZGVmLnZhbHVlVHlwZS5fem9kLnJ1bih7IHZhbHVlOiBpdGVtLCBpc3N1ZXM6IFtdIH0sIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHByb21zLnB1c2gocmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4gaGFuZGxlU2V0UmVzdWx0KHJlc3VsdCwgcGF5bG9hZCkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBoYW5kbGVTZXRSZXN1bHQocmVzdWx0LCBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvbXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKS50aGVuKCgpID0+IHBheWxvYWQpO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVTZXRSZXN1bHQocmVzdWx0LCBmaW5hbCkge1xuICAgIGlmIChyZXN1bHQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICBmaW5hbC5pc3N1ZXMucHVzaCguLi5yZXN1bHQuaXNzdWVzKTtcbiAgICB9XG4gICAgZmluYWwudmFsdWUuYWRkKHJlc3VsdC52YWx1ZSk7XG59XG5leHBvcnQgY29uc3QgJFpvZEVudW0gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEVudW1cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB1dGlsLmdldEVudW1WYWx1ZXMoZGVmLmVudHJpZXMpO1xuICAgIGNvbnN0IHZhbHVlc1NldCA9IG5ldyBTZXQodmFsdWVzKTtcbiAgICBpbnN0Ll96b2QudmFsdWVzID0gdmFsdWVzU2V0O1xuICAgIGluc3QuX3pvZC5wYXR0ZXJuID0gbmV3IFJlZ0V4cChgXigke3ZhbHVlc1xuICAgICAgICAuZmlsdGVyKChrKSA9PiB1dGlsLnByb3BlcnR5S2V5VHlwZXMuaGFzKHR5cGVvZiBrKSlcbiAgICAgICAgLm1hcCgobykgPT4gKHR5cGVvZiBvID09PSBcInN0cmluZ1wiID8gdXRpbC5lc2NhcGVSZWdleChvKSA6IG8udG9TdHJpbmcoKSkpXG4gICAgICAgIC5qb2luKFwifFwiKX0pJGApO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gcGF5bG9hZC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlc1NldC5oYXMoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF92YWx1ZVwiLFxuICAgICAgICAgICAgdmFsdWVzLFxuICAgICAgICAgICAgaW5wdXQsXG4gICAgICAgICAgICBpbnN0LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RMaXRlcmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RMaXRlcmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaWYgKGRlZi52YWx1ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjcmVhdGUgbGl0ZXJhbCBzY2hlbWEgd2l0aCBubyB2YWxpZCB2YWx1ZXNcIik7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlcyA9IG5ldyBTZXQoZGVmLnZhbHVlcyk7XG4gICAgaW5zdC5fem9kLnZhbHVlcyA9IHZhbHVlcztcbiAgICBpbnN0Ll96b2QucGF0dGVybiA9IG5ldyBSZWdFeHAoYF4oJHtkZWYudmFsdWVzXG4gICAgICAgIC5tYXAoKG8pID0+ICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIiA/IHV0aWwuZXNjYXBlUmVnZXgobykgOiBvID8gdXRpbC5lc2NhcGVSZWdleChvLnRvU3RyaW5nKCkpIDogU3RyaW5nKG8pKSlcbiAgICAgICAgLmpvaW4oXCJ8XCIpfSkkYCk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIF9jdHgpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBpZiAodmFsdWVzLmhhcyhpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3ZhbHVlXCIsXG4gICAgICAgICAgICB2YWx1ZXM6IGRlZi52YWx1ZXMsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZEZpbGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEZpbGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBjb25zdCBpbnB1dCA9IHBheWxvYWQudmFsdWU7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgaWYgKGlucHV0IGluc3RhbmNlb2YgRmlsZSlcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcImZpbGVcIixcbiAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZFRyYW5zZm9ybSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kVHJhbnNmb3JtXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kRW5jb2RlRXJyb3IoaW5zdC5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBfb3V0ID0gZGVmLnRyYW5zZm9ybShwYXlsb2FkLnZhbHVlLCBwYXlsb2FkKTtcbiAgICAgICAgaWYgKGN0eC5hc3luYykge1xuICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gX291dCBpbnN0YW5jZW9mIFByb21pc2UgPyBfb3V0IDogUHJvbWlzZS5yZXNvbHZlKF9vdXQpO1xuICAgICAgICAgICAgcmV0dXJuIG91dHB1dC50aGVuKChvdXRwdXQpID0+IHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gb3V0cHV0O1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9vdXQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgY29yZS4kWm9kQXN5bmNFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSBfb3V0O1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVPcHRpb25hbFJlc3VsdChyZXN1bHQsIGlucHV0KSB7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoICYmIGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHsgaXNzdWVzOiBbXSwgdmFsdWU6IHVuZGVmaW5lZCB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGNvbnN0ICRab2RPcHRpb25hbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kT3B0aW9uYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2Qub3B0aW4gPSBcIm9wdGlvbmFsXCI7XG4gICAgaW5zdC5fem9kLm9wdG91dCA9IFwib3B0aW9uYWxcIjtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzID8gbmV3IFNldChbLi4uZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcywgdW5kZWZpbmVkXSkgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwYXR0ZXJuXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IGRlZi5pbm5lclR5cGUuX3pvZC5wYXR0ZXJuO1xuICAgICAgICByZXR1cm4gcGF0dGVybiA/IG5ldyBSZWdFeHAoYF4oJHt1dGlsLmNsZWFuUmVnZXgocGF0dGVybi5zb3VyY2UpfSk/JGApIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGRlZi5pbm5lclR5cGUuX3pvZC5vcHRpbiA9PT0gXCJvcHRpb25hbFwiKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKHIpID0+IGhhbmRsZU9wdGlvbmFsUmVzdWx0KHIsIHBheWxvYWQudmFsdWUpKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVPcHRpb25hbFJlc3VsdChyZXN1bHQsIHBheWxvYWQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXlsb2FkLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RFeGFjdE9wdGlvbmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RFeGFjdE9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBDYWxsIHBhcmVudCBpbml0IC0gaW5oZXJpdHMgb3B0aW4vb3B0b3V0ID0gXCJvcHRpb25hbFwiXG4gICAgJFpvZE9wdGlvbmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICAvLyBPdmVycmlkZSB2YWx1ZXMvcGF0dGVybiB0byBOT1QgYWRkIHVuZGVmaW5lZFxuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXMpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwicGF0dGVyblwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2QucGF0dGVybik7XG4gICAgLy8gT3ZlcnJpZGUgcGFyc2UgdG8ganVzdCBkZWxlZ2F0ZSAobm8gdW5kZWZpbmVkIGhhbmRsaW5nKVxuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE51bGxhYmxlID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROdWxsYWJsZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwib3B0aW5cIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLm9wdGluKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2Qub3B0b3V0KTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInBhdHRlcm5cIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXR0ZXJuID0gZGVmLmlubmVyVHlwZS5fem9kLnBhdHRlcm47XG4gICAgICAgIHJldHVybiBwYXR0ZXJuID8gbmV3IFJlZ0V4cChgXigke3V0aWwuY2xlYW5SZWdleChwYXR0ZXJuLnNvdXJjZSl9fG51bGwpJGApIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXMgPyBuZXcgU2V0KFsuLi5kZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzLCBudWxsXSkgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICAvLyBGb3J3YXJkIGRpcmVjdGlvbiAoZGVjb2RlKTogYWxsb3cgbnVsbCB0byBwYXNzIHRocm91Z2hcbiAgICAgICAgaWYgKHBheWxvYWQudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZERlZmF1bHQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZERlZmF1bHRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICAvLyBpbnN0Ll96b2QucWluID0gXCJ0cnVlXCI7XG4gICAgaW5zdC5fem9kLm9wdGluID0gXCJvcHRpb25hbFwiO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3J3YXJkIGRpcmVjdGlvbiAoZGVjb2RlKTogYXBwbHkgZGVmYXVsdHMgZm9yIHVuZGVmaW5lZCBpbnB1dFxuICAgICAgICBpZiAocGF5bG9hZC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gZGVmLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogJFpvZERlZmF1bHQgcmV0dXJucyB0aGUgZGVmYXVsdCB2YWx1ZSBpbW1lZGlhdGVseSBpbiBmb3J3YXJkIGRpcmVjdGlvbi5cbiAgICAgICAgICAgICAqIEl0IGRvZXNuJ3QgcGFzcyB0aGUgZGVmYXVsdCB2YWx1ZSBpbnRvIHRoZSB2YWxpZGF0b3IgKFwicHJlZmF1bHRcIikuIFRoZXJlJ3Mgbm8gcmVhc29uIHRvIHBhc3MgdGhlIGRlZmF1bHQgdmFsdWUgdGhyb3VnaCB2YWxpZGF0aW9uLiBUaGUgdmFsaWRpdHkgb2YgdGhlIGRlZmF1bHQgaXMgZW5mb3JjZWQgYnkgVHlwZVNjcmlwdCBzdGF0aWNhbGx5LiBPdGhlcndpc2UsIGl0J3MgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIHRoZSB1c2VyIHRvIGVuc3VyZSB0aGUgZGVmYXVsdCBpcyB2YWxpZC4gSW4gdGhlIGNhc2Ugb2YgcGlwZXMgd2l0aCBkaXZlcmdlbnQgaW4vb3V0IHR5cGVzLCB5b3UgY2FuIHNwZWNpZnkgdGhlIGRlZmF1bHQgb24gdGhlIGBpbmAgc2NoZW1hIG9mIHlvdXIgWm9kUGlwZSB0byBzZXQgYSBcInByZWZhdWx0XCIgZm9yIHRoZSBwaXBlLiAgICovXG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBGb3J3YXJkIGRpcmVjdGlvbjogY29udGludWUgd2l0aCBkZWZhdWx0IGhhbmRsaW5nXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiBoYW5kbGVEZWZhdWx0UmVzdWx0KHJlc3VsdCwgZGVmKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhbmRsZURlZmF1bHRSZXN1bHQocmVzdWx0LCBkZWYpO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZURlZmF1bHRSZXN1bHQocGF5bG9hZCwgZGVmKSB7XG4gICAgaWYgKHBheWxvYWQudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwYXlsb2FkLnZhbHVlID0gZGVmLmRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHBheWxvYWQ7XG59XG5leHBvcnQgY29uc3QgJFpvZFByZWZhdWx0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RQcmVmYXVsdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5vcHRpbiA9IFwib3B0aW9uYWxcIjtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGlmIChjdHguZGlyZWN0aW9uID09PSBcImJhY2t3YXJkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yd2FyZCBkaXJlY3Rpb24gKGRlY29kZSk6IGFwcGx5IHByZWZhdWx0IGZvciB1bmRlZmluZWQgaW5wdXRcbiAgICAgICAgaWYgKHBheWxvYWQudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IGRlZi5kZWZhdWx0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZE5vbk9wdGlvbmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2ROb25PcHRpb25hbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IHtcbiAgICAgICAgY29uc3QgdiA9IGRlZi5pbm5lclR5cGUuX3pvZC52YWx1ZXM7XG4gICAgICAgIHJldHVybiB2ID8gbmV3IFNldChbLi4udl0uZmlsdGVyKCh4KSA9PiB4ICE9PSB1bmRlZmluZWQpKSA6IHVuZGVmaW5lZDtcbiAgICB9KTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiBoYW5kbGVOb25PcHRpb25hbFJlc3VsdChyZXN1bHQsIGluc3QpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlTm9uT3B0aW9uYWxSZXN1bHQocmVzdWx0LCBpbnN0KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBoYW5kbGVOb25PcHRpb25hbFJlc3VsdChwYXlsb2FkLCBpbnN0KSB7XG4gICAgaWYgKCFwYXlsb2FkLmlzc3Vlcy5sZW5ndGggJiYgcGF5bG9hZC52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgIGV4cGVjdGVkOiBcIm5vbm9wdGlvbmFsXCIsXG4gICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgIGluc3QsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcGF5bG9hZDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kU3VjY2VzcyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kU3VjY2Vzc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IGNvcmUuJFpvZEVuY29kZUVycm9yKFwiWm9kU3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSByZXN1bHQuaXNzdWVzLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHBheWxvYWQudmFsdWUgPSByZXN1bHQuaXNzdWVzLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDYXRjaCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kQ2F0Y2hcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdGluXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC5vcHRpbik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLm9wdG91dCk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJ2YWx1ZXNcIiwgKCkgPT4gZGVmLmlubmVyVHlwZS5fem9kLnZhbHVlcyk7XG4gICAgaW5zdC5fem9kLnBhcnNlID0gKHBheWxvYWQsIGN0eCkgPT4ge1xuICAgICAgICBpZiAoY3R4LmRpcmVjdGlvbiA9PT0gXCJiYWNrd2FyZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bihwYXlsb2FkLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvcndhcmQgZGlyZWN0aW9uIChkZWNvZGUpOiBhcHBseSBjYXRjaCBsb2dpY1xuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYuY2F0Y2hWYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLnZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAocmVzdWx0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBkZWYuY2F0Y2hWYWx1ZSh7XG4gICAgICAgICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IHJlc3VsdC5pc3N1ZXMubWFwKChpc3MpID0+IHV0aWwuZmluYWxpemVJc3N1ZShpc3MsIGN0eCwgY29yZS5jb25maWcoKSkpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2ROYU4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZE5hTlwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcGF5bG9hZC52YWx1ZSAhPT0gXCJudW1iZXJcIiB8fCAhTnVtYmVyLmlzTmFOKHBheWxvYWQudmFsdWUpKSB7XG4gICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbnB1dDogcGF5bG9hZC52YWx1ZSxcbiAgICAgICAgICAgICAgICBpbnN0LFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBcIm5hblwiLFxuICAgICAgICAgICAgICAgIGNvZGU6IFwiaW52YWxpZF90eXBlXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kUGlwZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kUGlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYuaW4uX3pvZC5vcHRpbik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gZGVmLm91dC5fem9kLm9wdG91dCk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnByb3BWYWx1ZXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgY29uc3QgcmlnaHQgPSBkZWYub3V0Ll96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgICAgICBpZiAocmlnaHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJpZ2h0LnRoZW4oKHJpZ2h0KSA9PiBoYW5kbGVQaXBlUmVzdWx0KHJpZ2h0LCBkZWYuaW4sIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZVBpcGVSZXN1bHQocmlnaHQsIGRlZi5pbiwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsZWZ0ID0gZGVmLmluLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnQudGhlbigobGVmdCkgPT4gaGFuZGxlUGlwZVJlc3VsdChsZWZ0LCBkZWYub3V0LCBjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlUGlwZVJlc3VsdChsZWZ0LCBkZWYub3V0LCBjdHgpO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZVBpcGVSZXN1bHQobGVmdCwgbmV4dCwgY3R4KSB7XG4gICAgaWYgKGxlZnQuaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAvLyBwcmV2ZW50IGZ1cnRoZXIgY2hlY2tzXG4gICAgICAgIGxlZnQuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgIH1cbiAgICByZXR1cm4gbmV4dC5fem9kLnJ1bih7IHZhbHVlOiBsZWZ0LnZhbHVlLCBpc3N1ZXM6IGxlZnQuaXNzdWVzIH0sIGN0eCk7XG59XG5leHBvcnQgY29uc3QgJFpvZENvZGVjID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RDb2RlY1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwidmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnZhbHVlcyk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRpblwiLCAoKSA9PiBkZWYuaW4uX3pvZC5vcHRpbik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJvcHRvdXRcIiwgKCkgPT4gZGVmLm91dC5fem9kLm9wdG91dCk7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IGRlZi5pbi5fem9kLnByb3BWYWx1ZXMpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gY3R4LmRpcmVjdGlvbiB8fCBcImZvcndhcmRcIjtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJmb3J3YXJkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBkZWYuaW4uX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0LnRoZW4oKGxlZnQpID0+IGhhbmRsZUNvZGVjQVJlc3VsdChsZWZ0LCBkZWYsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUNvZGVjQVJlc3VsdChsZWZ0LCBkZWYsIGN0eCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IGRlZi5vdXQuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgICAgIGlmIChyaWdodCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmlnaHQudGhlbigocmlnaHQpID0+IGhhbmRsZUNvZGVjQVJlc3VsdChyaWdodCwgZGVmLCBjdHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVDb2RlY0FSZXN1bHQocmlnaHQsIGRlZiwgY3R4KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZUNvZGVjQVJlc3VsdChyZXN1bHQsIGRlZiwgY3R4KSB7XG4gICAgaWYgKHJlc3VsdC5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIHByZXZlbnQgZnVydGhlciBjaGVja3NcbiAgICAgICAgcmVzdWx0LmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBjdHguZGlyZWN0aW9uIHx8IFwiZm9yd2FyZFwiO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiZm9yd2FyZFwiKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gZGVmLnRyYW5zZm9ybShyZXN1bHQudmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1lZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZC50aGVuKCh2YWx1ZSkgPT4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHZhbHVlLCBkZWYub3V0LCBjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHRyYW5zZm9ybWVkLCBkZWYub3V0LCBjdHgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWQgPSBkZWYucmV2ZXJzZVRyYW5zZm9ybShyZXN1bHQudmFsdWUsIHJlc3VsdCk7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1lZCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1lZC50aGVuKCh2YWx1ZSkgPT4gaGFuZGxlQ29kZWNUeFJlc3VsdChyZXN1bHQsIHZhbHVlLCBkZWYuaW4sIGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVDb2RlY1R4UmVzdWx0KHJlc3VsdCwgdHJhbnNmb3JtZWQsIGRlZi5pbiwgY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYW5kbGVDb2RlY1R4UmVzdWx0KGxlZnQsIHZhbHVlLCBuZXh0U2NoZW1hLCBjdHgpIHtcbiAgICAvLyBDaGVjayBpZiB0cmFuc2Zvcm0gYWRkZWQgYW55IGlzc3Vlc1xuICAgIGlmIChsZWZ0Lmlzc3Vlcy5sZW5ndGgpIHtcbiAgICAgICAgbGVmdC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGxlZnQ7XG4gICAgfVxuICAgIHJldHVybiBuZXh0U2NoZW1hLl96b2QucnVuKHsgdmFsdWUsIGlzc3VlczogbGVmdC5pc3N1ZXMgfSwgY3R4KTtcbn1cbmV4cG9ydCBjb25zdCAkWm9kUmVhZG9ubHkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZFJlYWRvbmx5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IGRlZi5pbm5lclR5cGUuX3pvZC5wcm9wVmFsdWVzKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInZhbHVlc1wiLCAoKSA9PiBkZWYuaW5uZXJUeXBlLl96b2QudmFsdWVzKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdGluXCIsICgpID0+IGRlZi5pbm5lclR5cGU/Ll96b2Q/Lm9wdGluKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBkZWYuaW5uZXJUeXBlPy5fem9kPy5vcHRvdXQpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGRlZi5pbm5lclR5cGUuX3pvZC5ydW4ocGF5bG9hZCwgY3R4KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBkZWYuaW5uZXJUeXBlLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRoZW4oaGFuZGxlUmVhZG9ubHlSZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVSZWFkb25seVJlc3VsdChyZXN1bHQpO1xuICAgIH07XG59KTtcbmZ1bmN0aW9uIGhhbmRsZVJlYWRvbmx5UmVzdWx0KHBheWxvYWQpIHtcbiAgICBwYXlsb2FkLnZhbHVlID0gT2JqZWN0LmZyZWV6ZShwYXlsb2FkLnZhbHVlKTtcbiAgICByZXR1cm4gcGF5bG9hZDtcbn1cbmV4cG9ydCBjb25zdCAkWm9kVGVtcGxhdGVMaXRlcmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIiRab2RUZW1wbGF0ZUxpdGVyYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb25zdCByZWdleFBhcnRzID0gW107XG4gICAgZm9yIChjb25zdCBwYXJ0IG9mIGRlZi5wYXJ0cykge1xuICAgICAgICBpZiAodHlwZW9mIHBhcnQgPT09IFwib2JqZWN0XCIgJiYgcGFydCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaXMgWm9kIHNjaGVtYVxuICAgICAgICAgICAgaWYgKCFwYXJ0Ll96b2QucGF0dGVybikge1xuICAgICAgICAgICAgICAgIC8vIGlmICghc291cmNlKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB0ZW1wbGF0ZSBsaXRlcmFsIHBhcnQsIG5vIHBhdHRlcm4gZm91bmQ6ICR7Wy4uLnBhcnQuX3pvZC50cmFpdHNdLnNoaWZ0KCl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJ0Ll96b2QucGF0dGVybiBpbnN0YW5jZW9mIFJlZ0V4cCA/IHBhcnQuX3pvZC5wYXR0ZXJuLnNvdXJjZSA6IHBhcnQuX3pvZC5wYXR0ZXJuO1xuICAgICAgICAgICAgaWYgKCFzb3VyY2UpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHRlbXBsYXRlIGxpdGVyYWwgcGFydDogJHtwYXJ0Ll96b2QudHJhaXRzfWApO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBzb3VyY2Uuc3RhcnRzV2l0aChcIl5cIikgPyAxIDogMDtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHNvdXJjZS5lbmRzV2l0aChcIiRcIikgPyBzb3VyY2UubGVuZ3RoIC0gMSA6IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICByZWdleFBhcnRzLnB1c2goc291cmNlLnNsaWNlKHN0YXJ0LCBlbmQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYXJ0ID09PSBudWxsIHx8IHV0aWwucHJpbWl0aXZlVHlwZXMuaGFzKHR5cGVvZiBwYXJ0KSkge1xuICAgICAgICAgICAgcmVnZXhQYXJ0cy5wdXNoKHV0aWwuZXNjYXBlUmVnZXgoYCR7cGFydH1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdGVtcGxhdGUgbGl0ZXJhbCBwYXJ0OiAke3BhcnR9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5zdC5fem9kLnBhdHRlcm4gPSBuZXcgUmVnRXhwKGBeJHtyZWdleFBhcnRzLmpvaW4oXCJcIil9JGApO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfY3R4KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcGF5bG9hZC52YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdHlwZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICAgICAgfVxuICAgICAgICBpbnN0Ll96b2QucGF0dGVybi5sYXN0SW5kZXggPSAwO1xuICAgICAgICBpZiAoIWluc3QuX3pvZC5wYXR0ZXJuLnRlc3QocGF5bG9hZC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX2Zvcm1hdFwiLFxuICAgICAgICAgICAgICAgIGZvcm1hdDogZGVmLmZvcm1hdCA/PyBcInRlbXBsYXRlX2xpdGVyYWxcIixcbiAgICAgICAgICAgICAgICBwYXR0ZXJuOiBpbnN0Ll96b2QucGF0dGVybi5zb3VyY2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kRnVuY3Rpb24gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEZ1bmN0aW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAkWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fZGVmID0gZGVmO1xuICAgIGluc3QuX3pvZC5kZWYgPSBkZWY7XG4gICAgaW5zdC5pbXBsZW1lbnQgPSAoZnVuYykgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW1wbGVtZW50KCkgbXVzdCBiZSBjYWxsZWQgd2l0aCBhIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkQXJncyA9IGluc3QuX2RlZi5pbnB1dCA/IHBhcnNlKGluc3QuX2RlZi5pbnB1dCwgYXJncykgOiBhcmdzO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5hcHBseShmdW5jLCB0aGlzLCBwYXJzZWRBcmdzKTtcbiAgICAgICAgICAgIGlmIChpbnN0Ll9kZWYub3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlKGluc3QuX2RlZi5vdXRwdXQsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgIH07XG4gICAgaW5zdC5pbXBsZW1lbnRBc3luYyA9IChmdW5jKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbXBsZW1lbnRBc3luYygpIG11c3QgYmUgY2FsbGVkIHdpdGggYSBmdW5jdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXN5bmMgZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZEFyZ3MgPSBpbnN0Ll9kZWYuaW5wdXQgPyBhd2FpdCBwYXJzZUFzeW5jKGluc3QuX2RlZi5pbnB1dCwgYXJncykgOiBhcmdzO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUmVmbGVjdC5hcHBseShmdW5jLCB0aGlzLCBwYXJzZWRBcmdzKTtcbiAgICAgICAgICAgIGlmIChpbnN0Ll9kZWYub3V0cHV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHBhcnNlQXN5bmMoaW5zdC5fZGVmLm91dHB1dCwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHBheWxvYWQudmFsdWUgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJmdW5jdGlvblwiLFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXlsb2FkLnZhbHVlLFxuICAgICAgICAgICAgICAgIGluc3QsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIG91dHB1dCBpcyBhIHByb21pc2UgdHlwZSB0byBkZXRlcm1pbmUgaWYgd2Ugc2hvdWxkIHVzZSBhc3luYyBpbXBsZW1lbnRhdGlvblxuICAgICAgICBjb25zdCBoYXNQcm9taXNlT3V0cHV0ID0gaW5zdC5fZGVmLm91dHB1dCAmJiBpbnN0Ll9kZWYub3V0cHV0Ll96b2QuZGVmLnR5cGUgPT09IFwicHJvbWlzZVwiO1xuICAgICAgICBpZiAoaGFzUHJvbWlzZU91dHB1dCkge1xuICAgICAgICAgICAgcGF5bG9hZC52YWx1ZSA9IGluc3QuaW1wbGVtZW50QXN5bmMocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXlsb2FkLnZhbHVlID0gaW5zdC5pbXBsZW1lbnQocGF5bG9hZC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfTtcbiAgICBpbnN0LmlucHV0ID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3QgRiA9IGluc3QuY29uc3RydWN0b3I7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3NbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEYoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICAgICAgICBpbnB1dDogbmV3ICRab2RUdXBsZSh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwidHVwbGVcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHJlc3Q6IGFyZ3NbMV0sXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBpbnN0Ll9kZWYub3V0cHV0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBGKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICAgIGlucHV0OiBhcmdzWzBdLFxuICAgICAgICAgICAgb3V0cHV0OiBpbnN0Ll9kZWYub3V0cHV0LFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGluc3Qub3V0cHV0ID0gKG91dHB1dCkgPT4ge1xuICAgICAgICBjb25zdCBGID0gaW5zdC5jb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIG5ldyBGKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICAgIGlucHV0OiBpbnN0Ll9kZWYuaW5wdXQsXG4gICAgICAgICAgICBvdXRwdXQsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIGluc3Q7XG59KTtcbmV4cG9ydCBjb25zdCAkWm9kUHJvbWlzZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCIkWm9kUHJvbWlzZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBjdHgpID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXlsb2FkLnZhbHVlKS50aGVuKChpbm5lcikgPT4gZGVmLmlubmVyVHlwZS5fem9kLnJ1bih7IHZhbHVlOiBpbm5lciwgaXNzdWVzOiBbXSB9LCBjdHgpKTtcbiAgICB9O1xufSk7XG5leHBvcnQgY29uc3QgJFpvZExhenkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZExhenlcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgICRab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICAvLyBDYWNoZSB0aGUgcmVzb2x2ZWQgaW5uZXIgdHlwZSBvbiB0aGUgc2hhcmVkIGBkZWZgIHNvIGFsbCBjbG9uZXMgb2YgdGhpc1xuICAgIC8vIGxhenkgKGUuZy4gdmlhIGAuZGVzY3JpYmUoKWAvYC5tZXRhKClgKSBzaGFyZSB0aGUgc2FtZSBpbm5lciBpbnN0YW5jZSxcbiAgICAvLyBwcmVzZXJ2aW5nIGlkZW50aXR5IGZvciBjeWNsZSBkZXRlY3Rpb24gb24gcmVjdXJzaXZlIHNjaGVtYXMuXG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJpbm5lclR5cGVcIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBkID0gZGVmO1xuICAgICAgICBpZiAoIWQuX2NhY2hlZElubmVyKVxuICAgICAgICAgICAgZC5fY2FjaGVkSW5uZXIgPSBkZWYuZ2V0dGVyKCk7XG4gICAgICAgIHJldHVybiBkLl9jYWNoZWRJbm5lcjtcbiAgICB9KTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcInBhdHRlcm5cIiwgKCkgPT4gaW5zdC5fem9kLmlubmVyVHlwZT8uX3pvZD8ucGF0dGVybik7XG4gICAgdXRpbC5kZWZpbmVMYXp5KGluc3QuX3pvZCwgXCJwcm9wVmFsdWVzXCIsICgpID0+IGluc3QuX3pvZC5pbm5lclR5cGU/Ll96b2Q/LnByb3BWYWx1ZXMpO1xuICAgIHV0aWwuZGVmaW5lTGF6eShpbnN0Ll96b2QsIFwib3B0aW5cIiwgKCkgPT4gaW5zdC5fem9kLmlubmVyVHlwZT8uX3pvZD8ub3B0aW4gPz8gdW5kZWZpbmVkKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdC5fem9kLCBcIm9wdG91dFwiLCAoKSA9PiBpbnN0Ll96b2QuaW5uZXJUeXBlPy5fem9kPy5vcHRvdXQgPz8gdW5kZWZpbmVkKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgY3R4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlubmVyID0gaW5zdC5fem9kLmlubmVyVHlwZTtcbiAgICAgICAgcmV0dXJuIGlubmVyLl96b2QucnVuKHBheWxvYWQsIGN0eCk7XG4gICAgfTtcbn0pO1xuZXhwb3J0IGNvbnN0ICRab2RDdXN0b20gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiJFpvZEN1c3RvbVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY2hlY2tzLiRab2RDaGVjay5pbml0KGluc3QsIGRlZik7XG4gICAgJFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wYXJzZSA9IChwYXlsb2FkLCBfKSA9PiB7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH07XG4gICAgaW5zdC5fem9kLmNoZWNrID0gKHBheWxvYWQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBwYXlsb2FkLnZhbHVlO1xuICAgICAgICBjb25zdCByID0gZGVmLmZuKGlucHV0KTtcbiAgICAgICAgaWYgKHIgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gci50aGVuKChyKSA9PiBoYW5kbGVSZWZpbmVSZXN1bHQociwgcGF5bG9hZCwgaW5wdXQsIGluc3QpKTtcbiAgICAgICAgfVxuICAgICAgICBoYW5kbGVSZWZpbmVSZXN1bHQociwgcGF5bG9hZCwgaW5wdXQsIGluc3QpO1xuICAgICAgICByZXR1cm47XG4gICAgfTtcbn0pO1xuZnVuY3Rpb24gaGFuZGxlUmVmaW5lUmVzdWx0KHJlc3VsdCwgcGF5bG9hZCwgaW5wdXQsIGluc3QpIHtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICBjb25zdCBfaXNzID0ge1xuICAgICAgICAgICAgY29kZTogXCJjdXN0b21cIixcbiAgICAgICAgICAgIGlucHV0LFxuICAgICAgICAgICAgaW5zdCwgLy8gaW5jb3Jwb3JhdGVzIHBhcmFtcy5lcnJvciBpbnRvIGlzc3VlIHJlcG9ydGluZ1xuICAgICAgICAgICAgcGF0aDogWy4uLihpbnN0Ll96b2QuZGVmLnBhdGggPz8gW10pXSwgLy8gaW5jb3Jwb3JhdGVzIHBhcmFtcy5lcnJvciBpbnRvIGlzc3VlIHJlcG9ydGluZ1xuICAgICAgICAgICAgY29udGludWU6ICFpbnN0Ll96b2QuZGVmLmFib3J0LFxuICAgICAgICAgICAgLy8gcGFyYW1zOiBpbnN0Ll96b2QuZGVmLnBhcmFtcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGluc3QuX3pvZC5kZWYucGFyYW1zKVxuICAgICAgICAgICAgX2lzcy5wYXJhbXMgPSBpbnN0Ll96b2QuZGVmLnBhcmFtcztcbiAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh1dGlsLmlzc3VlKF9pc3MpKTtcbiAgICB9XG59XG4iLCJ2YXIgX2E7XG5leHBvcnQgY29uc3QgJG91dHB1dCA9IFN5bWJvbChcIlpvZE91dHB1dFwiKTtcbmV4cG9ydCBjb25zdCAkaW5wdXQgPSBTeW1ib2woXCJab2RJbnB1dFwiKTtcbmV4cG9ydCBjbGFzcyAkWm9kUmVnaXN0cnkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXcgV2Vha01hcCgpO1xuICAgICAgICB0aGlzLl9pZG1hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgYWRkKHNjaGVtYSwgLi4uX21ldGEpIHtcbiAgICAgICAgY29uc3QgbWV0YSA9IF9tZXRhWzBdO1xuICAgICAgICB0aGlzLl9tYXAuc2V0KHNjaGVtYSwgbWV0YSk7XG4gICAgICAgIGlmIChtZXRhICYmIHR5cGVvZiBtZXRhID09PSBcIm9iamVjdFwiICYmIFwiaWRcIiBpbiBtZXRhKSB7XG4gICAgICAgICAgICB0aGlzLl9pZG1hcC5zZXQobWV0YS5pZCwgc2NoZW1hKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIHRoaXMuX2lkbWFwID0gbmV3IE1hcCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlKHNjaGVtYSkge1xuICAgICAgICBjb25zdCBtZXRhID0gdGhpcy5fbWFwLmdldChzY2hlbWEpO1xuICAgICAgICBpZiAobWV0YSAmJiB0eXBlb2YgbWV0YSA9PT0gXCJvYmplY3RcIiAmJiBcImlkXCIgaW4gbWV0YSkge1xuICAgICAgICAgICAgdGhpcy5faWRtYXAuZGVsZXRlKG1ldGEuaWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcC5kZWxldGUoc2NoZW1hKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGdldChzY2hlbWEpIHtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuX21hcC5nZXQoc2NoZW1hKSBhcyBhbnk7XG4gICAgICAgIC8vIGluaGVyaXQgbWV0YWRhdGFcbiAgICAgICAgY29uc3QgcCA9IHNjaGVtYS5fem9kLnBhcmVudDtcbiAgICAgICAgaWYgKHApIHtcbiAgICAgICAgICAgIGNvbnN0IHBtID0geyAuLi4odGhpcy5nZXQocCkgPz8ge30pIH07XG4gICAgICAgICAgICBkZWxldGUgcG0uaWQ7IC8vIGRvIG5vdCBpbmhlcml0IGlkXG4gICAgICAgICAgICBjb25zdCBmID0geyAuLi5wbSwgLi4udGhpcy5fbWFwLmdldChzY2hlbWEpIH07XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZikubGVuZ3RoID8gZiA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWFwLmdldChzY2hlbWEpO1xuICAgIH1cbiAgICBoYXMoc2NoZW1hKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXAuaGFzKHNjaGVtYSk7XG4gICAgfVxufVxuLy8gcmVnaXN0cmllc1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdHJ5KCkge1xuICAgIHJldHVybiBuZXcgJFpvZFJlZ2lzdHJ5KCk7XG59XG4oX2EgPSBnbG9iYWxUaGlzKS5fX3pvZF9nbG9iYWxSZWdpc3RyeSA/PyAoX2EuX196b2RfZ2xvYmFsUmVnaXN0cnkgPSByZWdpc3RyeSgpKTtcbmV4cG9ydCBjb25zdCBnbG9iYWxSZWdpc3RyeSA9IGdsb2JhbFRoaXMuX196b2RfZ2xvYmFsUmVnaXN0cnk7XG4iLCJpbXBvcnQgKiBhcyBjaGVja3MgZnJvbSBcIi4vY2hlY2tzLmpzXCI7XG5pbXBvcnQgKiBhcyByZWdpc3RyaWVzIGZyb20gXCIuL3JlZ2lzdHJpZXMuanNcIjtcbmltcG9ydCAqIGFzIHNjaGVtYXMgZnJvbSBcIi4vc2NoZW1hcy5qc1wiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tIFwiLi91dGlsLmpzXCI7XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zdHJpbmcoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY29lcmNlZFN0cmluZyhDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGNvZXJjZTogdHJ1ZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2VtYWlsKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImVtYWlsXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZ3VpZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJndWlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdXVpZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJ1dWlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdXVpZHY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcInV1aWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIHZlcnNpb246IFwidjRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3V1aWR2NihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJ1dWlkXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICB2ZXJzaW9uOiBcInY2XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91dWlkdjcoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwidXVpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgdmVyc2lvbjogXCJ2N1wiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdXJsKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcInVybFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2Vtb2ppKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImVtb2ppXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbmFub2lkKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcIm5hbm9pZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8qKlxuICogQGRlcHJlY2F0ZWQgQ1VJRCB2MSBpcyBkZXByZWNhdGVkIGJ5IGl0cyBhdXRob3JzIGR1ZSB0byBpbmZvcm1hdGlvbiBsZWFrYWdlXG4gKiAodGltZXN0YW1wcyBlbWJlZGRlZCBpbiB0aGUgaWQpLiBVc2Uge0BsaW5rIF9jdWlkMn0gaW5zdGVhZC5cbiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcGFyYWxsZWxkcml2ZS9jdWlkLlxuICovXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jdWlkKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImN1aWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jdWlkMihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJjdWlkMlwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3VsaWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwidWxpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3hpZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJ4aWRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9rc3VpZChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJrc3VpZFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2lwdjQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiaXB2NFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2lwdjYoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiaXB2NlwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX21hYyhDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJtYWNcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jaWRydjQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiY2lkcnY0XCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY2lkcnY2KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImNpZHJ2NlwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2Jhc2U2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJiYXNlNjRcIixcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9iYXNlNjR1cmwoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwiYmFzZTY0dXJsXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZTE2NChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJlMTY0XCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfand0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImp3dFwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGFib3J0OiBmYWxzZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBUaW1lUHJlY2lzaW9uID0ge1xuICAgIEFueTogbnVsbCxcbiAgICBNaW51dGU6IC0xLFxuICAgIFNlY29uZDogMCxcbiAgICBNaWxsaXNlY29uZDogMyxcbiAgICBNaWNyb3NlY29uZDogNixcbn07XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pc29EYXRlVGltZShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJkYXRldGltZVwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIG9mZnNldDogZmFsc2UsXG4gICAgICAgIGxvY2FsOiBmYWxzZSxcbiAgICAgICAgcHJlY2lzaW9uOiBudWxsLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaXNvRGF0ZShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJkYXRlXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2lzb1RpbWUoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQ6IFwidGltZVwiLFxuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIHByZWNpc2lvbjogbnVsbCxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2lzb0R1cmF0aW9uKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZm9ybWF0OiBcImR1cmF0aW9uXCIsXG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX251bWJlcihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrczogW10sXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jb2VyY2VkTnVtYmVyKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgY29lcmNlOiB0cnVlLFxuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaW50KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgY2hlY2s6IFwibnVtYmVyX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJzYWZlaW50XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9mbG9hdDMyKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgY2hlY2s6IFwibnVtYmVyX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJmbG9hdDMyXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9mbG9hdDY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJudW1iZXJcIixcbiAgICAgICAgY2hlY2s6IFwibnVtYmVyX2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJmbG9hdDY0XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pbnQzMihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrOiBcIm51bWJlcl9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwiaW50MzJcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3VpbnQzMihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgIGNoZWNrOiBcIm51bWJlcl9mb3JtYXRcIixcbiAgICAgICAgYWJvcnQ6IGZhbHNlLFxuICAgICAgICBmb3JtYXQ6IFwidWludDMyXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9ib29sZWFuKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jb2VyY2VkQm9vbGVhbihDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgICBjb2VyY2U6IHRydWUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9iaWdpbnQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImJpZ2ludFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY29lcmNlZEJpZ2ludChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYmlnaW50XCIsXG4gICAgICAgIGNvZXJjZTogdHJ1ZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2ludDY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJiaWdpbnRcIixcbiAgICAgICAgY2hlY2s6IFwiYmlnaW50X2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJpbnQ2NFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdWludDY0KENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJiaWdpbnRcIixcbiAgICAgICAgY2hlY2s6IFwiYmlnaW50X2Zvcm1hdFwiLFxuICAgICAgICBhYm9ydDogZmFsc2UsXG4gICAgICAgIGZvcm1hdDogXCJ1aW50NjRcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3N5bWJvbChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic3ltYm9sXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91bmRlZmluZWQoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInVuZGVmaW5lZFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbnVsbChDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibnVsbFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfYW55KENsYXNzKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYW55XCIsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91bmtub3duKENsYXNzKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidW5rbm93blwiLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbmV2ZXIoQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm5ldmVyXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF92b2lkKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ2b2lkXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9kYXRlKENsYXNzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jb2VyY2VkRGF0ZShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICBjb2VyY2U6IHRydWUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9uYW4oQ2xhc3MsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm5hblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbHQodmFsdWUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja0xlc3NUaGFuKHtcbiAgICAgICAgY2hlY2s6IFwibGVzc190aGFuXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbHRlKHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tMZXNzVGhhbih7XG4gICAgICAgIGNoZWNrOiBcImxlc3NfdGhhblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgIH0pO1xufVxuZXhwb3J0IHsgXG4vKiogQGRlcHJlY2F0ZWQgVXNlIGB6Lmx0ZSgpYCBpbnN0ZWFkLiAqL1xuX2x0ZSBhcyBfbWF4LCB9O1xuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZ3QodmFsdWUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja0dyZWF0ZXJUaGFuKHtcbiAgICAgICAgY2hlY2s6IFwiZ3JlYXRlcl90aGFuXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZ3RlKHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tHcmVhdGVyVGhhbih7XG4gICAgICAgIGNoZWNrOiBcImdyZWF0ZXJfdGhhblwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgIH0pO1xufVxuZXhwb3J0IHsgXG4vKiogQGRlcHJlY2F0ZWQgVXNlIGB6Lmd0ZSgpYCBpbnN0ZWFkLiAqL1xuX2d0ZSBhcyBfbWluLCB9O1xuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcG9zaXRpdmUocGFyYW1zKSB7XG4gICAgcmV0dXJuIF9ndCgwLCBwYXJhbXMpO1xufVxuLy8gbmVnYXRpdmVcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25lZ2F0aXZlKHBhcmFtcykge1xuICAgIHJldHVybiBfbHQoMCwgcGFyYW1zKTtcbn1cbi8vIG5vbnBvc2l0aXZlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9ub25wb3NpdGl2ZShwYXJhbXMpIHtcbiAgICByZXR1cm4gX2x0ZSgwLCBwYXJhbXMpO1xufVxuLy8gbm9ubmVnYXRpdmVcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25vbm5lZ2F0aXZlKHBhcmFtcykge1xuICAgIHJldHVybiBfZ3RlKDAsIHBhcmFtcyk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9tdWx0aXBsZU9mKHZhbHVlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tNdWx0aXBsZU9mKHtcbiAgICAgICAgY2hlY2s6IFwibXVsdGlwbGVfb2ZcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgdmFsdWUsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9tYXhTaXplKG1heGltdW0sIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja01heFNpemUoe1xuICAgICAgICBjaGVjazogXCJtYXhfc2l6ZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBtYXhpbXVtLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWluU2l6ZShtaW5pbXVtLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tNaW5TaXplKHtcbiAgICAgICAgY2hlY2s6IFwibWluX3NpemVcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgbWluaW11bSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3NpemUoc2l6ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrU2l6ZUVxdWFscyh7XG4gICAgICAgIGNoZWNrOiBcInNpemVfZXF1YWxzXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHNpemUsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9tYXhMZW5ndGgobWF4aW11bSwgcGFyYW1zKSB7XG4gICAgY29uc3QgY2ggPSBuZXcgY2hlY2tzLiRab2RDaGVja01heExlbmd0aCh7XG4gICAgICAgIGNoZWNrOiBcIm1heF9sZW5ndGhcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgbWF4aW11bSxcbiAgICB9KTtcbiAgICByZXR1cm4gY2g7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9taW5MZW5ndGgobWluaW11bSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTWluTGVuZ3RoKHtcbiAgICAgICAgY2hlY2s6IFwibWluX2xlbmd0aFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBtaW5pbXVtLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbGVuZ3RoKGxlbmd0aCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTGVuZ3RoRXF1YWxzKHtcbiAgICAgICAgY2hlY2s6IFwibGVuZ3RoX2VxdWFsc1wiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBsZW5ndGgsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9yZWdleChwYXR0ZXJuLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tSZWdleCh7XG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgZm9ybWF0OiBcInJlZ2V4XCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgIHBhdHRlcm4sXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9sb3dlcmNhc2UocGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrTG93ZXJDYXNlKHtcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBmb3JtYXQ6IFwibG93ZXJjYXNlXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91cHBlcmNhc2UocGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrVXBwZXJDYXNlKHtcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBmb3JtYXQ6IFwidXBwZXJjYXNlXCIsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9pbmNsdWRlcyhpbmNsdWRlcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBjaGVja3MuJFpvZENoZWNrSW5jbHVkZXMoe1xuICAgICAgICBjaGVjazogXCJzdHJpbmdfZm9ybWF0XCIsXG4gICAgICAgIGZvcm1hdDogXCJpbmNsdWRlc1wiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBpbmNsdWRlcyxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3N0YXJ0c1dpdGgocHJlZml4LCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tTdGFydHNXaXRoKHtcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICBmb3JtYXQ6IFwic3RhcnRzX3dpdGhcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICAgICAgcHJlZml4LFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZW5kc1dpdGgoc3VmZml4LCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tFbmRzV2l0aCh7XG4gICAgICAgIGNoZWNrOiBcInN0cmluZ19mb3JtYXRcIixcbiAgICAgICAgZm9ybWF0OiBcImVuZHNfd2l0aFwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICBzdWZmaXgsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9wcm9wZXJ0eShwcm9wZXJ0eSwgc2NoZW1hLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tQcm9wZXJ0eSh7XG4gICAgICAgIGNoZWNrOiBcInByb3BlcnR5XCIsXG4gICAgICAgIHByb3BlcnR5LFxuICAgICAgICBzY2hlbWEsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9taW1lKHR5cGVzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IGNoZWNrcy4kWm9kQ2hlY2tNaW1lVHlwZSh7XG4gICAgICAgIGNoZWNrOiBcIm1pbWVfdHlwZVwiLFxuICAgICAgICBtaW1lOiB0eXBlcyxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX292ZXJ3cml0ZSh0eCkge1xuICAgIHJldHVybiBuZXcgY2hlY2tzLiRab2RDaGVja092ZXJ3cml0ZSh7XG4gICAgICAgIGNoZWNrOiBcIm92ZXJ3cml0ZVwiLFxuICAgICAgICB0eCxcbiAgICB9KTtcbn1cbi8vIG5vcm1hbGl6ZVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbm9ybWFsaXplKGZvcm0pIHtcbiAgICByZXR1cm4gX292ZXJ3cml0ZSgoaW5wdXQpID0+IGlucHV0Lm5vcm1hbGl6ZShmb3JtKSk7XG59XG4vLyB0cmltXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF90cmltKCkge1xuICAgIHJldHVybiBfb3ZlcndyaXRlKChpbnB1dCkgPT4gaW5wdXQudHJpbSgpKTtcbn1cbi8vIHRvTG93ZXJDYXNlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF90b0xvd2VyQ2FzZSgpIHtcbiAgICByZXR1cm4gX292ZXJ3cml0ZSgoaW5wdXQpID0+IGlucHV0LnRvTG93ZXJDYXNlKCkpO1xufVxuLy8gdG9VcHBlckNhc2Vcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3RvVXBwZXJDYXNlKCkge1xuICAgIHJldHVybiBfb3ZlcndyaXRlKChpbnB1dCkgPT4gaW5wdXQudG9VcHBlckNhc2UoKSk7XG59XG4vLyBzbHVnaWZ5XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zbHVnaWZ5KCkge1xuICAgIHJldHVybiBfb3ZlcndyaXRlKChpbnB1dCkgPT4gdXRpbC5zbHVnaWZ5KGlucHV0KSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9hcnJheShDbGFzcywgZWxlbWVudCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgLy8gZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgIC8vICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIC8vIH0sXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF91bmlvbihDbGFzcywgb3B0aW9ucywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwidW5pb25cIixcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBfeG9yKENsYXNzLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ1bmlvblwiLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZGlzY3JpbWluYXRlZFVuaW9uKENsYXNzLCBkaXNjcmltaW5hdG9yLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ1bmlvblwiLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICBkaXNjcmltaW5hdG9yLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfaW50ZXJzZWN0aW9uKENsYXNzLCBsZWZ0LCByaWdodCkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImludGVyc2VjdGlvblwiLFxuICAgICAgICBsZWZ0LFxuICAgICAgICByaWdodCxcbiAgICB9KTtcbn1cbi8vIGV4cG9ydCBmdW5jdGlvbiBfdHVwbGUoXG4vLyAgIENsYXNzOiB1dGlsLlNjaGVtYUNsYXNzPHNjaGVtYXMuJFpvZFR1cGxlPixcbi8vICAgaXRlbXM6IFtdLFxuLy8gICBwYXJhbXM/OiBzdHJpbmcgfCAkWm9kVHVwbGVQYXJhbXNcbi8vICk6IHNjaGVtYXMuJFpvZFR1cGxlPFtdLCBudWxsPjtcbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3R1cGxlKENsYXNzLCBpdGVtcywgX3BhcmFtc09yUmVzdCwgX3BhcmFtcykge1xuICAgIGNvbnN0IGhhc1Jlc3QgPSBfcGFyYW1zT3JSZXN0IGluc3RhbmNlb2Ygc2NoZW1hcy4kWm9kVHlwZTtcbiAgICBjb25zdCBwYXJhbXMgPSBoYXNSZXN0ID8gX3BhcmFtcyA6IF9wYXJhbXNPclJlc3Q7XG4gICAgY29uc3QgcmVzdCA9IGhhc1Jlc3QgPyBfcGFyYW1zT3JSZXN0IDogbnVsbDtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJ0dXBsZVwiLFxuICAgICAgICBpdGVtcyxcbiAgICAgICAgcmVzdCxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3JlY29yZChDbGFzcywga2V5VHlwZSwgdmFsdWVUeXBlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJyZWNvcmRcIixcbiAgICAgICAga2V5VHlwZSxcbiAgICAgICAgdmFsdWVUeXBlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfbWFwKENsYXNzLCBrZXlUeXBlLCB2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm1hcFwiLFxuICAgICAgICBrZXlUeXBlLFxuICAgICAgICB2YWx1ZVR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zZXQoQ2xhc3MsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwic2V0XCIsXG4gICAgICAgIHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX2VudW0oQ2xhc3MsIHZhbHVlcywgcGFyYW1zKSB7XG4gICAgY29uc3QgZW50cmllcyA9IEFycmF5LmlzQXJyYXkodmFsdWVzKSA/IE9iamVjdC5mcm9tRW50cmllcyh2YWx1ZXMubWFwKCh2KSA9PiBbdiwgdl0pKSA6IHZhbHVlcztcbiAgICAvLyBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgLy8gICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgIC8vICAgICBlbnRyaWVzW3ZhbHVlXSA9IHZhbHVlO1xuICAgIC8vICAgfVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICBPYmplY3QuYXNzaWduKGVudHJpZXMsIHZhbHVlcyk7XG4gICAgLy8gfVxuICAgIC8vIGNvbnN0IGVudHJpZXM6IHV0aWwuRW51bUxpa2UgPSB7fTtcbiAgICAvLyBmb3IgKGNvbnN0IHZhbCBvZiB2YWx1ZXMpIHtcbiAgICAvLyAgIGVudHJpZXNbdmFsXSA9IHZhbDtcbiAgICAvLyB9XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbi8qKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBoYXMgYmVlbiBtZXJnZWQgaW50byBgei5lbnVtKClgLiBVc2UgYHouZW51bSgpYCBpbnN0ZWFkLlxuICpcbiAqIGBgYHRzXG4gKiBlbnVtIENvbG9ycyB7IHJlZCwgZ3JlZW4sIGJsdWUgfVxuICogei5lbnVtKENvbG9ycyk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9uYXRpdmVFbnVtKENsYXNzLCBlbnRyaWVzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9saXRlcmFsKENsYXNzLCB2YWx1ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwibGl0ZXJhbFwiLFxuICAgICAgICB2YWx1ZXM6IEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfZmlsZShDbGFzcywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyh7XG4gICAgICAgIHR5cGU6IFwiZmlsZVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfdHJhbnNmb3JtKENsYXNzLCBmbikge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInRyYW5zZm9ybVwiLFxuICAgICAgICB0cmFuc2Zvcm06IGZuLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfb3B0aW9uYWwoQ2xhc3MsIGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm9wdGlvbmFsXCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX251bGxhYmxlKENsYXNzLCBpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJudWxsYWJsZVwiLFxuICAgICAgICBpbm5lclR5cGUsXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9kZWZhdWx0KENsYXNzLCBpbm5lclR5cGUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImRlZmF1bHRcIixcbiAgICAgICAgaW5uZXJUeXBlLFxuICAgICAgICBnZXQgZGVmYXVsdFZhbHVlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBkZWZhdWx0VmFsdWUgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWx1ZSgpIDogdXRpbC5zaGFsbG93Q2xvbmUoZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX25vbm9wdGlvbmFsKENsYXNzLCBpbm5lclR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcIm5vbm9wdGlvbmFsXCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3N1Y2Nlc3MoQ2xhc3MsIGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgaW5uZXJUeXBlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY2F0Y2goQ2xhc3MsIGlubmVyVHlwZSwgY2F0Y2hWYWx1ZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImNhdGNoXCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICAgICAgY2F0Y2hWYWx1ZTogKHR5cGVvZiBjYXRjaFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYXRjaFZhbHVlIDogKCkgPT4gY2F0Y2hWYWx1ZSksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9waXBlKENsYXNzLCBpbl8sIG91dCkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IGluXyxcbiAgICAgICAgb3V0LFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfcmVhZG9ubHkoQ2xhc3MsIGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInJlYWRvbmx5XCIsXG4gICAgICAgIGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3RlbXBsYXRlTGl0ZXJhbChDbGFzcywgcGFydHMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInRlbXBsYXRlX2xpdGVyYWxcIixcbiAgICAgICAgcGFydHMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9sYXp5KENsYXNzLCBnZXR0ZXIpIHtcbiAgICByZXR1cm4gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJsYXp5XCIsXG4gICAgICAgIGdldHRlcixcbiAgICB9KTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3Byb21pc2UoQ2xhc3MsIGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcInByb21pc2VcIixcbiAgICAgICAgaW5uZXJUeXBlLFxuICAgIH0pO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfY3VzdG9tKENsYXNzLCBmbiwgX3BhcmFtcykge1xuICAgIGNvbnN0IG5vcm0gPSB1dGlsLm5vcm1hbGl6ZVBhcmFtcyhfcGFyYW1zKTtcbiAgICBub3JtLmFib3J0ID8/IChub3JtLmFib3J0ID0gdHJ1ZSk7IC8vIGRlZmF1bHQgdG8gYWJvcnQ6ZmFsc2VcbiAgICBjb25zdCBzY2hlbWEgPSBuZXcgQ2xhc3Moe1xuICAgICAgICB0eXBlOiBcImN1c3RvbVwiLFxuICAgICAgICBjaGVjazogXCJjdXN0b21cIixcbiAgICAgICAgZm46IGZuLFxuICAgICAgICAuLi5ub3JtLFxuICAgIH0pO1xuICAgIHJldHVybiBzY2hlbWE7XG59XG4vLyBzYW1lIGFzIF9jdXN0b20gYnV0IGRlZmF1bHRzIHRvIGFib3J0OmZhbHNlXG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9yZWZpbmUoQ2xhc3MsIGZuLCBfcGFyYW1zKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gbmV3IENsYXNzKHtcbiAgICAgICAgdHlwZTogXCJjdXN0b21cIixcbiAgICAgICAgY2hlY2s6IFwiY3VzdG9tXCIsXG4gICAgICAgIGZuOiBmbixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMoX3BhcmFtcyksXG4gICAgfSk7XG4gICAgcmV0dXJuIHNjaGVtYTtcbn1cbi8vIEBfX05PX1NJREVfRUZGRUNUU19fXG5leHBvcnQgZnVuY3Rpb24gX3N1cGVyUmVmaW5lKGZuLCBwYXJhbXMpIHtcbiAgICBjb25zdCBjaCA9IF9jaGVjaygocGF5bG9hZCkgPT4ge1xuICAgICAgICBwYXlsb2FkLmFkZElzc3VlID0gKGlzc3VlKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlzc3VlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh1dGlsLmlzc3VlKGlzc3VlLCBwYXlsb2FkLnZhbHVlLCBjaC5fem9kLmRlZikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZm9yIFpvZCAzIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgY29uc3QgX2lzc3VlID0gaXNzdWU7XG4gICAgICAgICAgICAgICAgaWYgKF9pc3N1ZS5mYXRhbClcbiAgICAgICAgICAgICAgICAgICAgX2lzc3VlLmNvbnRpbnVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX2lzc3VlLmNvZGUgPz8gKF9pc3N1ZS5jb2RlID0gXCJjdXN0b21cIik7XG4gICAgICAgICAgICAgICAgX2lzc3VlLmlucHV0ID8/IChfaXNzdWUuaW5wdXQgPSBwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBfaXNzdWUuaW5zdCA/PyAoX2lzc3VlLmluc3QgPSBjaCk7XG4gICAgICAgICAgICAgICAgX2lzc3VlLmNvbnRpbnVlID8/IChfaXNzdWUuY29udGludWUgPSAhY2guX3pvZC5kZWYuYWJvcnQpOyAvLyBhYm9ydCBpcyBhbHdheXMgdW5kZWZpbmVkLCBzbyB0aGlzIGlzIGFsd2F5cyB0cnVlLi4uXG4gICAgICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh1dGlsLmlzc3VlKF9pc3N1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZm4ocGF5bG9hZC52YWx1ZSwgcGF5bG9hZCk7XG4gICAgfSwgcGFyYW1zKTtcbiAgICByZXR1cm4gY2g7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9jaGVjayhmbiwgcGFyYW1zKSB7XG4gICAgY29uc3QgY2ggPSBuZXcgY2hlY2tzLiRab2RDaGVjayh7XG4gICAgICAgIGNoZWNrOiBcImN1c3RvbVwiLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xuICAgIGNoLl96b2QuY2hlY2sgPSBmbjtcbiAgICByZXR1cm4gY2g7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIGRlc2NyaWJlKGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgY2ggPSBuZXcgY2hlY2tzLiRab2RDaGVjayh7IGNoZWNrOiBcImRlc2NyaWJlXCIgfSk7XG4gICAgY2guX3pvZC5vbmF0dGFjaCA9IFtcbiAgICAgICAgKGluc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gcmVnaXN0cmllcy5nbG9iYWxSZWdpc3RyeS5nZXQoaW5zdCkgPz8ge307XG4gICAgICAgICAgICByZWdpc3RyaWVzLmdsb2JhbFJlZ2lzdHJ5LmFkZChpbnN0LCB7IC4uLmV4aXN0aW5nLCBkZXNjcmlwdGlvbiB9KTtcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIGNoLl96b2QuY2hlY2sgPSAoKSA9PiB7IH07IC8vIG5vLW9wIGNoZWNrXG4gICAgcmV0dXJuIGNoO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBtZXRhKG1ldGFkYXRhKSB7XG4gICAgY29uc3QgY2ggPSBuZXcgY2hlY2tzLiRab2RDaGVjayh7IGNoZWNrOiBcIm1ldGFcIiB9KTtcbiAgICBjaC5fem9kLm9uYXR0YWNoID0gW1xuICAgICAgICAoaW5zdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSByZWdpc3RyaWVzLmdsb2JhbFJlZ2lzdHJ5LmdldChpbnN0KSA/PyB7fTtcbiAgICAgICAgICAgIHJlZ2lzdHJpZXMuZ2xvYmFsUmVnaXN0cnkuYWRkKGluc3QsIHsgLi4uZXhpc3RpbmcsIC4uLm1ldGFkYXRhIH0pO1xuICAgICAgICB9LFxuICAgIF07XG4gICAgY2guX3pvZC5jaGVjayA9ICgpID0+IHsgfTsgLy8gbm8tb3AgY2hlY2tcbiAgICByZXR1cm4gY2g7XG59XG4vLyBAX19OT19TSURFX0VGRkVDVFNfX1xuZXhwb3J0IGZ1bmN0aW9uIF9zdHJpbmdib29sKENsYXNzZXMsIF9wYXJhbXMpIHtcbiAgICBjb25zdCBwYXJhbXMgPSB1dGlsLm5vcm1hbGl6ZVBhcmFtcyhfcGFyYW1zKTtcbiAgICBsZXQgdHJ1dGh5QXJyYXkgPSBwYXJhbXMudHJ1dGh5ID8/IFtcInRydWVcIiwgXCIxXCIsIFwieWVzXCIsIFwib25cIiwgXCJ5XCIsIFwiZW5hYmxlZFwiXTtcbiAgICBsZXQgZmFsc3lBcnJheSA9IHBhcmFtcy5mYWxzeSA/PyBbXCJmYWxzZVwiLCBcIjBcIiwgXCJub1wiLCBcIm9mZlwiLCBcIm5cIiwgXCJkaXNhYmxlZFwiXTtcbiAgICBpZiAocGFyYW1zLmNhc2UgIT09IFwic2Vuc2l0aXZlXCIpIHtcbiAgICAgICAgdHJ1dGh5QXJyYXkgPSB0cnV0aHlBcnJheS5tYXAoKHYpID0+ICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiA/IHYudG9Mb3dlckNhc2UoKSA6IHYpKTtcbiAgICAgICAgZmFsc3lBcnJheSA9IGZhbHN5QXJyYXkubWFwKCh2KSA9PiAodHlwZW9mIHYgPT09IFwic3RyaW5nXCIgPyB2LnRvTG93ZXJDYXNlKCkgOiB2KSk7XG4gICAgfVxuICAgIGNvbnN0IHRydXRoeVNldCA9IG5ldyBTZXQodHJ1dGh5QXJyYXkpO1xuICAgIGNvbnN0IGZhbHN5U2V0ID0gbmV3IFNldChmYWxzeUFycmF5KTtcbiAgICBjb25zdCBfQ29kZWMgPSBDbGFzc2VzLkNvZGVjID8/IHNjaGVtYXMuJFpvZENvZGVjO1xuICAgIGNvbnN0IF9Cb29sZWFuID0gQ2xhc3Nlcy5Cb29sZWFuID8/IHNjaGVtYXMuJFpvZEJvb2xlYW47XG4gICAgY29uc3QgX1N0cmluZyA9IENsYXNzZXMuU3RyaW5nID8/IHNjaGVtYXMuJFpvZFN0cmluZztcbiAgICBjb25zdCBzdHJpbmdTY2hlbWEgPSBuZXcgX1N0cmluZyh7IHR5cGU6IFwic3RyaW5nXCIsIGVycm9yOiBwYXJhbXMuZXJyb3IgfSk7XG4gICAgY29uc3QgYm9vbGVhblNjaGVtYSA9IG5ldyBfQm9vbGVhbih7IHR5cGU6IFwiYm9vbGVhblwiLCBlcnJvcjogcGFyYW1zLmVycm9yIH0pO1xuICAgIGNvbnN0IGNvZGVjID0gbmV3IF9Db2RlYyh7XG4gICAgICAgIHR5cGU6IFwicGlwZVwiLFxuICAgICAgICBpbjogc3RyaW5nU2NoZW1hLFxuICAgICAgICBvdXQ6IGJvb2xlYW5TY2hlbWEsXG4gICAgICAgIHRyYW5zZm9ybTogKChpbnB1dCwgcGF5bG9hZCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBpbnB1dDtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuY2FzZSAhPT0gXCJzZW5zaXRpdmVcIilcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHRydXRoeVNldC5oYXMoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZhbHN5U2V0LmhhcyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBcImludmFsaWRfdmFsdWVcIixcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFwic3RyaW5nYm9vbFwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXM6IFsuLi50cnV0aHlTZXQsIC4uLmZhbHN5U2V0XSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGluc3Q6IGNvZGVjLFxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybTogKChpbnB1dCwgX3BheWxvYWQpID0+IHtcbiAgICAgICAgICAgIGlmIChpbnB1dCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnV0aHlBcnJheVswXSB8fCBcInRydWVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzeUFycmF5WzBdIHx8IFwiZmFsc2VcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGVycm9yOiBwYXJhbXMuZXJyb3IsXG4gICAgfSk7XG4gICAgcmV0dXJuIGNvZGVjO1xufVxuLy8gQF9fTk9fU0lERV9FRkZFQ1RTX19cbmV4cG9ydCBmdW5jdGlvbiBfc3RyaW5nRm9ybWF0KENsYXNzLCBmb3JtYXQsIGZuT3JSZWdleCwgX3BhcmFtcyA9IHt9KSB7XG4gICAgY29uc3QgcGFyYW1zID0gdXRpbC5ub3JtYWxpemVQYXJhbXMoX3BhcmFtcyk7XG4gICAgY29uc3QgZGVmID0ge1xuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhfcGFyYW1zKSxcbiAgICAgICAgY2hlY2s6IFwic3RyaW5nX2Zvcm1hdFwiLFxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBmb3JtYXQsXG4gICAgICAgIGZuOiB0eXBlb2YgZm5PclJlZ2V4ID09PSBcImZ1bmN0aW9uXCIgPyBmbk9yUmVnZXggOiAodmFsKSA9PiBmbk9yUmVnZXgudGVzdCh2YWwpLFxuICAgICAgICAuLi5wYXJhbXMsXG4gICAgfTtcbiAgICBpZiAoZm5PclJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIGRlZi5wYXR0ZXJuID0gZm5PclJlZ2V4O1xuICAgIH1cbiAgICBjb25zdCBpbnN0ID0gbmV3IENsYXNzKGRlZik7XG4gICAgcmV0dXJuIGluc3Q7XG59XG4iLCJpbXBvcnQgeyBnbG9iYWxSZWdpc3RyeSB9IGZyb20gXCIuL3JlZ2lzdHJpZXMuanNcIjtcbi8vIGZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0PFQgZXh0ZW5kcyBzY2hlbWFzLiRab2RUeXBlPihpbnB1dHM6IEpTT05TY2hlbWFHZW5lcmF0b3JQYXJhbXM8VD4pOiBUb0pTT05TY2hlbWFDb250ZXh0PFQ+IHtcbi8vICAgcmV0dXJuIHtcbi8vICAgICBwcm9jZXNzb3I6IGlucHV0cy5wcm9jZXNzb3IsXG4vLyAgICAgbWV0YWRhdGFSZWdpc3RyeTogaW5wdXRzLm1ldGFkYXRhID8/IGdsb2JhbFJlZ2lzdHJ5LFxuLy8gICAgIHRhcmdldDogaW5wdXRzLnRhcmdldCA/PyBcImRyYWZ0LTIwMjAtMTJcIixcbi8vICAgICB1bnJlcHJlc2VudGFibGU6IGlucHV0cy51bnJlcHJlc2VudGFibGUgPz8gXCJ0aHJvd1wiLFxuLy8gICB9O1xuLy8gfVxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVDb250ZXh0KHBhcmFtcykge1xuICAgIC8vIE5vcm1hbGl6ZSB0YXJnZXQ6IGNvbnZlcnQgb2xkIG5vbi1oeXBoZW5hdGVkIHZlcnNpb25zIHRvIGh5cGhlbmF0ZWQgdmVyc2lvbnNcbiAgICBsZXQgdGFyZ2V0ID0gcGFyYW1zPy50YXJnZXQgPz8gXCJkcmFmdC0yMDIwLTEyXCI7XG4gICAgaWYgKHRhcmdldCA9PT0gXCJkcmFmdC00XCIpXG4gICAgICAgIHRhcmdldCA9IFwiZHJhZnQtMDRcIjtcbiAgICBpZiAodGFyZ2V0ID09PSBcImRyYWZ0LTdcIilcbiAgICAgICAgdGFyZ2V0ID0gXCJkcmFmdC0wN1wiO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb2Nlc3NvcnM6IHBhcmFtcy5wcm9jZXNzb3JzID8/IHt9LFxuICAgICAgICBtZXRhZGF0YVJlZ2lzdHJ5OiBwYXJhbXM/Lm1ldGFkYXRhID8/IGdsb2JhbFJlZ2lzdHJ5LFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHVucmVwcmVzZW50YWJsZTogcGFyYW1zPy51bnJlcHJlc2VudGFibGUgPz8gXCJ0aHJvd1wiLFxuICAgICAgICBvdmVycmlkZTogcGFyYW1zPy5vdmVycmlkZSA/PyAoKCkgPT4geyB9KSxcbiAgICAgICAgaW86IHBhcmFtcz8uaW8gPz8gXCJvdXRwdXRcIixcbiAgICAgICAgY291bnRlcjogMCxcbiAgICAgICAgc2VlbjogbmV3IE1hcCgpLFxuICAgICAgICBjeWNsZXM6IHBhcmFtcz8uY3ljbGVzID8/IFwicmVmXCIsXG4gICAgICAgIHJldXNlZDogcGFyYW1zPy5yZXVzZWQgPz8gXCJpbmxpbmVcIixcbiAgICAgICAgZXh0ZXJuYWw6IHBhcmFtcz8uZXh0ZXJuYWwgPz8gdW5kZWZpbmVkLFxuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gcHJvY2VzcyhzY2hlbWEsIGN0eCwgX3BhcmFtcyA9IHsgcGF0aDogW10sIHNjaGVtYVBhdGg6IFtdIH0pIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIC8vIGNoZWNrIGZvciBzY2hlbWEgaW4gc2VlbnNcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgaWYgKHNlZW4pIHtcbiAgICAgICAgc2Vlbi5jb3VudCsrO1xuICAgICAgICAvLyBjaGVjayBpZiBjeWNsZVxuICAgICAgICBjb25zdCBpc0N5Y2xlID0gX3BhcmFtcy5zY2hlbWFQYXRoLmluY2x1ZGVzKHNjaGVtYSk7XG4gICAgICAgIGlmIChpc0N5Y2xlKSB7XG4gICAgICAgICAgICBzZWVuLmN5Y2xlID0gX3BhcmFtcy5wYXRoO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWVuLnNjaGVtYTtcbiAgICB9XG4gICAgLy8gaW5pdGlhbGl6ZVxuICAgIGNvbnN0IHJlc3VsdCA9IHsgc2NoZW1hOiB7fSwgY291bnQ6IDEsIGN5Y2xlOiB1bmRlZmluZWQsIHBhdGg6IF9wYXJhbXMucGF0aCB9O1xuICAgIGN0eC5zZWVuLnNldChzY2hlbWEsIHJlc3VsdCk7XG4gICAgLy8gY3VzdG9tIG1ldGhvZCBvdmVycmlkZXMgZGVmYXVsdCBiZWhhdmlvclxuICAgIGNvbnN0IG92ZXJyaWRlU2NoZW1hID0gc2NoZW1hLl96b2QudG9KU09OU2NoZW1hPy4oKTtcbiAgICBpZiAob3ZlcnJpZGVTY2hlbWEpIHtcbiAgICAgICAgcmVzdWx0LnNjaGVtYSA9IG92ZXJyaWRlU2NoZW1hO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgLi4uX3BhcmFtcyxcbiAgICAgICAgICAgIHNjaGVtYVBhdGg6IFsuLi5fcGFyYW1zLnNjaGVtYVBhdGgsIHNjaGVtYV0sXG4gICAgICAgICAgICBwYXRoOiBfcGFyYW1zLnBhdGgsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChzY2hlbWEuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSkge1xuICAgICAgICAgICAgc2NoZW1hLl96b2QucHJvY2Vzc0pTT05TY2hlbWEoY3R4LCByZXN1bHQuc2NoZW1hLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgX2pzb24gPSByZXN1bHQuc2NoZW1hO1xuICAgICAgICAgICAgY29uc3QgcHJvY2Vzc29yID0gY3R4LnByb2Nlc3NvcnNbZGVmLnR5cGVdO1xuICAgICAgICAgICAgaWYgKCFwcm9jZXNzb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFt0b0pTT05TY2hlbWFdOiBOb24tcmVwcmVzZW50YWJsZSB0eXBlIGVuY291bnRlcmVkOiAke2RlZi50eXBlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvY2Vzc29yKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJlbnQgPSBzY2hlbWEuX3pvZC5wYXJlbnQ7XG4gICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIEFsc28gc2V0IHJlZiBpZiBwcm9jZXNzb3IgZGlkbid0IChmb3IgaW5oZXJpdGFuY2UpXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5yZWYpXG4gICAgICAgICAgICAgICAgcmVzdWx0LnJlZiA9IHBhcmVudDtcbiAgICAgICAgICAgIHByb2Nlc3MocGFyZW50LCBjdHgsIHBhcmFtcyk7XG4gICAgICAgICAgICBjdHguc2Vlbi5nZXQocGFyZW50KS5pc1BhcmVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbWV0YWRhdGFcbiAgICBjb25zdCBtZXRhID0gY3R4Lm1ldGFkYXRhUmVnaXN0cnkuZ2V0KHNjaGVtYSk7XG4gICAgaWYgKG1ldGEpXG4gICAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0LnNjaGVtYSwgbWV0YSk7XG4gICAgaWYgKGN0eC5pbyA9PT0gXCJpbnB1dFwiICYmIGlzVHJhbnNmb3JtaW5nKHNjaGVtYSkpIHtcbiAgICAgICAgLy8gZXhhbXBsZXMvZGVmYXVsdHMgb25seSBhcHBseSB0byBvdXRwdXQgdHlwZSBvZiBwaXBlXG4gICAgICAgIGRlbGV0ZSByZXN1bHQuc2NoZW1hLmV4YW1wbGVzO1xuICAgICAgICBkZWxldGUgcmVzdWx0LnNjaGVtYS5kZWZhdWx0O1xuICAgIH1cbiAgICAvLyBzZXQgcHJlZmF1bHQgYXMgZGVmYXVsdFxuICAgIGlmIChjdHguaW8gPT09IFwiaW5wdXRcIiAmJiBcIl9wcmVmYXVsdFwiIGluIHJlc3VsdC5zY2hlbWEpXG4gICAgICAgIChfYSA9IHJlc3VsdC5zY2hlbWEpLmRlZmF1bHQgPz8gKF9hLmRlZmF1bHQgPSByZXN1bHQuc2NoZW1hLl9wcmVmYXVsdCk7XG4gICAgZGVsZXRlIHJlc3VsdC5zY2hlbWEuX3ByZWZhdWx0O1xuICAgIC8vIHB1bGxpbmcgZnJlc2ggZnJvbSBjdHguc2VlbiBpbiBjYXNlIGl0IHdhcyBvdmVyd3JpdHRlblxuICAgIGNvbnN0IF9yZXN1bHQgPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICByZXR1cm4gX3Jlc3VsdC5zY2hlbWE7XG59XG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdERlZnMoY3R4LCBzY2hlbWFcbi8vIHBhcmFtczogRW1pdFBhcmFtc1xuKSB7XG4gICAgLy8gaXRlcmF0ZSBvdmVyIHNlZW4gbWFwO1xuICAgIGNvbnN0IHJvb3QgPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBpZiAoIXJvb3QpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucHJvY2Vzc2VkIHNjaGVtYS4gVGhpcyBpcyBhIGJ1ZyBpbiBab2QuXCIpO1xuICAgIC8vIFRyYWNrIGlkcyB0byBkZXRlY3QgZHVwbGljYXRlcyBhY3Jvc3MgZGlmZmVyZW50IHNjaGVtYXNcbiAgICBjb25zdCBpZFRvU2NoZW1hID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgY3R4LnNlZW4uZW50cmllcygpKSB7XG4gICAgICAgIGNvbnN0IGlkID0gY3R4Lm1ldGFkYXRhUmVnaXN0cnkuZ2V0KGVudHJ5WzBdKT8uaWQ7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBpZFRvU2NoZW1hLmdldChpZCk7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcgIT09IGVudHJ5WzBdKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgc2NoZW1hIGlkIFwiJHtpZH1cIiBkZXRlY3RlZCBkdXJpbmcgSlNPTiBTY2hlbWEgY29udmVyc2lvbi4gVHdvIGRpZmZlcmVudCBzY2hlbWFzIGNhbm5vdCBzaGFyZSB0aGUgc2FtZSBpZCB3aGVuIGNvbnZlcnRlZCB0b2dldGhlci5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkVG9TY2hlbWEuc2V0KGlkLCBlbnRyeVswXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gcmV0dXJucyBhIHJlZiB0byB0aGUgc2NoZW1hXG4gICAgLy8gZGVmSWQgd2lsbCBiZSBlbXB0eSBpZiB0aGUgcmVmIHBvaW50cyB0byBhbiBleHRlcm5hbCBzY2hlbWEgKG9yICMpXG4gICAgY29uc3QgbWFrZVVSSSA9IChlbnRyeSkgPT4ge1xuICAgICAgICAvLyBjb21wYXJpbmcgdGhlIHNlZW4gb2JqZWN0cyBiZWNhdXNlIHNvbWV0aW1lc1xuICAgICAgICAvLyBtdWx0aXBsZSBzY2hlbWFzIG1hcCB0byB0aGUgc2FtZSBzZWVuIG9iamVjdC5cbiAgICAgICAgLy8gZS5nLiBsYXp5XG4gICAgICAgIC8vIGV4dGVybmFsIGlzIGNvbmZpZ3VyZWRcbiAgICAgICAgY29uc3QgZGVmc1NlZ21lbnQgPSBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIiA/IFwiJGRlZnNcIiA6IFwiZGVmaW5pdGlvbnNcIjtcbiAgICAgICAgaWYgKGN0eC5leHRlcm5hbCkge1xuICAgICAgICAgICAgY29uc3QgZXh0ZXJuYWxJZCA9IGN0eC5leHRlcm5hbC5yZWdpc3RyeS5nZXQoZW50cnlbMF0pPy5pZDsgLy8gPz8gXCJfX3NoYXJlZFwiOy8vIGBfX3NjaGVtYSR7Y3R4LmNvdW50ZXIrK31gO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgc2NoZW1hIGlzIGluIHRoZSBleHRlcm5hbCByZWdpc3RyeVxuICAgICAgICAgICAgY29uc3QgdXJpR2VuZXJhdG9yID0gY3R4LmV4dGVybmFsLnVyaSA/PyAoKGlkKSA9PiBpZCk7XG4gICAgICAgICAgICBpZiAoZXh0ZXJuYWxJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHJlZjogdXJpR2VuZXJhdG9yKGV4dGVybmFsSWQpIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIGFkZCB0byBfX3NoYXJlZFxuICAgICAgICAgICAgY29uc3QgaWQgPSBlbnRyeVsxXS5kZWZJZCA/PyBlbnRyeVsxXS5zY2hlbWEuaWQgPz8gYHNjaGVtYSR7Y3R4LmNvdW50ZXIrK31gO1xuICAgICAgICAgICAgZW50cnlbMV0uZGVmSWQgPSBpZDsgLy8gc2V0IGRlZklkIHNvIGl0IHdpbGwgYmUgcmV1c2VkIGlmIG5lZWRlZFxuICAgICAgICAgICAgcmV0dXJuIHsgZGVmSWQ6IGlkLCByZWY6IGAke3VyaUdlbmVyYXRvcihcIl9fc2hhcmVkXCIpfSMvJHtkZWZzU2VnbWVudH0vJHtpZH1gIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVudHJ5WzFdID09PSByb290KSB7XG4gICAgICAgICAgICByZXR1cm4geyByZWY6IFwiI1wiIH07XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VsZi1jb250YWluZWQgc2NoZW1hXG4gICAgICAgIGNvbnN0IHVyaVByZWZpeCA9IGAjYDtcbiAgICAgICAgY29uc3QgZGVmVXJpUHJlZml4ID0gYCR7dXJpUHJlZml4fS8ke2RlZnNTZWdtZW50fS9gO1xuICAgICAgICBjb25zdCBkZWZJZCA9IGVudHJ5WzFdLnNjaGVtYS5pZCA/PyBgX19zY2hlbWEke2N0eC5jb3VudGVyKyt9YDtcbiAgICAgICAgcmV0dXJuIHsgZGVmSWQsIHJlZjogZGVmVXJpUHJlZml4ICsgZGVmSWQgfTtcbiAgICB9O1xuICAgIC8vIHN0b3JlZCBjYWNoZWQgdmVyc2lvbiBpbiBgZGVmYCBwcm9wZXJ0eVxuICAgIC8vIHJlbW92ZSBhbGwgcHJvcGVydGllcywgc2V0ICRyZWZcbiAgICBjb25zdCBleHRyYWN0VG9EZWYgPSAoZW50cnkpID0+IHtcbiAgICAgICAgLy8gaWYgdGhlIHNjaGVtYSBpcyBhbHJlYWR5IGEgcmVmZXJlbmNlLCBkbyBub3QgZXh0cmFjdCBpdFxuICAgICAgICBpZiAoZW50cnlbMV0uc2NoZW1hLiRyZWYpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWVuID0gZW50cnlbMV07XG4gICAgICAgIGNvbnN0IHsgcmVmLCBkZWZJZCB9ID0gbWFrZVVSSShlbnRyeSk7XG4gICAgICAgIHNlZW4uZGVmID0geyAuLi5zZWVuLnNjaGVtYSB9O1xuICAgICAgICAvLyBkZWZJZCB3b24ndCBiZSBzZXQgaWYgdGhlIHNjaGVtYSBpcyBhIHJlZmVyZW5jZSB0byBhbiBleHRlcm5hbCBzY2hlbWFcbiAgICAgICAgLy8gb3IgaWYgdGhlIHNjaGVtYSBpcyB0aGUgcm9vdCBzY2hlbWFcbiAgICAgICAgaWYgKGRlZklkKVxuICAgICAgICAgICAgc2Vlbi5kZWZJZCA9IGRlZklkO1xuICAgICAgICAvLyB3aXBlIGF3YXkgYWxsIHByb3BlcnRpZXMgZXhjZXB0ICRyZWZcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gc2Vlbi5zY2hlbWE7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYSkge1xuICAgICAgICAgICAgZGVsZXRlIHNjaGVtYVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVtYS4kcmVmID0gcmVmO1xuICAgIH07XG4gICAgLy8gdGhyb3cgb24gY3ljbGVzXG4gICAgLy8gYnJlYWsgY3ljbGVzXG4gICAgaWYgKGN0eC5jeWNsZXMgPT09IFwidGhyb3dcIikge1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGN0eC5zZWVuLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3Qgc2VlbiA9IGVudHJ5WzFdO1xuICAgICAgICAgICAgaWYgKHNlZW4uY3ljbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDeWNsZSBkZXRlY3RlZDogXCIgK1xuICAgICAgICAgICAgICAgICAgICBgIy8ke3NlZW4uY3ljbGU/LmpvaW4oXCIvXCIpfS88cm9vdD5gICtcbiAgICAgICAgICAgICAgICAgICAgJ1xcblxcblNldCB0aGUgYGN5Y2xlc2AgcGFyYW1ldGVyIHRvIGBcInJlZlwiYCB0byByZXNvbHZlIGN5Y2xpY2FsIHNjaGVtYXMgd2l0aCBkZWZzLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGV4dHJhY3Qgc2NoZW1hcyBpbnRvICRkZWZzXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBjdHguc2Vlbi5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3Qgc2VlbiA9IGVudHJ5WzFdO1xuICAgICAgICAvLyBjb252ZXJ0IHJvb3Qgc2NoZW1hIHRvICMgJHJlZlxuICAgICAgICBpZiAoc2NoZW1hID09PSBlbnRyeVswXSkge1xuICAgICAgICAgICAgZXh0cmFjdFRvRGVmKGVudHJ5KTsgLy8gdGhpcyBoYXMgc3BlY2lhbCBoYW5kbGluZyBmb3IgdGhlIHJvb3Qgc2NoZW1hXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBleHRyYWN0IHNjaGVtYXMgdGhhdCBhcmUgaW4gdGhlIGV4dGVybmFsIHJlZ2lzdHJ5XG4gICAgICAgIGlmIChjdHguZXh0ZXJuYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4dCA9IGN0eC5leHRlcm5hbC5yZWdpc3RyeS5nZXQoZW50cnlbMF0pPy5pZDtcbiAgICAgICAgICAgIGlmIChzY2hlbWEgIT09IGVudHJ5WzBdICYmIGV4dCkge1xuICAgICAgICAgICAgICAgIGV4dHJhY3RUb0RlZihlbnRyeSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXh0cmFjdCBzY2hlbWFzIHdpdGggYGlkYCBtZXRhXG4gICAgICAgIGNvbnN0IGlkID0gY3R4Lm1ldGFkYXRhUmVnaXN0cnkuZ2V0KGVudHJ5WzBdKT8uaWQ7XG4gICAgICAgIGlmIChpZCkge1xuICAgICAgICAgICAgZXh0cmFjdFRvRGVmKGVudHJ5KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGJyZWFrIGN5Y2xlc1xuICAgICAgICBpZiAoc2Vlbi5jeWNsZSkge1xuICAgICAgICAgICAgLy8gYW55XG4gICAgICAgICAgICBleHRyYWN0VG9EZWYoZW50cnkpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXh0cmFjdCByZXVzZWQgc2NoZW1hc1xuICAgICAgICBpZiAoc2Vlbi5jb3VudCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChjdHgucmV1c2VkID09PSBcInJlZlwiKSB7XG4gICAgICAgICAgICAgICAgZXh0cmFjdFRvRGVmKGVudHJ5KTtcbiAgICAgICAgICAgICAgICAvLyBiaW9tZS1pZ25vcmUgbGludDpcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBmaW5hbGl6ZShjdHgsIHNjaGVtYSkge1xuICAgIGNvbnN0IHJvb3QgPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBpZiAoIXJvb3QpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucHJvY2Vzc2VkIHNjaGVtYS4gVGhpcyBpcyBhIGJ1ZyBpbiBab2QuXCIpO1xuICAgIC8vIGZsYXR0ZW4gcmVmcyAtIGluaGVyaXQgcHJvcGVydGllcyBmcm9tIHBhcmVudCBzY2hlbWFzXG4gICAgY29uc3QgZmxhdHRlblJlZiA9ICh6b2RTY2hlbWEpID0+IHtcbiAgICAgICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldCh6b2RTY2hlbWEpO1xuICAgICAgICAvLyBhbHJlYWR5IHByb2Nlc3NlZFxuICAgICAgICBpZiAoc2Vlbi5yZWYgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHNjaGVtYSA9IHNlZW4uZGVmID8/IHNlZW4uc2NoZW1hO1xuICAgICAgICBjb25zdCBfY2FjaGVkID0geyAuLi5zY2hlbWEgfTtcbiAgICAgICAgY29uc3QgcmVmID0gc2Vlbi5yZWY7XG4gICAgICAgIHNlZW4ucmVmID0gbnVsbDsgLy8gcHJldmVudCBpbmZpbml0ZSByZWN1cnNpb25cbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgICAgZmxhdHRlblJlZihyZWYpO1xuICAgICAgICAgICAgY29uc3QgcmVmU2VlbiA9IGN0eC5zZWVuLmdldChyZWYpO1xuICAgICAgICAgICAgY29uc3QgcmVmU2NoZW1hID0gcmVmU2Vlbi5zY2hlbWE7XG4gICAgICAgICAgICAvLyBtZXJnZSByZWZlcmVuY2VkIHNjaGVtYSBpbnRvIGN1cnJlbnRcbiAgICAgICAgICAgIGlmIChyZWZTY2hlbWEuJHJlZiAmJiAoY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wN1wiIHx8IGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMDRcIiB8fCBjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gb2xkZXIgZHJhZnRzIGNhbid0IGNvbWJpbmUgJHJlZiB3aXRoIG90aGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBzY2hlbWEuYWxsT2YgPSBzY2hlbWEuYWxsT2YgPz8gW107XG4gICAgICAgICAgICAgICAgc2NoZW1hLmFsbE9mLnB1c2gocmVmU2NoZW1hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oc2NoZW1hLCByZWZTY2hlbWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVzdG9yZSBjaGlsZCdzIG93biBwcm9wZXJ0aWVzIChjaGlsZCB3aW5zKVxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihzY2hlbWEsIF9jYWNoZWQpO1xuICAgICAgICAgICAgY29uc3QgaXNQYXJlbnRSZWYgPSB6b2RTY2hlbWEuX3pvZC5wYXJlbnQgPT09IHJlZjtcbiAgICAgICAgICAgIC8vIEZvciBwYXJlbnQgY2hhaW4sIGNoaWxkIGlzIGEgcmVmaW5lbWVudCAtIHJlbW92ZSBwYXJlbnQtb25seSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBpZiAoaXNQYXJlbnRSZWYpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCIkcmVmXCIgfHwga2V5ID09PSBcImFsbE9mXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoa2V5IGluIF9jYWNoZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NoZW1hW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBXaGVuIHJlZiB3YXMgZXh0cmFjdGVkIHRvICRkZWZzLCByZW1vdmUgcHJvcGVydGllcyB0aGF0IG1hdGNoIHRoZSBkZWZpbml0aW9uXG4gICAgICAgICAgICBpZiAocmVmU2NoZW1hLiRyZWYgJiYgcmVmU2Vlbi5kZWYpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCIkcmVmXCIgfHwga2V5ID09PSBcImFsbE9mXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSBpbiByZWZTZWVuLmRlZiAmJiBKU09OLnN0cmluZ2lmeShzY2hlbWFba2V5XSkgPT09IEpTT04uc3RyaW5naWZ5KHJlZlNlZW4uZGVmW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2NoZW1hW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgcGFyZW50IHdhcyBleHRyYWN0ZWQgKGhhcyAkcmVmKSwgcHJvcGFnYXRlICRyZWYgdG8gdGhpcyBzY2hlbWFcbiAgICAgICAgLy8gVGhpcyBoYW5kbGVzIGNhc2VzIGxpa2U6IHJlYWRvbmx5KCkubWV0YSh7aWR9KS5kZXNjcmliZSgpXG4gICAgICAgIC8vIHdoZXJlIHByb2Nlc3NvciBzZXRzIHJlZiB0byBpbm5lclR5cGUgYnV0IHBhcmVudCBzaG91bGQgYmUgcmVmZXJlbmNlZFxuICAgICAgICBjb25zdCBwYXJlbnQgPSB6b2RTY2hlbWEuX3pvZC5wYXJlbnQ7XG4gICAgICAgIGlmIChwYXJlbnQgJiYgcGFyZW50ICE9PSByZWYpIHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBwYXJlbnQgaXMgcHJvY2Vzc2VkIGZpcnN0IHNvIGl0cyBkZWYgaGFzIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBmbGF0dGVuUmVmKHBhcmVudCk7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTZWVuID0gY3R4LnNlZW4uZ2V0KHBhcmVudCk7XG4gICAgICAgICAgICBpZiAocGFyZW50U2Vlbj8uc2NoZW1hLiRyZWYpIHtcbiAgICAgICAgICAgICAgICBzY2hlbWEuJHJlZiA9IHBhcmVudFNlZW4uc2NoZW1hLiRyZWY7XG4gICAgICAgICAgICAgICAgLy8gRGUtZHVwbGljYXRlIHdpdGggcGFyZW50J3MgZGVmaW5pdGlvblxuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRTZWVuLmRlZikge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiJHJlZlwiIHx8IGtleSA9PT0gXCJhbGxPZlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSBpbiBwYXJlbnRTZWVuLmRlZiAmJiBKU09OLnN0cmluZ2lmeShzY2hlbWFba2V5XSkgPT09IEpTT04uc3RyaW5naWZ5KHBhcmVudFNlZW4uZGVmW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNjaGVtYVtrZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGV4ZWN1dGUgb3ZlcnJpZGVzXG4gICAgICAgIGN0eC5vdmVycmlkZSh7XG4gICAgICAgICAgICB6b2RTY2hlbWE6IHpvZFNjaGVtYSxcbiAgICAgICAgICAgIGpzb25TY2hlbWE6IHNjaGVtYSxcbiAgICAgICAgICAgIHBhdGg6IHNlZW4ucGF0aCA/PyBbXSxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIFsuLi5jdHguc2Vlbi5lbnRyaWVzKCldLnJldmVyc2UoKSkge1xuICAgICAgICBmbGF0dGVuUmVmKGVudHJ5WzBdKTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgaWYgKGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMjAyMC0xMlwiKSB7XG4gICAgICAgIHJlc3VsdC4kc2NoZW1hID0gXCJodHRwczovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC8yMDIwLTEyL3NjaGVtYVwiO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA3XCIpIHtcbiAgICAgICAgcmVzdWx0LiRzY2hlbWEgPSBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDcvc2NoZW1hI1wiO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA0XCIpIHtcbiAgICAgICAgcmVzdWx0LiRzY2hlbWEgPSBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hI1wiO1xuICAgIH1cbiAgICBlbHNlIGlmIChjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCIpIHtcbiAgICAgICAgLy8gT3BlbkFQSSAzLjAgc2NoZW1hIG9iamVjdHMgc2hvdWxkIG5vdCBpbmNsdWRlIGEgJHNjaGVtYSBwcm9wZXJ0eVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQXJiaXRyYXJ5IHN0cmluZyB2YWx1ZXMgYXJlIGFsbG93ZWQgYnV0IHdvbid0IGhhdmUgYSAkc2NoZW1hIHByb3BlcnR5IHNldFxuICAgIH1cbiAgICBpZiAoY3R4LmV4dGVybmFsPy51cmkpIHtcbiAgICAgICAgY29uc3QgaWQgPSBjdHguZXh0ZXJuYWwucmVnaXN0cnkuZ2V0KHNjaGVtYSk/LmlkO1xuICAgICAgICBpZiAoIWlkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NoZW1hIGlzIG1pc3NpbmcgYW4gYGlkYCBwcm9wZXJ0eVwiKTtcbiAgICAgICAgcmVzdWx0LiRpZCA9IGN0eC5leHRlcm5hbC51cmkoaWQpO1xuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKHJlc3VsdCwgcm9vdC5kZWYgPz8gcm9vdC5zY2hlbWEpO1xuICAgIC8vIFRoZSBgaWRgIGluIGAubWV0YSgpYCBpcyBhIFpvZC1zcGVjaWZpYyByZWdpc3RyYXRpb24gdGFnIHVzZWQgdG8gZXh0cmFjdFxuICAgIC8vIHNjaGVtYXMgaW50byAkZGVmcyDigJQgaXQgaXMgbm90IHVzZXItZmFjaW5nIEpTT04gU2NoZW1hIG1ldGFkYXRhLiBTdHJpcCBpdFxuICAgIC8vIGZyb20gdGhlIG91dHB1dCBib2R5IHdoZXJlIGl0IHdvdWxkIG90aGVyd2lzZSBsZWFrLiBUaGUgaWQgaXMgcHJlc2VydmVkXG4gICAgLy8gaW1wbGljaXRseSB2aWEgdGhlICRkZWZzIGtleSAoYW5kIHZpYSAkcmVmIHBhdGhzKS5cbiAgICBjb25zdCByb290TWV0YUlkID0gY3R4Lm1ldGFkYXRhUmVnaXN0cnkuZ2V0KHNjaGVtYSk/LmlkO1xuICAgIGlmIChyb290TWV0YUlkICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0LmlkID09PSByb290TWV0YUlkKVxuICAgICAgICBkZWxldGUgcmVzdWx0LmlkO1xuICAgIC8vIGJ1aWxkIGRlZnMgb2JqZWN0XG4gICAgY29uc3QgZGVmcyA9IGN0eC5leHRlcm5hbD8uZGVmcyA/PyB7fTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGN0eC5zZWVuLmVudHJpZXMoKSkge1xuICAgICAgICBjb25zdCBzZWVuID0gZW50cnlbMV07XG4gICAgICAgIGlmIChzZWVuLmRlZiAmJiBzZWVuLmRlZklkKSB7XG4gICAgICAgICAgICBpZiAoc2Vlbi5kZWYuaWQgPT09IHNlZW4uZGVmSWQpXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNlZW4uZGVmLmlkO1xuICAgICAgICAgICAgZGVmc1tzZWVuLmRlZklkXSA9IHNlZW4uZGVmO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIHNldCBkZWZpbml0aW9ucyBpbiByZXN1bHRcbiAgICBpZiAoY3R4LmV4dGVybmFsKSB7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGVmcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMjAyMC0xMlwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LiRkZWZzID0gZGVmcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5kZWZpbml0aW9ucyA9IGRlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gdGhpcyBcImZpbmFsaXplc1wiIHRoaXMgc2NoZW1hIGFuZCBlbnN1cmVzIGFsbCBjeWNsZXMgYXJlIHJlbW92ZWRcbiAgICAgICAgLy8gZWFjaCBjYWxsIHRvIGZpbmFsaXplKCkgaXMgZnVuY3Rpb25hbGx5IGluZGVwZW5kZW50XG4gICAgICAgIC8vIHRob3VnaCB0aGUgc2VlbiBtYXAgaXMgc2hhcmVkXG4gICAgICAgIGNvbnN0IGZpbmFsaXplZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmaW5hbGl6ZWQsIFwifnN0YW5kYXJkXCIsIHtcbiAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgLi4uc2NoZW1hW1wifnN0YW5kYXJkXCJdLFxuICAgICAgICAgICAgICAgIGpzb25TY2hlbWE6IHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IGNyZWF0ZVN0YW5kYXJkSlNPTlNjaGVtYU1ldGhvZChzY2hlbWEsIFwiaW5wdXRcIiwgY3R4LnByb2Nlc3NvcnMpLFxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IGNyZWF0ZVN0YW5kYXJkSlNPTlNjaGVtYU1ldGhvZChzY2hlbWEsIFwib3V0cHV0XCIsIGN0eC5wcm9jZXNzb3JzKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZpbmFsaXplZDtcbiAgICB9XG4gICAgY2F0Y2ggKF9lcnIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgY29udmVydGluZyBzY2hlbWEgdG8gSlNPTi5cIik7XG4gICAgfVxufVxuZnVuY3Rpb24gaXNUcmFuc2Zvcm1pbmcoX3NjaGVtYSwgX2N0eCkge1xuICAgIGNvbnN0IGN0eCA9IF9jdHggPz8geyBzZWVuOiBuZXcgU2V0KCkgfTtcbiAgICBpZiAoY3R4LnNlZW4uaGFzKF9zY2hlbWEpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgY3R4LnNlZW4uYWRkKF9zY2hlbWEpO1xuICAgIGNvbnN0IGRlZiA9IF9zY2hlbWEuX3pvZC5kZWY7XG4gICAgaWYgKGRlZi50eXBlID09PSBcInRyYW5zZm9ybVwiKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoZGVmLnR5cGUgPT09IFwiYXJyYXlcIilcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5lbGVtZW50LCBjdHgpO1xuICAgIGlmIChkZWYudHlwZSA9PT0gXCJzZXRcIilcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi52YWx1ZVR5cGUsIGN0eCk7XG4gICAgaWYgKGRlZi50eXBlID09PSBcImxhenlcIilcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5nZXR0ZXIoKSwgY3R4KTtcbiAgICBpZiAoZGVmLnR5cGUgPT09IFwicHJvbWlzZVwiIHx8XG4gICAgICAgIGRlZi50eXBlID09PSBcIm9wdGlvbmFsXCIgfHxcbiAgICAgICAgZGVmLnR5cGUgPT09IFwibm9ub3B0aW9uYWxcIiB8fFxuICAgICAgICBkZWYudHlwZSA9PT0gXCJudWxsYWJsZVwiIHx8XG4gICAgICAgIGRlZi50eXBlID09PSBcInJlYWRvbmx5XCIgfHxcbiAgICAgICAgZGVmLnR5cGUgPT09IFwiZGVmYXVsdFwiIHx8XG4gICAgICAgIGRlZi50eXBlID09PSBcInByZWZhdWx0XCIpIHtcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5pbm5lclR5cGUsIGN0eCk7XG4gICAgfVxuICAgIGlmIChkZWYudHlwZSA9PT0gXCJpbnRlcnNlY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXNUcmFuc2Zvcm1pbmcoZGVmLmxlZnQsIGN0eCkgfHwgaXNUcmFuc2Zvcm1pbmcoZGVmLnJpZ2h0LCBjdHgpO1xuICAgIH1cbiAgICBpZiAoZGVmLnR5cGUgPT09IFwicmVjb3JkXCIgfHwgZGVmLnR5cGUgPT09IFwibWFwXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5rZXlUeXBlLCBjdHgpIHx8IGlzVHJhbnNmb3JtaW5nKGRlZi52YWx1ZVR5cGUsIGN0eCk7XG4gICAgfVxuICAgIGlmIChkZWYudHlwZSA9PT0gXCJwaXBlXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzVHJhbnNmb3JtaW5nKGRlZi5pbiwgY3R4KSB8fCBpc1RyYW5zZm9ybWluZyhkZWYub3V0LCBjdHgpO1xuICAgIH1cbiAgICBpZiAoZGVmLnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZGVmLnNoYXBlKSB7XG4gICAgICAgICAgICBpZiAoaXNUcmFuc2Zvcm1pbmcoZGVmLnNoYXBlW2tleV0sIGN0eCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoZGVmLnR5cGUgPT09IFwidW5pb25cIikge1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBkZWYub3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKGlzVHJhbnNmb3JtaW5nKG9wdGlvbiwgY3R4KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChkZWYudHlwZSA9PT0gXCJ0dXBsZVwiKSB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBkZWYuaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChpc1RyYW5zZm9ybWluZyhpdGVtLCBjdHgpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYucmVzdCAmJiBpc1RyYW5zZm9ybWluZyhkZWYucmVzdCwgY3R4KSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHRvSlNPTlNjaGVtYSBtZXRob2QgZm9yIGEgc2NoZW1hIGluc3RhbmNlLlxuICogVGhpcyBlbmNhcHN1bGF0ZXMgdGhlIGxvZ2ljIG9mIGluaXRpYWxpemluZyBjb250ZXh0LCBwcm9jZXNzaW5nLCBleHRyYWN0aW5nIGRlZnMsIGFuZCBmaW5hbGl6aW5nLlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlVG9KU09OU2NoZW1hTWV0aG9kID0gKHNjaGVtYSwgcHJvY2Vzc29ycyA9IHt9KSA9PiAocGFyYW1zKSA9PiB7XG4gICAgY29uc3QgY3R4ID0gaW5pdGlhbGl6ZUNvbnRleHQoeyAuLi5wYXJhbXMsIHByb2Nlc3NvcnMgfSk7XG4gICAgcHJvY2VzcyhzY2hlbWEsIGN0eCk7XG4gICAgZXh0cmFjdERlZnMoY3R4LCBzY2hlbWEpO1xuICAgIHJldHVybiBmaW5hbGl6ZShjdHgsIHNjaGVtYSk7XG59O1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVN0YW5kYXJkSlNPTlNjaGVtYU1ldGhvZCA9IChzY2hlbWEsIGlvLCBwcm9jZXNzb3JzID0ge30pID0+IChwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7IGxpYnJhcnlPcHRpb25zLCB0YXJnZXQgfSA9IHBhcmFtcyA/PyB7fTtcbiAgICBjb25zdCBjdHggPSBpbml0aWFsaXplQ29udGV4dCh7IC4uLihsaWJyYXJ5T3B0aW9ucyA/PyB7fSksIHRhcmdldCwgaW8sIHByb2Nlc3NvcnMgfSk7XG4gICAgcHJvY2VzcyhzY2hlbWEsIGN0eCk7XG4gICAgZXh0cmFjdERlZnMoY3R4LCBzY2hlbWEpO1xuICAgIHJldHVybiBmaW5hbGl6ZShjdHgsIHNjaGVtYSk7XG59O1xuIiwiaW1wb3J0IHsgZXh0cmFjdERlZnMsIGZpbmFsaXplLCBpbml0aWFsaXplQ29udGV4dCwgcHJvY2VzcywgfSBmcm9tIFwiLi90by1qc29uLXNjaGVtYS5qc1wiO1xuaW1wb3J0IHsgZ2V0RW51bVZhbHVlcyB9IGZyb20gXCIuL3V0aWwuanNcIjtcbmNvbnN0IGZvcm1hdE1hcCA9IHtcbiAgICBndWlkOiBcInV1aWRcIixcbiAgICB1cmw6IFwidXJpXCIsXG4gICAgZGF0ZXRpbWU6IFwiZGF0ZS10aW1lXCIsXG4gICAganNvbl9zdHJpbmc6IFwianNvbi1zdHJpbmdcIixcbiAgICByZWdleDogXCJcIiwgLy8gZG8gbm90IHNldFxufTtcbi8vID09PT09PT09PT09PT09PT09PT09IFNJTVBMRSBUWVBFIFBST0NFU1NPUlMgPT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBjb25zdCBzdHJpbmdQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QganNvbiA9IF9qc29uO1xuICAgIGpzb24udHlwZSA9IFwic3RyaW5nXCI7XG4gICAgY29uc3QgeyBtaW5pbXVtLCBtYXhpbXVtLCBmb3JtYXQsIHBhdHRlcm5zLCBjb250ZW50RW5jb2RpbmcgfSA9IHNjaGVtYS5fem9kXG4gICAgICAgIC5iYWc7XG4gICAgaWYgKHR5cGVvZiBtaW5pbXVtID09PSBcIm51bWJlclwiKVxuICAgICAgICBqc29uLm1pbkxlbmd0aCA9IG1pbmltdW07XG4gICAgaWYgKHR5cGVvZiBtYXhpbXVtID09PSBcIm51bWJlclwiKVxuICAgICAgICBqc29uLm1heExlbmd0aCA9IG1heGltdW07XG4gICAgLy8gY3VzdG9tIHBhdHRlcm4gb3ZlcnJpZGVzIGZvcm1hdFxuICAgIGlmIChmb3JtYXQpIHtcbiAgICAgICAganNvbi5mb3JtYXQgPSBmb3JtYXRNYXBbZm9ybWF0XSA/PyBmb3JtYXQ7XG4gICAgICAgIGlmIChqc29uLmZvcm1hdCA9PT0gXCJcIilcbiAgICAgICAgICAgIGRlbGV0ZSBqc29uLmZvcm1hdDsgLy8gZW1wdHkgZm9ybWF0IGlzIG5vdCB2YWxpZFxuICAgICAgICAvLyBKU09OIFNjaGVtYSBmb3JtYXQ6IFwidGltZVwiIHJlcXVpcmVzIGEgZnVsbCB0aW1lIHdpdGggb2Zmc2V0IG9yIFpcbiAgICAgICAgLy8gei5pc28udGltZSgpIGRvZXMgbm90IGluY2x1ZGUgdGltZXpvbmUgaW5mb3JtYXRpb24sIHNvIGZvcm1hdDogXCJ0aW1lXCIgc2hvdWxkIG5ldmVyIGJlIHVzZWRcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJ0aW1lXCIpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBqc29uLmZvcm1hdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29udGVudEVuY29kaW5nKVxuICAgICAgICBqc29uLmNvbnRlbnRFbmNvZGluZyA9IGNvbnRlbnRFbmNvZGluZztcbiAgICBpZiAocGF0dGVybnMgJiYgcGF0dGVybnMuc2l6ZSA+IDApIHtcbiAgICAgICAgY29uc3QgcmVnZXhlcyA9IFsuLi5wYXR0ZXJuc107XG4gICAgICAgIGlmIChyZWdleGVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgIGpzb24ucGF0dGVybiA9IHJlZ2V4ZXNbMF0uc291cmNlO1xuICAgICAgICBlbHNlIGlmIChyZWdleGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGpzb24uYWxsT2YgPSBbXG4gICAgICAgICAgICAgICAgLi4ucmVnZXhlcy5tYXAoKHJlZ2V4KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAuLi4oY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wN1wiIHx8IGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMDRcIiB8fCBjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8geyB0eXBlOiBcInN0cmluZ1wiIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIDoge30pLFxuICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiByZWdleC5zb3VyY2UsXG4gICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5leHBvcnQgY29uc3QgbnVtYmVyUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGNvbnN0IGpzb24gPSBfanNvbjtcbiAgICBjb25zdCB7IG1pbmltdW0sIG1heGltdW0sIGZvcm1hdCwgbXVsdGlwbGVPZiwgZXhjbHVzaXZlTWF4aW11bSwgZXhjbHVzaXZlTWluaW11bSB9ID0gc2NoZW1hLl96b2QuYmFnO1xuICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSBcInN0cmluZ1wiICYmIGZvcm1hdC5pbmNsdWRlcyhcImludFwiKSlcbiAgICAgICAganNvbi50eXBlID0gXCJpbnRlZ2VyXCI7XG4gICAgZWxzZVxuICAgICAgICBqc29uLnR5cGUgPSBcIm51bWJlclwiO1xuICAgIC8vIHdoZW4gYm90aCBtaW5pbXVtIGFuZCBleGNsdXNpdmVNaW5pbXVtIGV4aXN0LCBwaWNrIHRoZSBtb3JlIHJlc3RyaWN0aXZlIG9uZVxuICAgIGNvbnN0IGV4TWluID0gdHlwZW9mIGV4Y2x1c2l2ZU1pbmltdW0gPT09IFwibnVtYmVyXCIgJiYgZXhjbHVzaXZlTWluaW11bSA+PSAobWluaW11bSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpO1xuICAgIGNvbnN0IGV4TWF4ID0gdHlwZW9mIGV4Y2x1c2l2ZU1heGltdW0gPT09IFwibnVtYmVyXCIgJiYgZXhjbHVzaXZlTWF4aW11bSA8PSAobWF4aW11bSA/PyBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpO1xuICAgIGNvbnN0IGxlZ2FjeSA9IGN0eC50YXJnZXQgPT09IFwiZHJhZnQtMDRcIiB8fCBjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCI7XG4gICAgaWYgKGV4TWluKSB7XG4gICAgICAgIGlmIChsZWdhY3kpIHtcbiAgICAgICAgICAgIGpzb24ubWluaW11bSA9IGV4Y2x1c2l2ZU1pbmltdW07XG4gICAgICAgICAgICBqc29uLmV4Y2x1c2l2ZU1pbmltdW0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAganNvbi5leGNsdXNpdmVNaW5pbXVtID0gZXhjbHVzaXZlTWluaW11bTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbWluaW11bSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBqc29uLm1pbmltdW0gPSBtaW5pbXVtO1xuICAgIH1cbiAgICBpZiAoZXhNYXgpIHtcbiAgICAgICAgaWYgKGxlZ2FjeSkge1xuICAgICAgICAgICAganNvbi5tYXhpbXVtID0gZXhjbHVzaXZlTWF4aW11bTtcbiAgICAgICAgICAgIGpzb24uZXhjbHVzaXZlTWF4aW11bSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqc29uLmV4Y2x1c2l2ZU1heGltdW0gPSBleGNsdXNpdmVNYXhpbXVtO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtYXhpbXVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGpzb24ubWF4aW11bSA9IG1heGltdW07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbXVsdGlwbGVPZiA9PT0gXCJudW1iZXJcIilcbiAgICAgICAganNvbi5tdWx0aXBsZU9mID0gbXVsdGlwbGVPZjtcbn07XG5leHBvcnQgY29uc3QgYm9vbGVhblByb2Nlc3NvciA9IChfc2NoZW1hLCBfY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAganNvbi50eXBlID0gXCJib29sZWFuXCI7XG59O1xuZXhwb3J0IGNvbnN0IGJpZ2ludFByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCaWdJbnQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3Qgc3ltYm9sUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN5bWJvbHMgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgbnVsbFByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiKSB7XG4gICAgICAgIGpzb24udHlwZSA9IFwic3RyaW5nXCI7XG4gICAgICAgIGpzb24ubnVsbGFibGUgPSB0cnVlO1xuICAgICAgICBqc29uLmVudW0gPSBbbnVsbF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBqc29uLnR5cGUgPSBcIm51bGxcIjtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHVuZGVmaW5lZFByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmRlZmluZWQgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3Qgdm9pZFByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJWb2lkIGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IG5ldmVyUHJvY2Vzc29yID0gKF9zY2hlbWEsIF9jdHgsIGpzb24sIF9wYXJhbXMpID0+IHtcbiAgICBqc29uLm5vdCA9IHt9O1xufTtcbmV4cG9ydCBjb25zdCBhbnlQcm9jZXNzb3IgPSAoX3NjaGVtYSwgX2N0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICAvLyBlbXB0eSBzY2hlbWEgYWNjZXB0cyBhbnl0aGluZ1xufTtcbmV4cG9ydCBjb25zdCB1bmtub3duUHJvY2Vzc29yID0gKF9zY2hlbWEsIF9jdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgLy8gZW1wdHkgc2NoZW1hIGFjY2VwdHMgYW55dGhpbmdcbn07XG5leHBvcnQgY29uc3QgZGF0ZVByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRlIGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IGVudW1Qcm9jZXNzb3IgPSAoc2NoZW1hLCBfY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IHZhbHVlcyA9IGdldEVudW1WYWx1ZXMoZGVmLmVudHJpZXMpO1xuICAgIC8vIE51bWJlciBlbnVtcyBjYW4gaGF2ZSBib3RoIHN0cmluZyBhbmQgbnVtYmVyIHZhbHVlc1xuICAgIGlmICh2YWx1ZXMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiKSlcbiAgICAgICAganNvbi50eXBlID0gXCJudW1iZXJcIjtcbiAgICBpZiAodmFsdWVzLmV2ZXJ5KCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIikpXG4gICAgICAgIGpzb24udHlwZSA9IFwic3RyaW5nXCI7XG4gICAganNvbi5lbnVtID0gdmFsdWVzO1xufTtcbmV4cG9ydCBjb25zdCBsaXRlcmFsUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IHZhbHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHZhbCBvZiBkZWYudmFsdWVzKSB7XG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxpdGVyYWwgYHVuZGVmaW5lZGAgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90IGFkZCB0byB2YWxzXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gXCJiaWdpbnRcIikge1xuICAgICAgICAgICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJpZ0ludCBsaXRlcmFscyBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWxzLnB1c2goTnVtYmVyKHZhbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFscy5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcgKGFuIHVuZGVmaW5lZCBsaXRlcmFsIHdhcyBzdHJpcHBlZClcbiAgICB9XG4gICAgZWxzZSBpZiAodmFscy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3QgdmFsID0gdmFsc1swXTtcbiAgICAgICAganNvbi50eXBlID0gdmFsID09PSBudWxsID8gXCJudWxsXCIgOiB0eXBlb2YgdmFsO1xuICAgICAgICBpZiAoY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0wNFwiIHx8IGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIikge1xuICAgICAgICAgICAganNvbi5lbnVtID0gW3ZhbF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBqc29uLmNvbnN0ID0gdmFsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodmFscy5ldmVyeSgodikgPT4gdHlwZW9mIHYgPT09IFwibnVtYmVyXCIpKVxuICAgICAgICAgICAganNvbi50eXBlID0gXCJudW1iZXJcIjtcbiAgICAgICAgaWYgKHZhbHMuZXZlcnkoKHYpID0+IHR5cGVvZiB2ID09PSBcInN0cmluZ1wiKSlcbiAgICAgICAgICAgIGpzb24udHlwZSA9IFwic3RyaW5nXCI7XG4gICAgICAgIGlmICh2YWxzLmV2ZXJ5KCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJib29sZWFuXCIpKVxuICAgICAgICAgICAganNvbi50eXBlID0gXCJib29sZWFuXCI7XG4gICAgICAgIGlmICh2YWxzLmV2ZXJ5KCh2KSA9PiB2ID09PSBudWxsKSlcbiAgICAgICAgICAgIGpzb24udHlwZSA9IFwibnVsbFwiO1xuICAgICAgICBqc29uLmVudW0gPSB2YWxzO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgbmFuUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5hTiBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCB0ZW1wbGF0ZUxpdGVyYWxQcm9jZXNzb3IgPSAoc2NoZW1hLCBfY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgX2pzb24gPSBqc29uO1xuICAgIGNvbnN0IHBhdHRlcm4gPSBzY2hlbWEuX3pvZC5wYXR0ZXJuO1xuICAgIGlmICghcGF0dGVybilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGF0dGVybiBub3QgZm91bmQgaW4gdGVtcGxhdGUgbGl0ZXJhbFwiKTtcbiAgICBfanNvbi50eXBlID0gXCJzdHJpbmdcIjtcbiAgICBfanNvbi5wYXR0ZXJuID0gcGF0dGVybi5zb3VyY2U7XG59O1xuZXhwb3J0IGNvbnN0IGZpbGVQcm9jZXNzb3IgPSAoc2NoZW1hLCBfY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgX2pzb24gPSBqc29uO1xuICAgIGNvbnN0IGZpbGUgPSB7XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgIGZvcm1hdDogXCJiaW5hcnlcIixcbiAgICAgICAgY29udGVudEVuY29kaW5nOiBcImJpbmFyeVwiLFxuICAgIH07XG4gICAgY29uc3QgeyBtaW5pbXVtLCBtYXhpbXVtLCBtaW1lIH0gPSBzY2hlbWEuX3pvZC5iYWc7XG4gICAgaWYgKG1pbmltdW0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgZmlsZS5taW5MZW5ndGggPSBtaW5pbXVtO1xuICAgIGlmIChtYXhpbXVtICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGZpbGUubWF4TGVuZ3RoID0gbWF4aW11bTtcbiAgICBpZiAobWltZSkge1xuICAgICAgICBpZiAobWltZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGZpbGUuY29udGVudE1lZGlhVHlwZSA9IG1pbWVbMF07XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKF9qc29uLCBmaWxlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oX2pzb24sIGZpbGUpOyAvLyBzaGFyZWQgcHJvcHMgYXQgcm9vdFxuICAgICAgICAgICAgX2pzb24uYW55T2YgPSBtaW1lLm1hcCgobSkgPT4gKHsgY29udGVudE1lZGlhVHlwZTogbSB9KSk7IC8vIG9ubHkgY29udGVudE1lZGlhVHlwZSBkaWZmZXJzXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oX2pzb24sIGZpbGUpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3Qgc3VjY2Vzc1Byb2Nlc3NvciA9IChfc2NoZW1hLCBfY3R4LCBqc29uLCBfcGFyYW1zKSA9PiB7XG4gICAganNvbi50eXBlID0gXCJib29sZWFuXCI7XG59O1xuZXhwb3J0IGNvbnN0IGN1c3RvbVByb2Nlc3NvciA9IChfc2NoZW1hLCBjdHgsIF9qc29uLCBfcGFyYW1zKSA9PiB7XG4gICAgaWYgKGN0eC51bnJlcHJlc2VudGFibGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDdXN0b20gdHlwZXMgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgZnVuY3Rpb25Qcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRnVuY3Rpb24gdHlwZXMgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgdHJhbnNmb3JtUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRyYW5zZm9ybXMgY2Fubm90IGJlIHJlcHJlc2VudGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgbWFwUHJvY2Vzc29yID0gKF9zY2hlbWEsIGN0eCwgX2pzb24sIF9wYXJhbXMpID0+IHtcbiAgICBpZiAoY3R4LnVucmVwcmVzZW50YWJsZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1hcCBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgaW4gSlNPTiBTY2hlbWFcIik7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBzZXRQcm9jZXNzb3IgPSAoX3NjaGVtYSwgY3R4LCBfanNvbiwgX3BhcmFtcykgPT4ge1xuICAgIGlmIChjdHgudW5yZXByZXNlbnRhYmxlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2V0IGNhbm5vdCBiZSByZXByZXNlbnRlZCBpbiBKU09OIFNjaGVtYVwiKTtcbiAgICB9XG59O1xuLy8gPT09PT09PT09PT09PT09PT09PT0gQ09NUE9TSVRFIFRZUEUgUFJPQ0VTU09SUyA9PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IGFycmF5UHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QganNvbiA9IF9qc29uO1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBjb25zdCB7IG1pbmltdW0sIG1heGltdW0gfSA9IHNjaGVtYS5fem9kLmJhZztcbiAgICBpZiAodHlwZW9mIG1pbmltdW0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgIGpzb24ubWluSXRlbXMgPSBtaW5pbXVtO1xuICAgIGlmICh0eXBlb2YgbWF4aW11bSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAganNvbi5tYXhJdGVtcyA9IG1heGltdW07XG4gICAganNvbi50eXBlID0gXCJhcnJheVwiO1xuICAgIGpzb24uaXRlbXMgPSBwcm9jZXNzKGRlZi5lbGVtZW50LCBjdHgsIHtcbiAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwiaXRlbXNcIl0sXG4gICAgfSk7XG59O1xuZXhwb3J0IGNvbnN0IG9iamVjdFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGpzb24gPSBfanNvbjtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAganNvbi50eXBlID0gXCJvYmplY3RcIjtcbiAgICBqc29uLnByb3BlcnRpZXMgPSB7fTtcbiAgICBjb25zdCBzaGFwZSA9IGRlZi5zaGFwZTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzaGFwZSkge1xuICAgICAgICBqc29uLnByb3BlcnRpZXNba2V5XSA9IHByb2Nlc3Moc2hhcGVba2V5XSwgY3R4LCB7XG4gICAgICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwicHJvcGVydGllc1wiLCBrZXldLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gcmVxdWlyZWQga2V5c1xuICAgIGNvbnN0IGFsbEtleXMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHNoYXBlKSk7XG4gICAgY29uc3QgcmVxdWlyZWRLZXlzID0gbmV3IFNldChbLi4uYWxsS2V5c10uZmlsdGVyKChrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdiA9IGRlZi5zaGFwZVtrZXldLl96b2Q7XG4gICAgICAgIGlmIChjdHguaW8gPT09IFwiaW5wdXRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHYub3B0aW4gPT09IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2Lm9wdG91dCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSkpO1xuICAgIGlmIChyZXF1aXJlZEtleXMuc2l6ZSA+IDApIHtcbiAgICAgICAganNvbi5yZXF1aXJlZCA9IEFycmF5LmZyb20ocmVxdWlyZWRLZXlzKTtcbiAgICB9XG4gICAgLy8gY2F0Y2hhbGxcbiAgICBpZiAoZGVmLmNhdGNoYWxsPy5fem9kLmRlZi50eXBlID09PSBcIm5ldmVyXCIpIHtcbiAgICAgICAgLy8gc3RyaWN0XG4gICAgICAgIGpzb24uYWRkaXRpb25hbFByb3BlcnRpZXMgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIWRlZi5jYXRjaGFsbCkge1xuICAgICAgICAvLyByZWd1bGFyXG4gICAgICAgIGlmIChjdHguaW8gPT09IFwib3V0cHV0XCIpXG4gICAgICAgICAgICBqc29uLmFkZGl0aW9uYWxQcm9wZXJ0aWVzID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKGRlZi5jYXRjaGFsbCkge1xuICAgICAgICBqc29uLmFkZGl0aW9uYWxQcm9wZXJ0aWVzID0gcHJvY2VzcyhkZWYuY2F0Y2hhbGwsIGN0eCwge1xuICAgICAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCJdLFxuICAgICAgICB9KTtcbiAgICB9XG59O1xuZXhwb3J0IGNvbnN0IHVuaW9uUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgLy8gRXhjbHVzaXZlIHVuaW9ucyAoaW5jbHVzaXZlID09PSBmYWxzZSkgdXNlIG9uZU9mIChleGFjdGx5IG9uZSBtYXRjaCkgaW5zdGVhZCBvZiBhbnlPZiAob25lIG9yIG1vcmUgbWF0Y2hlcylcbiAgICAvLyBUaGlzIGluY2x1ZGVzIGJvdGggei54b3IoKSBhbmQgZGlzY3JpbWluYXRlZCB1bmlvbnNcbiAgICBjb25zdCBpc0V4Y2x1c2l2ZSA9IGRlZi5pbmNsdXNpdmUgPT09IGZhbHNlO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBkZWYub3B0aW9ucy5tYXAoKHgsIGkpID0+IHByb2Nlc3MoeCwgY3R4LCB7XG4gICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBpc0V4Y2x1c2l2ZSA/IFwib25lT2ZcIiA6IFwiYW55T2ZcIiwgaV0sXG4gICAgfSkpO1xuICAgIGlmIChpc0V4Y2x1c2l2ZSkge1xuICAgICAgICBqc29uLm9uZU9mID0gb3B0aW9ucztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGpzb24uYW55T2YgPSBvcHRpb25zO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgY29uc3QgYSA9IHByb2Nlc3MoZGVmLmxlZnQsIGN0eCwge1xuICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgXCJhbGxPZlwiLCAwXSxcbiAgICB9KTtcbiAgICBjb25zdCBiID0gcHJvY2VzcyhkZWYucmlnaHQsIGN0eCwge1xuICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgXCJhbGxPZlwiLCAxXSxcbiAgICB9KTtcbiAgICBjb25zdCBpc1NpbXBsZUludGVyc2VjdGlvbiA9ICh2YWwpID0+IFwiYWxsT2ZcIiBpbiB2YWwgJiYgT2JqZWN0LmtleXModmFsKS5sZW5ndGggPT09IDE7XG4gICAgY29uc3QgYWxsT2YgPSBbXG4gICAgICAgIC4uLihpc1NpbXBsZUludGVyc2VjdGlvbihhKSA/IGEuYWxsT2YgOiBbYV0pLFxuICAgICAgICAuLi4oaXNTaW1wbGVJbnRlcnNlY3Rpb24oYikgPyBiLmFsbE9mIDogW2JdKSxcbiAgICBdO1xuICAgIGpzb24uYWxsT2YgPSBhbGxPZjtcbn07XG5leHBvcnQgY29uc3QgdHVwbGVQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBqc29uID0gX2pzb247XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGpzb24udHlwZSA9IFwiYXJyYXlcIjtcbiAgICBjb25zdCBwcmVmaXhQYXRoID0gY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0yMDIwLTEyXCIgPyBcInByZWZpeEl0ZW1zXCIgOiBcIml0ZW1zXCI7XG4gICAgY29uc3QgcmVzdFBhdGggPSBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIiA/IFwiaXRlbXNcIiA6IGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIiA/IFwiaXRlbXNcIiA6IFwiYWRkaXRpb25hbEl0ZW1zXCI7XG4gICAgY29uc3QgcHJlZml4SXRlbXMgPSBkZWYuaXRlbXMubWFwKCh4LCBpKSA9PiBwcm9jZXNzKHgsIGN0eCwge1xuICAgICAgICAuLi5wYXJhbXMsXG4gICAgICAgIHBhdGg6IFsuLi5wYXJhbXMucGF0aCwgcHJlZml4UGF0aCwgaV0sXG4gICAgfSkpO1xuICAgIGNvbnN0IHJlc3QgPSBkZWYucmVzdFxuICAgICAgICA/IHByb2Nlc3MoZGVmLnJlc3QsIGN0eCwge1xuICAgICAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCByZXN0UGF0aCwgLi4uKGN0eC50YXJnZXQgPT09IFwib3BlbmFwaS0zLjBcIiA/IFtkZWYuaXRlbXMubGVuZ3RoXSA6IFtdKV0sXG4gICAgICAgIH0pXG4gICAgICAgIDogbnVsbDtcbiAgICBpZiAoY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0yMDIwLTEyXCIpIHtcbiAgICAgICAganNvbi5wcmVmaXhJdGVtcyA9IHByZWZpeEl0ZW1zO1xuICAgICAgICBpZiAocmVzdCkge1xuICAgICAgICAgICAganNvbi5pdGVtcyA9IHJlc3Q7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoY3R4LnRhcmdldCA9PT0gXCJvcGVuYXBpLTMuMFwiKSB7XG4gICAgICAgIGpzb24uaXRlbXMgPSB7XG4gICAgICAgICAgICBhbnlPZjogcHJlZml4SXRlbXMsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChyZXN0KSB7XG4gICAgICAgICAgICBqc29uLml0ZW1zLmFueU9mLnB1c2gocmVzdCk7XG4gICAgICAgIH1cbiAgICAgICAganNvbi5taW5JdGVtcyA9IHByZWZpeEl0ZW1zLmxlbmd0aDtcbiAgICAgICAgaWYgKCFyZXN0KSB7XG4gICAgICAgICAgICBqc29uLm1heEl0ZW1zID0gcHJlZml4SXRlbXMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBqc29uLml0ZW1zID0gcHJlZml4SXRlbXM7XG4gICAgICAgIGlmIChyZXN0KSB7XG4gICAgICAgICAgICBqc29uLmFkZGl0aW9uYWxJdGVtcyA9IHJlc3Q7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbGVuZ3RoXG4gICAgY29uc3QgeyBtaW5pbXVtLCBtYXhpbXVtIH0gPSBzY2hlbWEuX3pvZC5iYWc7XG4gICAgaWYgKHR5cGVvZiBtaW5pbXVtID09PSBcIm51bWJlclwiKVxuICAgICAgICBqc29uLm1pbkl0ZW1zID0gbWluaW11bTtcbiAgICBpZiAodHlwZW9mIG1heGltdW0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgIGpzb24ubWF4SXRlbXMgPSBtYXhpbXVtO1xufTtcbmV4cG9ydCBjb25zdCByZWNvcmRQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBqc29uID0gX2pzb247XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGpzb24udHlwZSA9IFwib2JqZWN0XCI7XG4gICAgLy8gRm9yIGxvb3NlUmVjb3JkIHdpdGggcmVnZXggcGF0dGVybnMsIHVzZSBwYXR0ZXJuUHJvcGVydGllc1xuICAgIC8vIFRoaXMgY29ycmVjdGx5IHJlcHJlc2VudHMgXCJvbmx5IHZhbGlkYXRlIGtleXMgbWF0Y2hpbmcgdGhlIHBhdHRlcm5cIiBzZW1hbnRpY3NcbiAgICAvLyBhbmQgY29tcG9zZXMgd2VsbCB3aXRoIGFsbE9mIChpbnRlcnNlY3Rpb25zKVxuICAgIGNvbnN0IGtleVR5cGUgPSBkZWYua2V5VHlwZTtcbiAgICBjb25zdCBrZXlCYWcgPSBrZXlUeXBlLl96b2QuYmFnO1xuICAgIGNvbnN0IHBhdHRlcm5zID0ga2V5QmFnPy5wYXR0ZXJucztcbiAgICBpZiAoZGVmLm1vZGUgPT09IFwibG9vc2VcIiAmJiBwYXR0ZXJucyAmJiBwYXR0ZXJucy5zaXplID4gMCkge1xuICAgICAgICAvLyBVc2UgcGF0dGVyblByb3BlcnRpZXMgZm9yIGxvb3NlUmVjb3JkIHdpdGggcmVnZXggcGF0dGVybnNcbiAgICAgICAgY29uc3QgdmFsdWVTY2hlbWEgPSBwcm9jZXNzKGRlZi52YWx1ZVR5cGUsIGN0eCwge1xuICAgICAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBcInBhdHRlcm5Qcm9wZXJ0aWVzXCIsIFwiKlwiXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGpzb24ucGF0dGVyblByb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBwYXR0ZXJuIG9mIHBhdHRlcm5zKSB7XG4gICAgICAgICAgICBqc29uLnBhdHRlcm5Qcm9wZXJ0aWVzW3BhdHRlcm4uc291cmNlXSA9IHZhbHVlU2NoZW1hO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBEZWZhdWx0IGJlaGF2aW9yOiB1c2UgcHJvcGVydHlOYW1lcyArIGFkZGl0aW9uYWxQcm9wZXJ0aWVzXG4gICAgICAgIGlmIChjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTA3XCIgfHwgY3R4LnRhcmdldCA9PT0gXCJkcmFmdC0yMDIwLTEyXCIpIHtcbiAgICAgICAgICAgIGpzb24ucHJvcGVydHlOYW1lcyA9IHByb2Nlc3MoZGVmLmtleVR5cGUsIGN0eCwge1xuICAgICAgICAgICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgICAgICAgICBwYXRoOiBbLi4ucGFyYW1zLnBhdGgsIFwicHJvcGVydHlOYW1lc1wiXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGpzb24uYWRkaXRpb25hbFByb3BlcnRpZXMgPSBwcm9jZXNzKGRlZi52YWx1ZVR5cGUsIGN0eCwge1xuICAgICAgICAgICAgLi4ucGFyYW1zLFxuICAgICAgICAgICAgcGF0aDogWy4uLnBhcmFtcy5wYXRoLCBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCJdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQWRkIHJlcXVpcmVkIGZvciBrZXlzIHdpdGggZGlzY3JldGUgdmFsdWVzIChlbnVtLCBsaXRlcmFsLCBldGMuKVxuICAgIGNvbnN0IGtleVZhbHVlcyA9IGtleVR5cGUuX3pvZC52YWx1ZXM7XG4gICAgaWYgKGtleVZhbHVlcykge1xuICAgICAgICBjb25zdCB2YWxpZEtleVZhbHVlcyA9IFsuLi5rZXlWYWx1ZXNdLmZpbHRlcigodikgPT4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHYgPT09IFwibnVtYmVyXCIpO1xuICAgICAgICBpZiAodmFsaWRLZXlWYWx1ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAganNvbi5yZXF1aXJlZCA9IHZhbGlkS2V5VmFsdWVzO1xuICAgICAgICB9XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBudWxsYWJsZVByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwganNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IGlubmVyID0gcHJvY2VzcyhkZWYuaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIGlmIChjdHgudGFyZ2V0ID09PSBcIm9wZW5hcGktMy4wXCIpIHtcbiAgICAgICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xuICAgICAgICBqc29uLm51bGxhYmxlID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGpzb24uYW55T2YgPSBbaW5uZXIsIHsgdHlwZTogXCJudWxsXCIgfV07XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCBub25vcHRpb25hbFByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xufTtcbmV4cG9ydCBjb25zdCBkZWZhdWx0UHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBqc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgcHJvY2VzcyhkZWYuaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gZGVmLmlubmVyVHlwZTtcbiAgICBqc29uLmRlZmF1bHQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRlZi5kZWZhdWx0VmFsdWUpKTtcbn07XG5leHBvcnQgY29uc3QgcHJlZmF1bHRQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xuICAgIGlmIChjdHguaW8gPT09IFwiaW5wdXRcIilcbiAgICAgICAganNvbi5fcHJlZmF1bHQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRlZi5kZWZhdWx0VmFsdWUpKTtcbn07XG5leHBvcnQgY29uc3QgY2F0Y2hQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIGpzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGRlZiA9IHNjaGVtYS5fem9kLmRlZjtcbiAgICBwcm9jZXNzKGRlZi5pbm5lclR5cGUsIGN0eCwgcGFyYW1zKTtcbiAgICBjb25zdCBzZWVuID0gY3R4LnNlZW4uZ2V0KHNjaGVtYSk7XG4gICAgc2Vlbi5yZWYgPSBkZWYuaW5uZXJUeXBlO1xuICAgIGxldCBjYXRjaFZhbHVlO1xuICAgIHRyeSB7XG4gICAgICAgIGNhdGNoVmFsdWUgPSBkZWYuY2F0Y2hWYWx1ZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkR5bmFtaWMgY2F0Y2ggdmFsdWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIEpTT04gU2NoZW1hXCIpO1xuICAgIH1cbiAgICBqc29uLmRlZmF1bHQgPSBjYXRjaFZhbHVlO1xufTtcbmV4cG9ydCBjb25zdCBwaXBlUHJvY2Vzc29yID0gKHNjaGVtYSwgY3R4LCBfanNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIGNvbnN0IGlubmVyVHlwZSA9IGN0eC5pbyA9PT0gXCJpbnB1dFwiID8gKGRlZi5pbi5fem9kLmRlZi50eXBlID09PSBcInRyYW5zZm9ybVwiID8gZGVmLm91dCA6IGRlZi5pbikgOiBkZWYub3V0O1xuICAgIHByb2Nlc3MoaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gaW5uZXJUeXBlO1xufTtcbmV4cG9ydCBjb25zdCByZWFkb25seVByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwganNvbiwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgZGVmID0gc2NoZW1hLl96b2QuZGVmO1xuICAgIHByb2Nlc3MoZGVmLmlubmVyVHlwZSwgY3R4LCBwYXJhbXMpO1xuICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBzZWVuLnJlZiA9IGRlZi5pbm5lclR5cGU7XG4gICAganNvbi5yZWFkT25seSA9IHRydWU7XG59O1xuZXhwb3J0IGNvbnN0IHByb21pc2VQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgcHJvY2VzcyhkZWYuaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gZGVmLmlubmVyVHlwZTtcbn07XG5leHBvcnQgY29uc3Qgb3B0aW9uYWxQcm9jZXNzb3IgPSAoc2NoZW1hLCBjdHgsIF9qc29uLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBkZWYgPSBzY2hlbWEuX3pvZC5kZWY7XG4gICAgcHJvY2VzcyhkZWYuaW5uZXJUeXBlLCBjdHgsIHBhcmFtcyk7XG4gICAgY29uc3Qgc2VlbiA9IGN0eC5zZWVuLmdldChzY2hlbWEpO1xuICAgIHNlZW4ucmVmID0gZGVmLmlubmVyVHlwZTtcbn07XG5leHBvcnQgY29uc3QgbGF6eVByb2Nlc3NvciA9IChzY2hlbWEsIGN0eCwgX2pzb24sIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGlubmVyVHlwZSA9IHNjaGVtYS5fem9kLmlubmVyVHlwZTtcbiAgICBwcm9jZXNzKGlubmVyVHlwZSwgY3R4LCBwYXJhbXMpO1xuICAgIGNvbnN0IHNlZW4gPSBjdHguc2Vlbi5nZXQoc2NoZW1hKTtcbiAgICBzZWVuLnJlZiA9IGlubmVyVHlwZTtcbn07XG4vLyA9PT09PT09PT09PT09PT09PT09PSBBTEwgUFJPQ0VTU09SUyA9PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGNvbnN0IGFsbFByb2Nlc3NvcnMgPSB7XG4gICAgc3RyaW5nOiBzdHJpbmdQcm9jZXNzb3IsXG4gICAgbnVtYmVyOiBudW1iZXJQcm9jZXNzb3IsXG4gICAgYm9vbGVhbjogYm9vbGVhblByb2Nlc3NvcixcbiAgICBiaWdpbnQ6IGJpZ2ludFByb2Nlc3NvcixcbiAgICBzeW1ib2w6IHN5bWJvbFByb2Nlc3NvcixcbiAgICBudWxsOiBudWxsUHJvY2Vzc29yLFxuICAgIHVuZGVmaW5lZDogdW5kZWZpbmVkUHJvY2Vzc29yLFxuICAgIHZvaWQ6IHZvaWRQcm9jZXNzb3IsXG4gICAgbmV2ZXI6IG5ldmVyUHJvY2Vzc29yLFxuICAgIGFueTogYW55UHJvY2Vzc29yLFxuICAgIHVua25vd246IHVua25vd25Qcm9jZXNzb3IsXG4gICAgZGF0ZTogZGF0ZVByb2Nlc3NvcixcbiAgICBlbnVtOiBlbnVtUHJvY2Vzc29yLFxuICAgIGxpdGVyYWw6IGxpdGVyYWxQcm9jZXNzb3IsXG4gICAgbmFuOiBuYW5Qcm9jZXNzb3IsXG4gICAgdGVtcGxhdGVfbGl0ZXJhbDogdGVtcGxhdGVMaXRlcmFsUHJvY2Vzc29yLFxuICAgIGZpbGU6IGZpbGVQcm9jZXNzb3IsXG4gICAgc3VjY2Vzczogc3VjY2Vzc1Byb2Nlc3NvcixcbiAgICBjdXN0b206IGN1c3RvbVByb2Nlc3NvcixcbiAgICBmdW5jdGlvbjogZnVuY3Rpb25Qcm9jZXNzb3IsXG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1Qcm9jZXNzb3IsXG4gICAgbWFwOiBtYXBQcm9jZXNzb3IsXG4gICAgc2V0OiBzZXRQcm9jZXNzb3IsXG4gICAgYXJyYXk6IGFycmF5UHJvY2Vzc29yLFxuICAgIG9iamVjdDogb2JqZWN0UHJvY2Vzc29yLFxuICAgIHVuaW9uOiB1bmlvblByb2Nlc3NvcixcbiAgICBpbnRlcnNlY3Rpb246IGludGVyc2VjdGlvblByb2Nlc3NvcixcbiAgICB0dXBsZTogdHVwbGVQcm9jZXNzb3IsXG4gICAgcmVjb3JkOiByZWNvcmRQcm9jZXNzb3IsXG4gICAgbnVsbGFibGU6IG51bGxhYmxlUHJvY2Vzc29yLFxuICAgIG5vbm9wdGlvbmFsOiBub25vcHRpb25hbFByb2Nlc3NvcixcbiAgICBkZWZhdWx0OiBkZWZhdWx0UHJvY2Vzc29yLFxuICAgIHByZWZhdWx0OiBwcmVmYXVsdFByb2Nlc3NvcixcbiAgICBjYXRjaDogY2F0Y2hQcm9jZXNzb3IsXG4gICAgcGlwZTogcGlwZVByb2Nlc3NvcixcbiAgICByZWFkb25seTogcmVhZG9ubHlQcm9jZXNzb3IsXG4gICAgcHJvbWlzZTogcHJvbWlzZVByb2Nlc3NvcixcbiAgICBvcHRpb25hbDogb3B0aW9uYWxQcm9jZXNzb3IsXG4gICAgbGF6eTogbGF6eVByb2Nlc3Nvcixcbn07XG5leHBvcnQgZnVuY3Rpb24gdG9KU09OU2NoZW1hKGlucHV0LCBwYXJhbXMpIHtcbiAgICBpZiAoXCJfaWRtYXBcIiBpbiBpbnB1dCkge1xuICAgICAgICAvLyBSZWdpc3RyeSBjYXNlXG4gICAgICAgIGNvbnN0IHJlZ2lzdHJ5ID0gaW5wdXQ7XG4gICAgICAgIGNvbnN0IGN0eCA9IGluaXRpYWxpemVDb250ZXh0KHsgLi4ucGFyYW1zLCBwcm9jZXNzb3JzOiBhbGxQcm9jZXNzb3JzIH0pO1xuICAgICAgICBjb25zdCBkZWZzID0ge307XG4gICAgICAgIC8vIEZpcnN0IHBhc3M6IHByb2Nlc3MgYWxsIHNjaGVtYXMgdG8gYnVpbGQgdGhlIHNlZW4gbWFwXG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgcmVnaXN0cnkuX2lkbWFwLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgW18sIHNjaGVtYV0gPSBlbnRyeTtcbiAgICAgICAgICAgIHByb2Nlc3Moc2NoZW1hLCBjdHgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNjaGVtYXMgPSB7fTtcbiAgICAgICAgY29uc3QgZXh0ZXJuYWwgPSB7XG4gICAgICAgICAgICByZWdpc3RyeSxcbiAgICAgICAgICAgIHVyaTogcGFyYW1zPy51cmksXG4gICAgICAgICAgICBkZWZzLFxuICAgICAgICB9O1xuICAgICAgICAvLyBVcGRhdGUgdGhlIGNvbnRleHQgd2l0aCBleHRlcm5hbCBjb25maWd1cmF0aW9uXG4gICAgICAgIGN0eC5leHRlcm5hbCA9IGV4dGVybmFsO1xuICAgICAgICAvLyBTZWNvbmQgcGFzczogZW1pdCBlYWNoIHNjaGVtYVxuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlZ2lzdHJ5Ll9pZG1hcC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtrZXksIHNjaGVtYV0gPSBlbnRyeTtcbiAgICAgICAgICAgIGV4dHJhY3REZWZzKGN0eCwgc2NoZW1hKTtcbiAgICAgICAgICAgIHNjaGVtYXNba2V5XSA9IGZpbmFsaXplKGN0eCwgc2NoZW1hKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGVmcykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgZGVmc1NlZ21lbnQgPSBjdHgudGFyZ2V0ID09PSBcImRyYWZ0LTIwMjAtMTJcIiA/IFwiJGRlZnNcIiA6IFwiZGVmaW5pdGlvbnNcIjtcbiAgICAgICAgICAgIHNjaGVtYXMuX19zaGFyZWQgPSB7XG4gICAgICAgICAgICAgICAgW2RlZnNTZWdtZW50XTogZGVmcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc2NoZW1hcyB9O1xuICAgIH1cbiAgICAvLyBTaW5nbGUgc2NoZW1hIGNhc2VcbiAgICBjb25zdCBjdHggPSBpbml0aWFsaXplQ29udGV4dCh7IC4uLnBhcmFtcywgcHJvY2Vzc29yczogYWxsUHJvY2Vzc29ycyB9KTtcbiAgICBwcm9jZXNzKGlucHV0LCBjdHgpO1xuICAgIGV4dHJhY3REZWZzKGN0eCwgaW5wdXQpO1xuICAgIHJldHVybiBmaW5hbGl6ZShjdHgsIGlucHV0KTtcbn1cbiIsImltcG9ydCAqIGFzIGNvcmUgZnJvbSBcIi4uL2NvcmUvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIHNjaGVtYXMgZnJvbSBcIi4vc2NoZW1hcy5qc1wiO1xuZXhwb3J0IGNvbnN0IFpvZElTT0RhdGVUaW1lID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZElTT0RhdGVUaW1lXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RJU09EYXRlVGltZS5pbml0KGluc3QsIGRlZik7XG4gICAgc2NoZW1hcy5ab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZGF0ZXRpbWUocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2lzb0RhdGVUaW1lKFpvZElTT0RhdGVUaW1lLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZElTT0RhdGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kSVNPRGF0ZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kSVNPRGF0ZS5pbml0KGluc3QsIGRlZik7XG4gICAgc2NoZW1hcy5ab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZGF0ZShwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faXNvRGF0ZShab2RJU09EYXRlLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZElTT1RpbWUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kSVNPVGltZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kSVNPVGltZS5pbml0KGluc3QsIGRlZik7XG4gICAgc2NoZW1hcy5ab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdGltZShwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faXNvVGltZShab2RJU09UaW1lLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZElTT0R1cmF0aW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZElTT0R1cmF0aW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RJU09EdXJhdGlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgc2NoZW1hcy5ab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZHVyYXRpb24ocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2lzb0R1cmF0aW9uKFpvZElTT0R1cmF0aW9uLCBwYXJhbXMpO1xufVxuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0IHsgJFpvZEVycm9yIH0gZnJvbSBcIi4uL2NvcmUvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSBcIi4uL2NvcmUvdXRpbC5qc1wiO1xuY29uc3QgaW5pdGlhbGl6ZXIgPSAoaW5zdCwgaXNzdWVzKSA9PiB7XG4gICAgJFpvZEVycm9yLmluaXQoaW5zdCwgaXNzdWVzKTtcbiAgICBpbnN0Lm5hbWUgPSBcIlpvZEVycm9yXCI7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaW5zdCwge1xuICAgICAgICBmb3JtYXQ6IHtcbiAgICAgICAgICAgIHZhbHVlOiAobWFwcGVyKSA9PiBjb3JlLmZvcm1hdEVycm9yKGluc3QsIG1hcHBlciksXG4gICAgICAgICAgICAvLyBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgZmxhdHRlbjoge1xuICAgICAgICAgICAgdmFsdWU6IChtYXBwZXIpID0+IGNvcmUuZmxhdHRlbkVycm9yKGluc3QsIG1hcHBlciksXG4gICAgICAgICAgICAvLyBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkSXNzdWU6IHtcbiAgICAgICAgICAgIHZhbHVlOiAoaXNzdWUpID0+IHtcbiAgICAgICAgICAgICAgICBpbnN0Lmlzc3Vlcy5wdXNoKGlzc3VlKTtcbiAgICAgICAgICAgICAgICBpbnN0Lm1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShpbnN0Lmlzc3VlcywgdXRpbC5qc29uU3RyaW5naWZ5UmVwbGFjZXIsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBhZGRJc3N1ZXM6IHtcbiAgICAgICAgICAgIHZhbHVlOiAoaXNzdWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaW5zdC5pc3N1ZXMucHVzaCguLi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgIGluc3QubWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGluc3QuaXNzdWVzLCB1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlciwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGlzRW1wdHk6IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdC5pc3N1ZXMubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpbnN0LCBcImlzRW1wdHlcIiwge1xuICAgIC8vICAgZ2V0KCkge1xuICAgIC8vICAgICByZXR1cm4gaW5zdC5pc3N1ZXMubGVuZ3RoID09PSAwO1xuICAgIC8vICAgfSxcbiAgICAvLyB9KTtcbn07XG5leHBvcnQgY29uc3QgWm9kRXJyb3IgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRXJyb3JcIiwgaW5pdGlhbGl6ZXIpO1xuZXhwb3J0IGNvbnN0IFpvZFJlYWxFcnJvciA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFcnJvclwiLCBpbml0aWFsaXplciwge1xuICAgIFBhcmVudDogRXJyb3IsXG59KTtcbi8vIC8qKiBAZGVwcmVjYXRlZCBVc2UgYHouY29yZS4kWm9kRXJyb3JNYXBDdHhgIGluc3RlYWQuICovXG4vLyBleHBvcnQgdHlwZSBFcnJvck1hcEN0eCA9IGNvcmUuJFpvZEVycm9yTWFwQ3R4O1xuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0IHsgWm9kUmVhbEVycm9yIH0gZnJvbSBcIi4vZXJyb3JzLmpzXCI7XG5leHBvcnQgY29uc3QgcGFyc2UgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fcGFyc2UoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBwYXJzZUFzeW5jID0gLyogQF9fUFVSRV9fICovIGNvcmUuX3BhcnNlQXN5bmMoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBzYWZlUGFyc2UgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fc2FmZVBhcnNlKFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3Qgc2FmZVBhcnNlQXN5bmMgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fc2FmZVBhcnNlQXN5bmMoWm9kUmVhbEVycm9yKTtcbi8vIENvZGVjIGZ1bmN0aW9uc1xuZXhwb3J0IGNvbnN0IGVuY29kZSA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9lbmNvZGUoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBkZWNvZGUgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fZGVjb2RlKFpvZFJlYWxFcnJvcik7XG5leHBvcnQgY29uc3QgZW5jb2RlQXN5bmMgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fZW5jb2RlQXN5bmMoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBkZWNvZGVBc3luYyA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9kZWNvZGVBc3luYyhab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHNhZmVFbmNvZGUgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fc2FmZUVuY29kZShab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHNhZmVEZWNvZGUgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fc2FmZURlY29kZShab2RSZWFsRXJyb3IpO1xuZXhwb3J0IGNvbnN0IHNhZmVFbmNvZGVBc3luYyA9IC8qIEBfX1BVUkVfXyAqLyBjb3JlLl9zYWZlRW5jb2RlQXN5bmMoWm9kUmVhbEVycm9yKTtcbmV4cG9ydCBjb25zdCBzYWZlRGVjb2RlQXN5bmMgPSAvKiBAX19QVVJFX18gKi8gY29yZS5fc2FmZURlY29kZUFzeW5jKFpvZFJlYWxFcnJvcik7XG4iLCJpbXBvcnQgKiBhcyBjb3JlIGZyb20gXCIuLi9jb3JlL2luZGV4LmpzXCI7XG5pbXBvcnQgeyB1dGlsIH0gZnJvbSBcIi4uL2NvcmUvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIHByb2Nlc3NvcnMgZnJvbSBcIi4uL2NvcmUvanNvbi1zY2hlbWEtcHJvY2Vzc29ycy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlU3RhbmRhcmRKU09OU2NoZW1hTWV0aG9kLCBjcmVhdGVUb0pTT05TY2hlbWFNZXRob2QgfSBmcm9tIFwiLi4vY29yZS90by1qc29uLXNjaGVtYS5qc1wiO1xuaW1wb3J0ICogYXMgY2hlY2tzIGZyb20gXCIuL2NoZWNrcy5qc1wiO1xuaW1wb3J0ICogYXMgaXNvIGZyb20gXCIuL2lzby5qc1wiO1xuaW1wb3J0ICogYXMgcGFyc2UgZnJvbSBcIi4vcGFyc2UuanNcIjtcbi8vIExhenktYmluZCBidWlsZGVyIG1ldGhvZHMuXG4vL1xuLy8gQnVpbGRlciBtZXRob2RzIChgLm9wdGlvbmFsYCwgYC5hcnJheWAsIGAucmVmaW5lYCwgLi4uKSBsaXZlIGFzXG4vLyBub24tZW51bWVyYWJsZSBnZXR0ZXJzIG9uIGVhY2ggY29uY3JldGUgc2NoZW1hIGNvbnN0cnVjdG9yJ3Ncbi8vIHByb3RvdHlwZS4gT24gZmlyc3QgYWNjZXNzIGZyb20gYW4gaW5zdGFuY2UgdGhlIGdldHRlciBhbGxvY2F0ZXNcbi8vIGBmbi5iaW5kKHRoaXMpYCBhbmQgY2FjaGVzIGl0IGFzIGFuIG93biBwcm9wZXJ0eSBvbiB0aGF0IGluc3RhbmNlLFxuLy8gc28gZGV0YWNoZWQgdXNhZ2UgKGBjb25zdCBtID0gc2NoZW1hLm9wdGlvbmFsOyBtKClgKSBzdGlsbCB3b3Jrc1xuLy8gYW5kIHRoZSBwZXItaW5zdGFuY2UgYWxsb2NhdGlvbiBvbmx5IGhhcHBlbnMgZm9yIG1ldGhvZHMgYWN0dWFsbHlcbi8vIHRvdWNoZWQuXG4vL1xuLy8gT25lIGluc3RhbGwgcGVyIChwcm90b3R5cGUsIGdyb3VwKSwgbWVtb2l6ZWQgYnkgYF9pbnN0YWxsZWRHcm91cHNgLlxuY29uc3QgX2luc3RhbGxlZEdyb3VwcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gX2luc3RhbGxMYXp5TWV0aG9kcyhpbnN0LCBncm91cCwgbWV0aG9kcykge1xuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGluc3QpO1xuICAgIGxldCBpbnN0YWxsZWQgPSBfaW5zdGFsbGVkR3JvdXBzLmdldChwcm90byk7XG4gICAgaWYgKCFpbnN0YWxsZWQpIHtcbiAgICAgICAgaW5zdGFsbGVkID0gbmV3IFNldCgpO1xuICAgICAgICBfaW5zdGFsbGVkR3JvdXBzLnNldChwcm90bywgaW5zdGFsbGVkKTtcbiAgICB9XG4gICAgaWYgKGluc3RhbGxlZC5oYXMoZ3JvdXApKVxuICAgICAgICByZXR1cm47XG4gICAgaW5zdGFsbGVkLmFkZChncm91cCk7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gbWV0aG9kcykge1xuICAgICAgICBjb25zdCBmbiA9IG1ldGhvZHNba2V5XTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kID0gZm4uYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBib3VuZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYm91bmQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0KHYpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IFpvZFR5cGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kVHlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgT2JqZWN0LmFzc2lnbihpbnN0W1wifnN0YW5kYXJkXCJdLCB7XG4gICAgICAgIGpzb25TY2hlbWE6IHtcbiAgICAgICAgICAgIGlucHV0OiBjcmVhdGVTdGFuZGFyZEpTT05TY2hlbWFNZXRob2QoaW5zdCwgXCJpbnB1dFwiKSxcbiAgICAgICAgICAgIG91dHB1dDogY3JlYXRlU3RhbmRhcmRKU09OU2NoZW1hTWV0aG9kKGluc3QsIFwib3V0cHV0XCIpLFxuICAgICAgICB9LFxuICAgIH0pO1xuICAgIGluc3QudG9KU09OU2NoZW1hID0gY3JlYXRlVG9KU09OU2NoZW1hTWV0aG9kKGluc3QsIHt9KTtcbiAgICBpbnN0LmRlZiA9IGRlZjtcbiAgICBpbnN0LnR5cGUgPSBkZWYudHlwZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJfZGVmXCIsIHsgdmFsdWU6IGRlZiB9KTtcbiAgICAvLyBQYXJzZS1mYW1pbHkgaXMgaW50ZW50aW9uYWxseSBrZXB0IGFzIHBlci1pbnN0YW5jZSBjbG9zdXJlczogdGhlc2UgYXJlXG4gICAgLy8gdGhlIGhvdCBwYXRoIEFORCB0aGUgbW9zdC1kZXRhY2hlZCBtZXRob2RzIChgYXJyLm1hcChzY2hlbWEucGFyc2UpYCxcbiAgICAvLyBgY29uc3QgeyBwYXJzZSB9ID0gc2NoZW1hYCwgZXRjLikuIEVhZ2VyIGNsb3N1cmVzIGhlcmUgbWVhbiBjYWxsZXJzIHBheVxuICAgIC8vIH4xMiBjbG9zdXJlIGFsbG9jYXRpb25zIHBlciBzY2hlbWEgYnV0IGdldCBtb25vbW9ycGhpYyBjYWxsIHNpdGVzIGFuZFxuICAgIC8vIGRldGFjaGVkIHVzYWdlIHRoYXQgXCJqdXN0IHdvcmtzXCIuXG4gICAgaW5zdC5wYXJzZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnBhcnNlKGluc3QsIGRhdGEsIHBhcmFtcywgeyBjYWxsZWU6IGluc3QucGFyc2UgfSk7XG4gICAgaW5zdC5zYWZlUGFyc2UgPSAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5zYWZlUGFyc2UoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LnBhcnNlQXN5bmMgPSBhc3luYyAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5wYXJzZUFzeW5jKGluc3QsIGRhdGEsIHBhcmFtcywgeyBjYWxsZWU6IGluc3QucGFyc2VBc3luYyB9KTtcbiAgICBpbnN0LnNhZmVQYXJzZUFzeW5jID0gYXN5bmMgKGRhdGEsIHBhcmFtcykgPT4gcGFyc2Uuc2FmZVBhcnNlQXN5bmMoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LnNwYSA9IGluc3Quc2FmZVBhcnNlQXN5bmM7XG4gICAgaW5zdC5lbmNvZGUgPSAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5lbmNvZGUoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LmRlY29kZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLmRlY29kZShpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3QuZW5jb2RlQXN5bmMgPSBhc3luYyAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5lbmNvZGVBc3luYyhpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3QuZGVjb2RlQXN5bmMgPSBhc3luYyAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5kZWNvZGVBc3luYyhpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIGluc3Quc2FmZUVuY29kZSA9IChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnNhZmVFbmNvZGUoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LnNhZmVEZWNvZGUgPSAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5zYWZlRGVjb2RlKGluc3QsIGRhdGEsIHBhcmFtcyk7XG4gICAgaW5zdC5zYWZlRW5jb2RlQXN5bmMgPSBhc3luYyAoZGF0YSwgcGFyYW1zKSA9PiBwYXJzZS5zYWZlRW5jb2RlQXN5bmMoaW5zdCwgZGF0YSwgcGFyYW1zKTtcbiAgICBpbnN0LnNhZmVEZWNvZGVBc3luYyA9IGFzeW5jIChkYXRhLCBwYXJhbXMpID0+IHBhcnNlLnNhZmVEZWNvZGVBc3luYyhpbnN0LCBkYXRhLCBwYXJhbXMpO1xuICAgIC8vIEFsbCBidWlsZGVyIG1ldGhvZHMgYXJlIHBsYWNlZCBvbiB0aGUgaW50ZXJuYWwgcHJvdG90eXBlIGFzIGxhenktYmluZFxuICAgIC8vIGdldHRlcnMuIE9uIGZpcnN0IGFjY2VzcyBwZXItaW5zdGFuY2UsIGEgYm91bmQgdGh1bmsgaXMgYWxsb2NhdGVkIGFuZFxuICAgIC8vIGNhY2hlZCBhcyBhbiBvd24gcHJvcGVydHk7IHN1YnNlcXVlbnQgYWNjZXNzZXMgc2tpcCB0aGUgZ2V0dGVyLiBUaGlzXG4gICAgLy8gbWVhbnM6IG5vIHBlci1pbnN0YW5jZSBhbGxvY2F0aW9uIGZvciB1bnVzZWQgbWV0aG9kcywgZnVsbFxuICAgIC8vIGRldGFjaGFiaWxpdHkgcHJlc2VydmVkIChgY29uc3QgbSA9IHNjaGVtYS5vcHRpb25hbDsgbSgpYCB3b3JrcyksIGFuZFxuICAgIC8vIHNoYXJlZCB1bmRlcmx5aW5nIGZ1bmN0aW9uIHJlZmVyZW5jZXMgYWNyb3NzIGFsbCBpbnN0YW5jZXMuXG4gICAgX2luc3RhbGxMYXp5TWV0aG9kcyhpbnN0LCBcIlpvZFR5cGVcIiwge1xuICAgICAgICBjaGVjayguLi5jaGtzKSB7XG4gICAgICAgICAgICBjb25zdCBkZWYgPSB0aGlzLmRlZjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKHV0aWwubWVyZ2VEZWZzKGRlZiwge1xuICAgICAgICAgICAgICAgIGNoZWNrczogW1xuICAgICAgICAgICAgICAgICAgICAuLi4oZGVmLmNoZWNrcyA/PyBbXSksXG4gICAgICAgICAgICAgICAgICAgIC4uLmNoa3MubWFwKChjaCkgPT4gdHlwZW9mIGNoID09PSBcImZ1bmN0aW9uXCIgPyB7IF96b2Q6IHsgY2hlY2s6IGNoLCBkZWY6IHsgY2hlY2s6IFwiY3VzdG9tXCIgfSwgb25hdHRhY2g6IFtdIH0gfSA6IGNoKSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSksIHsgcGFyZW50OiB0cnVlIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3aXRoKC4uLmNoa3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKC4uLmNoa3MpO1xuICAgICAgICB9LFxuICAgICAgICBjbG9uZShkZWYsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIGNvcmUuY2xvbmUodGhpcywgZGVmLCBwYXJhbXMpO1xuICAgICAgICB9LFxuICAgICAgICBicmFuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICByZWdpc3RlcihyZWcsIG1ldGEpIHtcbiAgICAgICAgICAgIHJlZy5hZGQodGhpcywgbWV0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgcmVmaW5lKGNoZWNrLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKHJlZmluZShjaGVjaywgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN1cGVyUmVmaW5lKHJlZmluZW1lbnQsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soc3VwZXJSZWZpbmUocmVmaW5lbWVudCwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG92ZXJ3cml0ZShmbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm92ZXJ3cml0ZShmbikpO1xuICAgICAgICB9LFxuICAgICAgICBvcHRpb25hbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25hbCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXhhY3RPcHRpb25hbCgpIHtcbiAgICAgICAgICAgIHJldHVybiBleGFjdE9wdGlvbmFsKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBudWxsYWJsZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsYWJsZSh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgbnVsbGlzaCgpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25hbChudWxsYWJsZSh0aGlzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5vbm9wdGlvbmFsKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIG5vbm9wdGlvbmFsKHRoaXMsIHBhcmFtcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGFycmF5KCkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5KHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBvcihhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmlvbihbdGhpcywgYXJnXSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFuZChhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3Rpb24odGhpcywgYXJnKTtcbiAgICAgICAgfSxcbiAgICAgICAgdHJhbnNmb3JtKHR4KSB7XG4gICAgICAgICAgICByZXR1cm4gcGlwZSh0aGlzLCB0cmFuc2Zvcm0odHgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVmYXVsdChkKSB7XG4gICAgICAgICAgICByZXR1cm4gX2RlZmF1bHQodGhpcywgZCk7XG4gICAgICAgIH0sXG4gICAgICAgIHByZWZhdWx0KGQpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmVmYXVsdCh0aGlzLCBkKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2F0Y2gocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NhdGNoKHRoaXMsIHBhcmFtcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHBpcGUodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gcGlwZSh0aGlzLCB0YXJnZXQpO1xuICAgICAgICB9LFxuICAgICAgICByZWFkb25seSgpIHtcbiAgICAgICAgICAgIHJldHVybiByZWFkb25seSh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVzY3JpYmUoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGNsID0gdGhpcy5jbG9uZSgpO1xuICAgICAgICAgICAgY29yZS5nbG9iYWxSZWdpc3RyeS5hZGQoY2wsIHsgZGVzY3JpcHRpb24gfSk7XG4gICAgICAgICAgICByZXR1cm4gY2w7XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGEoLi4uYXJncykge1xuICAgICAgICAgICAgLy8gb3ZlcmxvYWRlZDogbWV0YSgpIHJldHVybnMgdGhlIHJlZ2lzdGVyZWQgbWV0YWRhdGEsIG1ldGEoZGF0YSlcbiAgICAgICAgICAgIC8vIHJldHVybnMgYSBjbG9uZSB3aXRoIGBkYXRhYCByZWdpc3RlcmVkLiBUaGUgbWFwcGVkIHR5cGUgcGlja3NcbiAgICAgICAgICAgIC8vIHVwIHRoZSBzZWNvbmQgb3ZlcmxvYWQsIHNvIHdlIGFjY2VwdCB2YXJpYWRpYyBhbnktYXJncyBhbmRcbiAgICAgICAgICAgIC8vIHJldHVybiBgYW55YCB0byBzYXRpc2Z5IGJvdGggYXQgcnVudGltZS5cbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gY29yZS5nbG9iYWxSZWdpc3RyeS5nZXQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBjbCA9IHRoaXMuY2xvbmUoKTtcbiAgICAgICAgICAgIGNvcmUuZ2xvYmFsUmVnaXN0cnkuYWRkKGNsLCBhcmdzWzBdKTtcbiAgICAgICAgICAgIHJldHVybiBjbDtcbiAgICAgICAgfSxcbiAgICAgICAgaXNPcHRpb25hbCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNhZmVQYXJzZSh1bmRlZmluZWQpLnN1Y2Nlc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGlzTnVsbGFibGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zYWZlUGFyc2UobnVsbCkuc3VjY2VzcztcbiAgICAgICAgfSxcbiAgICAgICAgYXBwbHkoZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBmbih0aGlzKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJkZXNjcmlwdGlvblwiLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb3JlLmdsb2JhbFJlZ2lzdHJ5LmdldChpbnN0KT8uZGVzY3JpcHRpb247XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB9KTtcbiAgICByZXR1cm4gaW5zdDtcbn0pO1xuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGNvbnN0IF9ab2RTdHJpbmcgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiX1pvZFN0cmluZ1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU3RyaW5nLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuc3RyaW5nUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBjb25zdCBiYWcgPSBpbnN0Ll96b2QuYmFnO1xuICAgIGluc3QuZm9ybWF0ID0gYmFnLmZvcm1hdCA/PyBudWxsO1xuICAgIGluc3QubWluTGVuZ3RoID0gYmFnLm1pbmltdW0gPz8gbnVsbDtcbiAgICBpbnN0Lm1heExlbmd0aCA9IGJhZy5tYXhpbXVtID8/IG51bGw7XG4gICAgX2luc3RhbGxMYXp5TWV0aG9kcyhpbnN0LCBcIl9ab2RTdHJpbmdcIiwge1xuICAgICAgICByZWdleCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MucmVnZXgoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBpbmNsdWRlcyguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MuaW5jbHVkZXMoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBzdGFydHNXaXRoKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5zdGFydHNXaXRoKC4uLmFyZ3MpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kc1dpdGgoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmVuZHNXaXRoKC4uLmFyZ3MpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWluKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5taW5MZW5ndGgoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICBtYXgoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm1heExlbmd0aCguLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxlbmd0aCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubGVuZ3RoKC4uLmFyZ3MpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZW1wdHkoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm1pbkxlbmd0aCgxLCAuLi5hcmdzKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvd2VyY2FzZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sb3dlcmNhc2UocGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwcGVyY2FzZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy51cHBlcmNhc2UocGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHRyaW0oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MudHJpbSgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9ybWFsaXplKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5ub3JtYWxpemUoLi4uYXJncykpO1xuICAgICAgICB9LFxuICAgICAgICB0b0xvd2VyQ2FzZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9VcHBlckNhc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MudG9VcHBlckNhc2UoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNsdWdpZnkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3Muc2x1Z2lmeSgpKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn0pO1xuZXhwb3J0IGNvbnN0IFpvZFN0cmluZyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RTdHJpbmdcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFN0cmluZy5pbml0KGluc3QsIGRlZik7XG4gICAgX1pvZFN0cmluZy5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5lbWFpbCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fZW1haWwoWm9kRW1haWwsIHBhcmFtcykpO1xuICAgIGluc3QudXJsID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl91cmwoWm9kVVJMLCBwYXJhbXMpKTtcbiAgICBpbnN0Lmp3dCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fand0KFpvZEpXVCwgcGFyYW1zKSk7XG4gICAgaW5zdC5lbW9qaSA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fZW1vamkoWm9kRW1vamksIHBhcmFtcykpO1xuICAgIGluc3QuZ3VpZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fZ3VpZChab2RHVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LnV1aWQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3V1aWQoWm9kVVVJRCwgcGFyYW1zKSk7XG4gICAgaW5zdC51dWlkdjQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX3V1aWR2NChab2RVVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LnV1aWR2NiA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fdXVpZHY2KFpvZFVVSUQsIHBhcmFtcykpO1xuICAgIGluc3QudXVpZHY3ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl91dWlkdjcoWm9kVVVJRCwgcGFyYW1zKSk7XG4gICAgaW5zdC5uYW5vaWQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX25hbm9pZChab2ROYW5vSUQsIHBhcmFtcykpO1xuICAgIGluc3QuZ3VpZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fZ3VpZChab2RHVUlELCBwYXJhbXMpKTtcbiAgICBpbnN0LmN1aWQgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX2N1aWQoWm9kQ1VJRCwgcGFyYW1zKSk7XG4gICAgaW5zdC5jdWlkMiA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fY3VpZDIoWm9kQ1VJRDIsIHBhcmFtcykpO1xuICAgIGluc3QudWxpZCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fdWxpZChab2RVTElELCBwYXJhbXMpKTtcbiAgICBpbnN0LmJhc2U2NCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fYmFzZTY0KFpvZEJhc2U2NCwgcGFyYW1zKSk7XG4gICAgaW5zdC5iYXNlNjR1cmwgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX2Jhc2U2NHVybChab2RCYXNlNjRVUkwsIHBhcmFtcykpO1xuICAgIGluc3QueGlkID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl94aWQoWm9kWElELCBwYXJhbXMpKTtcbiAgICBpbnN0LmtzdWlkID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9rc3VpZChab2RLU1VJRCwgcGFyYW1zKSk7XG4gICAgaW5zdC5pcHY0ID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjb3JlLl9pcHY0KFpvZElQdjQsIHBhcmFtcykpO1xuICAgIGluc3QuaXB2NiA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5faXB2Nihab2RJUHY2LCBwYXJhbXMpKTtcbiAgICBpbnN0LmNpZHJ2NCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fY2lkcnY0KFpvZENJRFJ2NCwgcGFyYW1zKSk7XG4gICAgaW5zdC5jaWRydjYgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX2NpZHJ2Nihab2RDSURSdjYsIHBhcmFtcykpO1xuICAgIGluc3QuZTE2NCA9IChwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fZTE2NChab2RFMTY0LCBwYXJhbXMpKTtcbiAgICAvLyBpc29cbiAgICBpbnN0LmRhdGV0aW1lID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhpc28uZGF0ZXRpbWUocGFyYW1zKSk7XG4gICAgaW5zdC5kYXRlID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhpc28uZGF0ZShwYXJhbXMpKTtcbiAgICBpbnN0LnRpbWUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGlzby50aW1lKHBhcmFtcykpO1xuICAgIGluc3QuZHVyYXRpb24gPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGlzby5kdXJhdGlvbihwYXJhbXMpKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZyhwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fc3RyaW5nKFpvZFN0cmluZywgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RTdHJpbmdGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kU3RyaW5nRm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIF9ab2RTdHJpbmcuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgY29uc3QgWm9kRW1haWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRW1haWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kRW1haWwuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBlbWFpbChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fZW1haWwoWm9kRW1haWwsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kR1VJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RHVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEdVSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBndWlkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9ndWlkKFpvZEdVSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kVVVJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RVVUlEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZFVVSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB1dWlkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91dWlkKFpvZFVVSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gdXVpZHY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91dWlkdjQoWm9kVVVJRCwgcGFyYW1zKTtcbn1cbi8vIFpvZFVVSUR2NlxuZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdXVpZHY2KFpvZFVVSUQsIHBhcmFtcyk7XG59XG4vLyBab2RVVUlEdjdcbmV4cG9ydCBmdW5jdGlvbiB1dWlkdjcocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3V1aWR2Nyhab2RVVUlELCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFVSTCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RVUkxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kVVJMLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdXJsKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91cmwoWm9kVVJMLCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGh0dHBVcmwocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3VybChab2RVUkwsIHtcbiAgICAgICAgcHJvdG9jb2w6IGNvcmUucmVnZXhlcy5odHRwUHJvdG9jb2wsXG4gICAgICAgIGhvc3RuYW1lOiBjb3JlLnJlZ2V4ZXMuZG9tYWluLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZEVtb2ppID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEVtb2ppXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEVtb2ppLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gZW1vamkocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2Vtb2ppKFpvZEVtb2ppLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZE5hbm9JRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2ROYW5vSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kTmFub0lELmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbmFub2lkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9uYW5vaWQoWm9kTmFub0lELCBwYXJhbXMpO1xufVxuLyoqXG4gKiBAZGVwcmVjYXRlZCBDVUlEIHYxIGlzIGRlcHJlY2F0ZWQgYnkgaXRzIGF1dGhvcnMgZHVlIHRvIGluZm9ybWF0aW9uIGxlYWthZ2VcbiAqICh0aW1lc3RhbXBzIGVtYmVkZGVkIGluIHRoZSBpZCkuIFVzZSB7QGxpbmsgWm9kQ1VJRDJ9IGluc3RlYWQuXG4gKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BhcmFsbGVsZHJpdmUvY3VpZC5cbiAqL1xuZXhwb3J0IGNvbnN0IFpvZENVSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQ1VJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RDVUlELmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG4vKipcbiAqIFZhbGlkYXRlcyBhIENVSUQgdjEgc3RyaW5nLlxuICpcbiAqIEBkZXByZWNhdGVkIENVSUQgdjEgaXMgZGVwcmVjYXRlZCBieSBpdHMgYXV0aG9ycyBkdWUgdG8gaW5mb3JtYXRpb24gbGVha2FnZVxuICogKHRpbWVzdGFtcHMgZW1iZWRkZWQgaW4gdGhlIGlkKS4gVXNlIHtAbGluayBjdWlkMiB8IGB6LmN1aWQyKClgfSBpbnN0ZWFkLlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXJhbGxlbGRyaXZlL2N1aWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdWlkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jdWlkKFpvZENVSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kQ1VJRDIgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQ1VJRDJcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQ1VJRDIuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBjdWlkMihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fY3VpZDIoWm9kQ1VJRDIsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kVUxJRCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RVTElEXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZFVMSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB1bGlkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91bGlkKFpvZFVMSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kWElEID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFhJRFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RYSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB4aWQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3hpZChab2RYSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kS1NVSUQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kS1NVSURcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kS1NVSUQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBrc3VpZChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fa3N1aWQoWm9kS1NVSUQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kSVB2NCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RJUHY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZElQdjQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBpcHY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pcHY0KFpvZElQdjQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kTUFDID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE1BQ1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgLy8gWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RNQUMuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBtYWMocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX21hYyhab2RNQUMsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kSVB2NiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RJUHY2XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZElQdjYuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBpcHY2KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pcHY2KFpvZElQdjYsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kQ0lEUnY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZENJRFJ2NFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQ0lEUnY0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gY2lkcnY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jaWRydjQoWm9kQ0lEUnY0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZENJRFJ2NiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDSURSdjZcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZENJRFJ2Ni5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGNpZHJ2NihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fY2lkcnY2KFpvZENJRFJ2NiwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RCYXNlNjQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQmFzZTY0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEJhc2U2NC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fYmFzZTY0KFpvZEJhc2U2NCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RCYXNlNjRVUkwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQmFzZTY0VVJMXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEJhc2U2NFVSTC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NHVybChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fYmFzZTY0dXJsKFpvZEJhc2U2NFVSTCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RFMTY0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEUxNjRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIC8vIFpvZFN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kRTE2NC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGUxNjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2UxNjQoWm9kRTE2NCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RKV1QgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kSldUXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEpXVC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGp3dChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fand0KFpvZEpXVCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RDdXN0b21TdHJpbmdGb3JtYXQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQ3VzdG9tU3RyaW5nRm9ybWF0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICAvLyBab2RTdHJpbmdGb3JtYXQuaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZEN1c3RvbVN0cmluZ0Zvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kU3RyaW5nRm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0Zvcm1hdChmb3JtYXQsIGZuT3JSZWdleCwgX3BhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIGNvcmUuX3N0cmluZ0Zvcm1hdChab2RDdXN0b21TdHJpbmdGb3JtYXQsIGZvcm1hdCwgZm5PclJlZ2V4LCBfcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBob3N0bmFtZShfcGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3N0cmluZ0Zvcm1hdChab2RDdXN0b21TdHJpbmdGb3JtYXQsIFwiaG9zdG5hbWVcIiwgY29yZS5yZWdleGVzLmhvc3RuYW1lLCBfcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoZXgoX3BhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9zdHJpbmdGb3JtYXQoWm9kQ3VzdG9tU3RyaW5nRm9ybWF0LCBcImhleFwiLCBjb3JlLnJlZ2V4ZXMuaGV4LCBfcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoYXNoKGFsZywgcGFyYW1zKSB7XG4gICAgY29uc3QgZW5jID0gcGFyYW1zPy5lbmMgPz8gXCJoZXhcIjtcbiAgICBjb25zdCBmb3JtYXQgPSBgJHthbGd9XyR7ZW5jfWA7XG4gICAgY29uc3QgcmVnZXggPSBjb3JlLnJlZ2V4ZXNbZm9ybWF0XTtcbiAgICBpZiAoIXJlZ2V4KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVucmVjb2duaXplZCBoYXNoIGZvcm1hdDogJHtmb3JtYXR9YCk7XG4gICAgcmV0dXJuIGNvcmUuX3N0cmluZ0Zvcm1hdChab2RDdXN0b21TdHJpbmdGb3JtYXQsIGZvcm1hdCwgcmVnZXgsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kTnVtYmVyID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE51bWJlclwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTnVtYmVyLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubnVtYmVyUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBfaW5zdGFsbExhenlNZXRob2RzKGluc3QsIFwiWm9kTnVtYmVyXCIsIHtcbiAgICAgICAgZ3QodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmd0KHZhbHVlLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ3RlKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5ndGUodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBtaW4odmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGx0KHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sdCh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGx0ZSh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubHRlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWF4KHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sdGUodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBpbnQocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhpbnQocGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNhZmUocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhpbnQocGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHBvc2l0aXZlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmd0KDAsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBub25uZWdhdGl2ZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5ndGUoMCwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5lZ2F0aXZlKHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLmx0KDAsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBub25wb3NpdGl2ZShwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5sdGUoMCwgcGFyYW1zKSk7XG4gICAgICAgIH0sXG4gICAgICAgIG11bHRpcGxlT2YodmFsdWUsIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm11bHRpcGxlT2YodmFsdWUsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBzdGVwKHZhbHVlLCBwYXJhbXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrKGNoZWNrcy5tdWx0aXBsZU9mKHZhbHVlLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmluaXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgYmFnID0gaW5zdC5fem9kLmJhZztcbiAgICBpbnN0Lm1pblZhbHVlID1cbiAgICAgICAgTWF0aC5tYXgoYmFnLm1pbmltdW0gPz8gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLCBiYWcuZXhjbHVzaXZlTWluaW11bSA/PyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpID8/IG51bGw7XG4gICAgaW5zdC5tYXhWYWx1ZSA9XG4gICAgICAgIE1hdGgubWluKGJhZy5tYXhpbXVtID8/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgYmFnLmV4Y2x1c2l2ZU1heGltdW0gPz8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSA/PyBudWxsO1xuICAgIGluc3QuaXNJbnQgPSAoYmFnLmZvcm1hdCA/PyBcIlwiKS5pbmNsdWRlcyhcImludFwiKSB8fCBOdW1iZXIuaXNTYWZlSW50ZWdlcihiYWcubXVsdGlwbGVPZiA/PyAwLjUpO1xuICAgIGluc3QuaXNGaW5pdGUgPSB0cnVlO1xuICAgIGluc3QuZm9ybWF0ID0gYmFnLmZvcm1hdCA/PyBudWxsO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbnVtYmVyKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9udW1iZXIoWm9kTnVtYmVyLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZE51bWJlckZvcm1hdCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2ROdW1iZXJGb3JtYXRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE51bWJlckZvcm1hdC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kTnVtYmVyLmluaXQoaW5zdCwgZGVmKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGludChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faW50KFpvZE51bWJlckZvcm1hdCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDMyKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9mbG9hdDMyKFpvZE51bWJlckZvcm1hdCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmbG9hdDY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9mbG9hdDY0KFpvZE51bWJlckZvcm1hdCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbnQzMihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5faW50MzIoWm9kTnVtYmVyRm9ybWF0LCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVpbnQzMihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdWludDMyKFpvZE51bWJlckZvcm1hdCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RCb29sZWFuID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEJvb2xlYW5cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEJvb2xlYW4uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5ib29sZWFuUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGJvb2xlYW4ocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2Jvb2xlYW4oWm9kQm9vbGVhbiwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RCaWdJbnQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQmlnSW50XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RCaWdJbnQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5iaWdpbnRQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QuZ3RlID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5taW4gPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3RlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lmd0ID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0KHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lmd0ZSA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5ndGUodmFsdWUsIHBhcmFtcykpO1xuICAgIGluc3QubWluID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5sdCA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdCh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5sdGUgPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MubHRlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm1heCA9ICh2YWx1ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdGUodmFsdWUsIHBhcmFtcykpO1xuICAgIGluc3QucG9zaXRpdmUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5ndChCaWdJbnQoMCksIHBhcmFtcykpO1xuICAgIGluc3QubmVnYXRpdmUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdChCaWdJbnQoMCksIHBhcmFtcykpO1xuICAgIGluc3Qubm9ucG9zaXRpdmUgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNoZWNrcy5sdGUoQmlnSW50KDApLCBwYXJhbXMpKTtcbiAgICBpbnN0Lm5vbm5lZ2F0aXZlID0gKHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MuZ3RlKEJpZ0ludCgwKSwgcGFyYW1zKSk7XG4gICAgaW5zdC5tdWx0aXBsZU9mID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLm11bHRpcGxlT2YodmFsdWUsIHBhcmFtcykpO1xuICAgIGNvbnN0IGJhZyA9IGluc3QuX3pvZC5iYWc7XG4gICAgaW5zdC5taW5WYWx1ZSA9IGJhZy5taW5pbXVtID8/IG51bGw7XG4gICAgaW5zdC5tYXhWYWx1ZSA9IGJhZy5tYXhpbXVtID8/IG51bGw7XG4gICAgaW5zdC5mb3JtYXQgPSBiYWcuZm9ybWF0ID8/IG51bGw7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBiaWdpbnQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2JpZ2ludChab2RCaWdJbnQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kQmlnSW50Rm9ybWF0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEJpZ0ludEZvcm1hdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQmlnSW50Rm9ybWF0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RCaWdJbnQuaW5pdChpbnN0LCBkZWYpO1xufSk7XG4vLyBpbnQ2NFxuZXhwb3J0IGZ1bmN0aW9uIGludDY0KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9pbnQ2NChab2RCaWdJbnRGb3JtYXQsIHBhcmFtcyk7XG59XG4vLyB1aW50NjRcbmV4cG9ydCBmdW5jdGlvbiB1aW50NjQocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX3VpbnQ2NChab2RCaWdJbnRGb3JtYXQsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kU3ltYm9sID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFN5bWJvbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU3ltYm9sLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuc3ltYm9sUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHN5bWJvbChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fc3ltYm9sKFpvZFN5bWJvbCwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RVbmRlZmluZWQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kVW5kZWZpbmVkXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RVbmRlZmluZWQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy51bmRlZmluZWRQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5mdW5jdGlvbiBfdW5kZWZpbmVkKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl91bmRlZmluZWQoWm9kVW5kZWZpbmVkLCBwYXJhbXMpO1xufVxuZXhwb3J0IHsgX3VuZGVmaW5lZCBhcyB1bmRlZmluZWQgfTtcbmV4cG9ydCBjb25zdCBab2ROdWxsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE51bGxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE51bGwuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5udWxsUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZnVuY3Rpb24gX251bGwocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX251bGwoWm9kTnVsbCwgcGFyYW1zKTtcbn1cbmV4cG9ydCB7IF9udWxsIGFzIG51bGwgfTtcbmV4cG9ydCBjb25zdCBab2RBbnkgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kQW55XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RBbnkuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5hbnlQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gYW55KCkge1xuICAgIHJldHVybiBjb3JlLl9hbnkoWm9kQW55KTtcbn1cbmV4cG9ydCBjb25zdCBab2RVbmtub3duID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFVua25vd25cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFVua25vd24uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy51bmtub3duUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHVua25vd24oKSB7XG4gICAgcmV0dXJuIGNvcmUuX3Vua25vd24oWm9kVW5rbm93bik7XG59XG5leHBvcnQgY29uc3QgWm9kTmV2ZXIgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTmV2ZXJcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE5ldmVyLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubmV2ZXJQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbmV2ZXIocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX25ldmVyKFpvZE5ldmVyLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFZvaWQgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kVm9pZFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVm9pZC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnZvaWRQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5mdW5jdGlvbiBfdm9pZChwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fdm9pZChab2RWb2lkLCBwYXJhbXMpO1xufVxuZXhwb3J0IHsgX3ZvaWQgYXMgdm9pZCB9O1xuZXhwb3J0IGNvbnN0IFpvZERhdGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kRGF0ZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kRGF0ZS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmRhdGVQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QubWluID0gKHZhbHVlLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY2hlY2tzLmd0ZSh2YWx1ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5tYXggPSAodmFsdWUsIHBhcmFtcykgPT4gaW5zdC5jaGVjayhjaGVja3MubHRlKHZhbHVlLCBwYXJhbXMpKTtcbiAgICBjb25zdCBjID0gaW5zdC5fem9kLmJhZztcbiAgICBpbnN0Lm1pbkRhdGUgPSBjLm1pbmltdW0gPyBuZXcgRGF0ZShjLm1pbmltdW0pIDogbnVsbDtcbiAgICBpbnN0Lm1heERhdGUgPSBjLm1heGltdW0gPyBuZXcgRGF0ZShjLm1heGltdW0pIDogbnVsbDtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGUocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2RhdGUoWm9kRGF0ZSwgcGFyYW1zKTtcbn1cbmV4cG9ydCBjb25zdCBab2RBcnJheSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RBcnJheVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQXJyYXkuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5hcnJheVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5lbGVtZW50ID0gZGVmLmVsZW1lbnQ7XG4gICAgX2luc3RhbGxMYXp5TWV0aG9kcyhpbnN0LCBcIlpvZEFycmF5XCIsIHtcbiAgICAgICAgbWluKG4sIHBhcmFtcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2soY2hlY2tzLm1pbkxlbmd0aChuLCBwYXJhbXMpKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9uZW1wdHkocGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubWluTGVuZ3RoKDEsIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBtYXgobiwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubWF4TGVuZ3RoKG4sIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICBsZW5ndGgobiwgcGFyYW1zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVjayhjaGVja3MubGVuZ3RoKG4sIHBhcmFtcykpO1xuICAgICAgICB9LFxuICAgICAgICB1bndyYXAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgICAgICB9LFxuICAgIH0pO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gYXJyYXkoZWxlbWVudCwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2FycmF5KFpvZEFycmF5LCBlbGVtZW50LCBwYXJhbXMpO1xufVxuLy8gLmtleW9mXG5leHBvcnQgZnVuY3Rpb24ga2V5b2Yoc2NoZW1hKSB7XG4gICAgY29uc3Qgc2hhcGUgPSBzY2hlbWEuX3pvZC5kZWYuc2hhcGU7XG4gICAgcmV0dXJuIF9lbnVtKE9iamVjdC5rZXlzKHNoYXBlKSk7XG59XG5leHBvcnQgY29uc3QgWm9kT2JqZWN0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE9iamVjdFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kT2JqZWN0SklULmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMub2JqZWN0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICB1dGlsLmRlZmluZUxhenkoaW5zdCwgXCJzaGFwZVwiLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBkZWYuc2hhcGU7XG4gICAgfSk7XG4gICAgX2luc3RhbGxMYXp5TWV0aG9kcyhpbnN0LCBcIlpvZE9iamVjdFwiLCB7XG4gICAgICAgIGtleW9mKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9lbnVtKE9iamVjdC5rZXlzKHRoaXMuX3pvZC5kZWYuc2hhcGUpKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2F0Y2hhbGwoY2F0Y2hhbGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKHsgLi4udGhpcy5fem9kLmRlZiwgY2F0Y2hhbGw6IGNhdGNoYWxsIH0pO1xuICAgICAgICB9LFxuICAgICAgICBwYXNzdGhyb3VnaCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKHsgLi4udGhpcy5fem9kLmRlZiwgY2F0Y2hhbGw6IHVua25vd24oKSB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9vc2UoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSh7IC4uLnRoaXMuX3pvZC5kZWYsIGNhdGNoYWxsOiB1bmtub3duKCkgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmljdCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKHsgLi4udGhpcy5fem9kLmRlZiwgY2F0Y2hhbGw6IG5ldmVyKCkgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHN0cmlwKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoeyAuLi50aGlzLl96b2QuZGVmLCBjYXRjaGFsbDogdW5kZWZpbmVkIH0pO1xuICAgICAgICB9LFxuICAgICAgICBleHRlbmQoaW5jb21pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmV4dGVuZCh0aGlzLCBpbmNvbWluZyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNhZmVFeHRlbmQoaW5jb21pbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnNhZmVFeHRlbmQodGhpcywgaW5jb21pbmcpO1xuICAgICAgICB9LFxuICAgICAgICBtZXJnZShvdGhlcikge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwubWVyZ2UodGhpcywgb3RoZXIpO1xuICAgICAgICB9LFxuICAgICAgICBwaWNrKG1hc2spIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLnBpY2sodGhpcywgbWFzayk7XG4gICAgICAgIH0sXG4gICAgICAgIG9taXQobWFzaykge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwub21pdCh0aGlzLCBtYXNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFydGlhbCguLi5hcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdXRpbC5wYXJ0aWFsKFpvZE9wdGlvbmFsLCB0aGlzLCBhcmdzWzBdKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHV0aWwucmVxdWlyZWQoWm9kTm9uT3B0aW9uYWwsIHRoaXMsIGFyZ3NbMF0pO1xuICAgICAgICB9LFxuICAgIH0pO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gb2JqZWN0KHNoYXBlLCBwYXJhbXMpIHtcbiAgICBjb25zdCBkZWYgPSB7XG4gICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgIHNoYXBlOiBzaGFwZSA/PyB7fSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KGRlZik7XG59XG4vLyBzdHJpY3RPYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBzdHJpY3RPYmplY3Qoc2hhcGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgICAgc2hhcGUsXG4gICAgICAgIGNhdGNoYWxsOiBuZXZlcigpLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuLy8gbG9vc2VPYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBsb29zZU9iamVjdChzaGFwZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgICBzaGFwZSxcbiAgICAgICAgY2F0Y2hhbGw6IHVua25vd24oKSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RVbmlvbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RVbmlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVW5pb24uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy51bmlvblByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5vcHRpb25zID0gZGVmLm9wdGlvbnM7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB1bmlvbihvcHRpb25zLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZFVuaW9uKHtcbiAgICAgICAgdHlwZTogXCJ1bmlvblwiLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFhvciA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RYb3JcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIFpvZFVuaW9uLmluaXQoaW5zdCwgZGVmKTtcbiAgICBjb3JlLiRab2RYb3IuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy51bmlvblByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5vcHRpb25zID0gZGVmLm9wdGlvbnM7XG59KTtcbi8qKiBDcmVhdGVzIGFuIGV4Y2x1c2l2ZSB1bmlvbiAoWE9SKSB3aGVyZSBleGFjdGx5IG9uZSBvcHRpb24gbXVzdCBtYXRjaC5cbiAqIFVubGlrZSByZWd1bGFyIHVuaW9ucyB0aGF0IHN1Y2NlZWQgd2hlbiBhbnkgb3B0aW9uIG1hdGNoZXMsIHhvciBmYWlscyBpZlxuICogemVybyBvciBtb3JlIHRoYW4gb25lIG9wdGlvbiBtYXRjaGVzIHRoZSBpbnB1dC4gKi9cbmV4cG9ydCBmdW5jdGlvbiB4b3Iob3B0aW9ucywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RYb3Ioe1xuICAgICAgICB0eXBlOiBcInVuaW9uXCIsXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIGluY2x1c2l2ZTogZmFsc2UsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRGlzY3JpbWluYXRlZFVuaW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZERpc2NyaW1pbmF0ZWRVbmlvblwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgWm9kVW5pb24uaW5pdChpbnN0LCBkZWYpO1xuICAgIGNvcmUuJFpvZERpc2NyaW1pbmF0ZWRVbmlvbi5pbml0KGluc3QsIGRlZik7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBkaXNjcmltaW5hdGVkVW5pb24oZGlzY3JpbWluYXRvciwgb3B0aW9ucywgcGFyYW1zKSB7XG4gICAgLy8gY29uc3QgW29wdGlvbnMsIHBhcmFtc10gPSBhcmdzO1xuICAgIHJldHVybiBuZXcgWm9kRGlzY3JpbWluYXRlZFVuaW9uKHtcbiAgICAgICAgdHlwZTogXCJ1bmlvblwiLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgICBkaXNjcmltaW5hdG9yLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZEludGVyc2VjdGlvbiA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RJbnRlcnNlY3Rpb25cIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZEludGVyc2VjdGlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmludGVyc2VjdGlvblByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnNlY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICByZXR1cm4gbmV3IFpvZEludGVyc2VjdGlvbih7XG4gICAgICAgIHR5cGU6IFwiaW50ZXJzZWN0aW9uXCIsXG4gICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgIHJpZ2h0OiByaWdodCxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RUdXBsZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RUdXBsZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVHVwbGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy50dXBsZVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5yZXN0ID0gKHJlc3QpID0+IGluc3QuY2xvbmUoe1xuICAgICAgICAuLi5pbnN0Ll96b2QuZGVmLFxuICAgICAgICByZXN0OiByZXN0LFxuICAgIH0pO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdHVwbGUoaXRlbXMsIF9wYXJhbXNPclJlc3QsIF9wYXJhbXMpIHtcbiAgICBjb25zdCBoYXNSZXN0ID0gX3BhcmFtc09yUmVzdCBpbnN0YW5jZW9mIGNvcmUuJFpvZFR5cGU7XG4gICAgY29uc3QgcGFyYW1zID0gaGFzUmVzdCA/IF9wYXJhbXMgOiBfcGFyYW1zT3JSZXN0O1xuICAgIGNvbnN0IHJlc3QgPSBoYXNSZXN0ID8gX3BhcmFtc09yUmVzdCA6IG51bGw7XG4gICAgcmV0dXJuIG5ldyBab2RUdXBsZSh7XG4gICAgICAgIHR5cGU6IFwidHVwbGVcIixcbiAgICAgICAgaXRlbXM6IGl0ZW1zLFxuICAgICAgICByZXN0LFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFJlY29yZCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RSZWNvcmRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZFJlY29yZC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnJlY29yZFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5rZXlUeXBlID0gZGVmLmtleVR5cGU7XG4gICAgaW5zdC52YWx1ZVR5cGUgPSBkZWYudmFsdWVUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkKGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSB7XG4gICAgLy8gdjMtY29tcGF0OiB6LnJlY29yZCh2YWx1ZVR5cGUsIHBhcmFtcz8pIOKAlCBkZWZhdWx0cyBrZXlUeXBlIHRvIHouc3RyaW5nKClcbiAgICBpZiAoIXZhbHVlVHlwZSB8fCAhdmFsdWVUeXBlLl96b2QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICAgICAgdHlwZTogXCJyZWNvcmRcIixcbiAgICAgICAgICAgIGtleVR5cGU6IHN0cmluZygpLFxuICAgICAgICAgICAgdmFsdWVUeXBlOiBrZXlUeXBlLFxuICAgICAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXModmFsdWVUeXBlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgWm9kUmVjb3JkKHtcbiAgICAgICAgdHlwZTogXCJyZWNvcmRcIixcbiAgICAgICAga2V5VHlwZSxcbiAgICAgICAgdmFsdWVUeXBlOiB2YWx1ZVR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG4vLyB0eXBlIGFsa3NqZiA9IGNvcmUub3V0cHV0PGNvcmUuJFpvZFJlY29yZEtleT47XG5leHBvcnQgZnVuY3Rpb24gcGFydGlhbFJlY29yZChrZXlUeXBlLCB2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIGNvbnN0IGsgPSBjb3JlLmNsb25lKGtleVR5cGUpO1xuICAgIGsuX3pvZC52YWx1ZXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG5ldyBab2RSZWNvcmQoe1xuICAgICAgICB0eXBlOiBcInJlY29yZFwiLFxuICAgICAgICBrZXlUeXBlOiBrLFxuICAgICAgICB2YWx1ZVR5cGU6IHZhbHVlVHlwZSxcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsb29zZVJlY29yZChrZXlUeXBlLCB2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kUmVjb3JkKHtcbiAgICAgICAgdHlwZTogXCJyZWNvcmRcIixcbiAgICAgICAga2V5VHlwZSxcbiAgICAgICAgdmFsdWVUeXBlOiB2YWx1ZVR5cGUsXG4gICAgICAgIG1vZGU6IFwibG9vc2VcIixcbiAgICAgICAgLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RNYXAgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTWFwXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RNYXAuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5tYXBQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3Qua2V5VHlwZSA9IGRlZi5rZXlUeXBlO1xuICAgIGluc3QudmFsdWVUeXBlID0gZGVmLnZhbHVlVHlwZTtcbiAgICBpbnN0Lm1pbiA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21pblNpemUoLi4uYXJncykpO1xuICAgIGluc3Qubm9uZW1wdHkgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21pblNpemUoMSwgcGFyYW1zKSk7XG4gICAgaW5zdC5tYXggPSAoLi4uYXJncykgPT4gaW5zdC5jaGVjayhjb3JlLl9tYXhTaXplKC4uLmFyZ3MpKTtcbiAgICBpbnN0LnNpemUgPSAoLi4uYXJncykgPT4gaW5zdC5jaGVjayhjb3JlLl9zaXplKC4uLmFyZ3MpKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcChrZXlUeXBlLCB2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kTWFwKHtcbiAgICAgICAgdHlwZTogXCJtYXBcIixcbiAgICAgICAga2V5VHlwZToga2V5VHlwZSxcbiAgICAgICAgdmFsdWVUeXBlOiB2YWx1ZVR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kU2V0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFNldFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU2V0LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuc2V0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0Lm1pbiA9ICguLi5hcmdzKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21pblNpemUoLi4uYXJncykpO1xuICAgIGluc3Qubm9uZW1wdHkgPSAocGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21pblNpemUoMSwgcGFyYW1zKSk7XG4gICAgaW5zdC5tYXggPSAoLi4uYXJncykgPT4gaW5zdC5jaGVjayhjb3JlLl9tYXhTaXplKC4uLmFyZ3MpKTtcbiAgICBpbnN0LnNpemUgPSAoLi4uYXJncykgPT4gaW5zdC5jaGVjayhjb3JlLl9zaXplKC4uLmFyZ3MpKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHNldCh2YWx1ZVR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kU2V0KHtcbiAgICAgICAgdHlwZTogXCJzZXRcIixcbiAgICAgICAgdmFsdWVUeXBlOiB2YWx1ZVR5cGUsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRW51bSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFbnVtXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RFbnVtLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuZW51bVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5lbnVtID0gZGVmLmVudHJpZXM7XG4gICAgaW5zdC5vcHRpb25zID0gT2JqZWN0LnZhbHVlcyhkZWYuZW50cmllcyk7XG4gICAgY29uc3Qga2V5cyA9IG5ldyBTZXQoT2JqZWN0LmtleXMoZGVmLmVudHJpZXMpKTtcbiAgICBpbnN0LmV4dHJhY3QgPSAodmFsdWVzLCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc3QgbmV3RW50cmllcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgICAgaWYgKGtleXMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIG5ld0VudHJpZXNbdmFsdWVdID0gZGVmLmVudHJpZXNbdmFsdWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgS2V5ICR7dmFsdWV9IG5vdCBmb3VuZCBpbiBlbnVtYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBab2RFbnVtKHtcbiAgICAgICAgICAgIC4uLmRlZixcbiAgICAgICAgICAgIGNoZWNrczogW10sXG4gICAgICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICAgICAgZW50cmllczogbmV3RW50cmllcyxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBpbnN0LmV4Y2x1ZGUgPSAodmFsdWVzLCBwYXJhbXMpID0+IHtcbiAgICAgICAgY29uc3QgbmV3RW50cmllcyA9IHsgLi4uZGVmLmVudHJpZXMgfTtcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGlmIChrZXlzLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbmV3RW50cmllc1t2YWx1ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBLZXkgJHt2YWx1ZX0gbm90IGZvdW5kIGluIGVudW1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZEVudW0oe1xuICAgICAgICAgICAgLi4uZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgICAgICAgICBlbnRyaWVzOiBuZXdFbnRyaWVzLFxuICAgICAgICB9KTtcbiAgICB9O1xufSk7XG5mdW5jdGlvbiBfZW51bSh2YWx1ZXMsIHBhcmFtcykge1xuICAgIGNvbnN0IGVudHJpZXMgPSBBcnJheS5pc0FycmF5KHZhbHVlcykgPyBPYmplY3QuZnJvbUVudHJpZXModmFsdWVzLm1hcCgodikgPT4gW3YsIHZdKSkgOiB2YWx1ZXM7XG4gICAgcmV0dXJuIG5ldyBab2RFbnVtKHtcbiAgICAgICAgdHlwZTogXCJlbnVtXCIsXG4gICAgICAgIGVudHJpZXMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgeyBfZW51bSBhcyBlbnVtIH07XG4vKiogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaGFzIGJlZW4gbWVyZ2VkIGludG8gYHouZW51bSgpYC4gVXNlIGB6LmVudW0oKWAgaW5zdGVhZC5cbiAqXG4gKiBgYGB0c1xuICogZW51bSBDb2xvcnMgeyByZWQsIGdyZWVuLCBibHVlIH1cbiAqIHouZW51bShDb2xvcnMpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYXRpdmVFbnVtKGVudHJpZXMsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kRW51bSh7XG4gICAgICAgIHR5cGU6IFwiZW51bVwiLFxuICAgICAgICBlbnRyaWVzLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZExpdGVyYWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTGl0ZXJhbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kTGl0ZXJhbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmxpdGVyYWxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudmFsdWVzID0gbmV3IFNldChkZWYudmFsdWVzKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdCwgXCJ2YWx1ZVwiLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIGlmIChkZWYudmFsdWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHNjaGVtYSBjb250YWlucyBtdWx0aXBsZSB2YWxpZCBsaXRlcmFsIHZhbHVlcy4gVXNlIGAudmFsdWVzYCBpbnN0ZWFkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWYudmFsdWVzWzBdO1xuICAgICAgICB9LFxuICAgIH0pO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbGl0ZXJhbCh2YWx1ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RMaXRlcmFsKHtcbiAgICAgICAgdHlwZTogXCJsaXRlcmFsXCIsXG4gICAgICAgIHZhbHVlczogQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV0sXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRmlsZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RGaWxlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RGaWxlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuZmlsZVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC5taW4gPSAoc2l6ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21pblNpemUoc2l6ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5tYXggPSAoc2l6ZSwgcGFyYW1zKSA9PiBpbnN0LmNoZWNrKGNvcmUuX21heFNpemUoc2l6ZSwgcGFyYW1zKSk7XG4gICAgaW5zdC5taW1lID0gKHR5cGVzLCBwYXJhbXMpID0+IGluc3QuY2hlY2soY29yZS5fbWltZShBcnJheS5pc0FycmF5KHR5cGVzKSA/IHR5cGVzIDogW3R5cGVzXSwgcGFyYW1zKSk7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBmaWxlKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9maWxlKFpvZEZpbGUsIHBhcmFtcyk7XG59XG5leHBvcnQgY29uc3QgWm9kVHJhbnNmb3JtID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFRyYW5zZm9ybVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVHJhbnNmb3JtLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMudHJhbnNmb3JtUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0Ll96b2QucGFyc2UgPSAocGF5bG9hZCwgX2N0eCkgPT4ge1xuICAgICAgICBpZiAoX2N0eC5kaXJlY3Rpb24gPT09IFwiYmFja3dhcmRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IGNvcmUuJFpvZEVuY29kZUVycm9yKGluc3QuY29uc3RydWN0b3IubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcGF5bG9hZC5hZGRJc3N1ZSA9IChpc3N1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpc3N1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHBheWxvYWQuaXNzdWVzLnB1c2godXRpbC5pc3N1ZShpc3N1ZSwgcGF5bG9hZC52YWx1ZSwgZGVmKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBmb3IgWm9kIDMgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBjb25zdCBfaXNzdWUgPSBpc3N1ZTtcbiAgICAgICAgICAgICAgICBpZiAoX2lzc3VlLmZhdGFsKVxuICAgICAgICAgICAgICAgICAgICBfaXNzdWUuY29udGludWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfaXNzdWUuY29kZSA/PyAoX2lzc3VlLmNvZGUgPSBcImN1c3RvbVwiKTtcbiAgICAgICAgICAgICAgICBfaXNzdWUuaW5wdXQgPz8gKF9pc3N1ZS5pbnB1dCA9IHBheWxvYWQudmFsdWUpO1xuICAgICAgICAgICAgICAgIF9pc3N1ZS5pbnN0ID8/IChfaXNzdWUuaW5zdCA9IGluc3QpO1xuICAgICAgICAgICAgICAgIC8vIF9pc3N1ZS5jb250aW51ZSA/Pz0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmlzc3Vlcy5wdXNoKHV0aWwuaXNzdWUoX2lzc3VlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG91dHB1dCA9IGRlZi50cmFuc2Zvcm0ocGF5bG9hZC52YWx1ZSwgcGF5bG9hZCk7XG4gICAgICAgIGlmIChvdXRwdXQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0LnRoZW4oKG91dHB1dCkgPT4ge1xuICAgICAgICAgICAgICAgIHBheWxvYWQudmFsdWUgPSBvdXRwdXQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBwYXlsb2FkLnZhbHVlID0gb3V0cHV0O1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9O1xufSk7XG5leHBvcnQgZnVuY3Rpb24gdHJhbnNmb3JtKGZuKSB7XG4gICAgcmV0dXJuIG5ldyBab2RUcmFuc2Zvcm0oe1xuICAgICAgICB0eXBlOiBcInRyYW5zZm9ybVwiLFxuICAgICAgICB0cmFuc2Zvcm06IGZuLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZE9wdGlvbmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZE9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RPcHRpb25hbC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLm9wdGlvbmFsUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gb3B0aW9uYWwoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIG5ldyBab2RPcHRpb25hbCh7XG4gICAgICAgIHR5cGU6IFwib3B0aW9uYWxcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kRXhhY3RPcHRpb25hbCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RFeGFjdE9wdGlvbmFsXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RFeGFjdE9wdGlvbmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMub3B0aW9uYWxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBleGFjdE9wdGlvbmFsKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kRXhhY3RPcHRpb25hbCh7XG4gICAgICAgIHR5cGU6IFwib3B0aW9uYWxcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTnVsbGFibGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTnVsbGFibGVcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE51bGxhYmxlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubnVsbGFibGVQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBudWxsYWJsZShpbm5lclR5cGUpIHtcbiAgICByZXR1cm4gbmV3IFpvZE51bGxhYmxlKHtcbiAgICAgICAgdHlwZTogXCJudWxsYWJsZVwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbi8vIG51bGxpc2hcbmV4cG9ydCBmdW5jdGlvbiBudWxsaXNoKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBvcHRpb25hbChudWxsYWJsZShpbm5lclR5cGUpKTtcbn1cbmV4cG9ydCBjb25zdCBab2REZWZhdWx0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZERlZmF1bHRcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZERlZmF1bHQuaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5kZWZhdWx0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xuICAgIGluc3QucmVtb3ZlRGVmYXVsdCA9IGluc3QudW53cmFwO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gX2RlZmF1bHQoaW5uZXJUeXBlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZERlZmF1bHQoe1xuICAgICAgICB0eXBlOiBcImRlZmF1bHRcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgICAgIGdldCBkZWZhdWx0VmFsdWUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGRlZmF1bHRWYWx1ZSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbHVlKCkgOiB1dGlsLnNoYWxsb3dDbG9uZShkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFByZWZhdWx0ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFByZWZhdWx0XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RQcmVmYXVsdC5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnByZWZhdWx0UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcHJlZmF1bHQoaW5uZXJUeXBlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZFByZWZhdWx0KHtcbiAgICAgICAgdHlwZTogXCJwcmVmYXVsdFwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICAgICAgZ2V0IGRlZmF1bHRWYWx1ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZGVmYXVsdFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBkZWZhdWx0VmFsdWUoKSA6IHV0aWwuc2hhbGxvd0Nsb25lKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTm9uT3B0aW9uYWwgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTm9uT3B0aW9uYWxcIiwgKGluc3QsIGRlZikgPT4ge1xuICAgIGNvcmUuJFpvZE5vbk9wdGlvbmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubm9ub3B0aW9uYWxQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBub25vcHRpb25hbChpbm5lclR5cGUsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kTm9uT3B0aW9uYWwoe1xuICAgICAgICB0eXBlOiBcIm5vbm9wdGlvbmFsXCIsXG4gICAgICAgIGlubmVyVHlwZTogaW5uZXJUeXBlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFN1Y2Nlc3MgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kU3VjY2Vzc1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kU3VjY2Vzcy5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnN1Y2Nlc3NQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QudW53cmFwID0gKCkgPT4gaW5zdC5fem9kLmRlZi5pbm5lclR5cGU7XG59KTtcbmV4cG9ydCBmdW5jdGlvbiBzdWNjZXNzKGlubmVyVHlwZSkge1xuICAgIHJldHVybiBuZXcgWm9kU3VjY2Vzcyh7XG4gICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RDYXRjaCA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDYXRjaFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQ2F0Y2guaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5jYXRjaFByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC51bndyYXAgPSAoKSA9PiBpbnN0Ll96b2QuZGVmLmlubmVyVHlwZTtcbiAgICBpbnN0LnJlbW92ZUNhdGNoID0gaW5zdC51bndyYXA7XG59KTtcbmZ1bmN0aW9uIF9jYXRjaChpbm5lclR5cGUsIGNhdGNoVmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFpvZENhdGNoKHtcbiAgICAgICAgdHlwZTogXCJjYXRjaFwiLFxuICAgICAgICBpbm5lclR5cGU6IGlubmVyVHlwZSxcbiAgICAgICAgY2F0Y2hWYWx1ZTogKHR5cGVvZiBjYXRjaFZhbHVlID09PSBcImZ1bmN0aW9uXCIgPyBjYXRjaFZhbHVlIDogKCkgPT4gY2F0Y2hWYWx1ZSksXG4gICAgfSk7XG59XG5leHBvcnQgeyBfY2F0Y2ggYXMgY2F0Y2ggfTtcbmV4cG9ydCBjb25zdCBab2ROYU4gPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kTmFOXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2ROYU4uaW5pdChpbnN0LCBkZWYpO1xuICAgIFpvZFR5cGUuaW5pdChpbnN0LCBkZWYpO1xuICAgIGluc3QuX3pvZC5wcm9jZXNzSlNPTlNjaGVtYSA9IChjdHgsIGpzb24sIHBhcmFtcykgPT4gcHJvY2Vzc29ycy5uYW5Qcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbmFuKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9uYW4oWm9kTmFOLCBwYXJhbXMpO1xufVxuZXhwb3J0IGNvbnN0IFpvZFBpcGUgPSAvKkBfX1BVUkVfXyovIGNvcmUuJGNvbnN0cnVjdG9yKFwiWm9kUGlwZVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kUGlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnBpcGVQcm9jZXNzb3IoaW5zdCwgY3R4LCBqc29uLCBwYXJhbXMpO1xuICAgIGluc3QuaW4gPSBkZWYuaW47XG4gICAgaW5zdC5vdXQgPSBkZWYub3V0O1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcGlwZShpbl8sIG91dCkge1xuICAgIHJldHVybiBuZXcgWm9kUGlwZSh7XG4gICAgICAgIHR5cGU6IFwicGlwZVwiLFxuICAgICAgICBpbjogaW5fLFxuICAgICAgICBvdXQ6IG91dCxcbiAgICAgICAgLy8gLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn1cbmV4cG9ydCBjb25zdCBab2RDb2RlYyA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RDb2RlY1wiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgWm9kUGlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgY29yZS4kWm9kQ29kZWMuaW5pdChpbnN0LCBkZWYpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gY29kZWMoaW5fLCBvdXQsIHBhcmFtcykge1xuICAgIHJldHVybiBuZXcgWm9kQ29kZWMoe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IGluXyxcbiAgICAgICAgb3V0OiBvdXQsXG4gICAgICAgIHRyYW5zZm9ybTogcGFyYW1zLmRlY29kZSxcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybTogcGFyYW1zLmVuY29kZSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbnZlcnRDb2RlYyhjb2RlYykge1xuICAgIGNvbnN0IGRlZiA9IGNvZGVjLl96b2QuZGVmO1xuICAgIHJldHVybiBuZXcgWm9kQ29kZWMoe1xuICAgICAgICB0eXBlOiBcInBpcGVcIixcbiAgICAgICAgaW46IGRlZi5vdXQsXG4gICAgICAgIG91dDogZGVmLmluLFxuICAgICAgICB0cmFuc2Zvcm06IGRlZi5yZXZlcnNlVHJhbnNmb3JtLFxuICAgICAgICByZXZlcnNlVHJhbnNmb3JtOiBkZWYudHJhbnNmb3JtLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZFJlYWRvbmx5ID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFJlYWRvbmx5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RSZWFkb25seS5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLnJlYWRvbmx5UHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbiAgICBpbnN0LnVud3JhcCA9ICgpID0+IGluc3QuX3pvZC5kZWYuaW5uZXJUeXBlO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gcmVhZG9ubHkoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIG5ldyBab2RSZWFkb25seSh7XG4gICAgICAgIHR5cGU6IFwicmVhZG9ubHlcIixcbiAgICAgICAgaW5uZXJUeXBlOiBpbm5lclR5cGUsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kVGVtcGxhdGVMaXRlcmFsID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZFRlbXBsYXRlTGl0ZXJhbFwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kVGVtcGxhdGVMaXRlcmFsLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMudGVtcGxhdGVMaXRlcmFsUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlTGl0ZXJhbChwYXJ0cywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIG5ldyBab2RUZW1wbGF0ZUxpdGVyYWwoe1xuICAgICAgICB0eXBlOiBcInRlbXBsYXRlX2xpdGVyYWxcIixcbiAgICAgICAgcGFydHMsXG4gICAgICAgIC4uLnV0aWwubm9ybWFsaXplUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kTGF6eSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RMYXp5XCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RMYXp5LmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMubGF6eVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC51bndyYXAgPSAoKSA9PiBpbnN0Ll96b2QuZGVmLmdldHRlcigpO1xufSk7XG5leHBvcnQgZnVuY3Rpb24gbGF6eShnZXR0ZXIpIHtcbiAgICByZXR1cm4gbmV3IFpvZExhenkoe1xuICAgICAgICB0eXBlOiBcImxhenlcIixcbiAgICAgICAgZ2V0dGVyOiBnZXR0ZXIsXG4gICAgfSk7XG59XG5leHBvcnQgY29uc3QgWm9kUHJvbWlzZSA9IC8qQF9fUFVSRV9fKi8gY29yZS4kY29uc3RydWN0b3IoXCJab2RQcm9taXNlXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RQcm9taXNlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMucHJvbWlzZVByb2Nlc3NvcihpbnN0LCBjdHgsIGpzb24sIHBhcmFtcyk7XG4gICAgaW5zdC51bndyYXAgPSAoKSA9PiBpbnN0Ll96b2QuZGVmLmlubmVyVHlwZTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIHByb21pc2UoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIG5ldyBab2RQcm9taXNlKHtcbiAgICAgICAgdHlwZTogXCJwcm9taXNlXCIsXG4gICAgICAgIGlubmVyVHlwZTogaW5uZXJUeXBlLFxuICAgIH0pO1xufVxuZXhwb3J0IGNvbnN0IFpvZEZ1bmN0aW9uID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEZ1bmN0aW9uXCIsIChpbnN0LCBkZWYpID0+IHtcbiAgICBjb3JlLiRab2RGdW5jdGlvbi5pbml0KGluc3QsIGRlZik7XG4gICAgWm9kVHlwZS5pbml0KGluc3QsIGRlZik7XG4gICAgaW5zdC5fem9kLnByb2Nlc3NKU09OU2NoZW1hID0gKGN0eCwganNvbiwgcGFyYW1zKSA9PiBwcm9jZXNzb3JzLmZ1bmN0aW9uUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuZXhwb3J0IGZ1bmN0aW9uIF9mdW5jdGlvbihwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZEZ1bmN0aW9uKHtcbiAgICAgICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICAgICAgICBpbnB1dDogQXJyYXkuaXNBcnJheShwYXJhbXM/LmlucHV0KSA/IHR1cGxlKHBhcmFtcz8uaW5wdXQpIDogKHBhcmFtcz8uaW5wdXQgPz8gYXJyYXkodW5rbm93bigpKSksXG4gICAgICAgIG91dHB1dDogcGFyYW1zPy5vdXRwdXQgPz8gdW5rbm93bigpLFxuICAgIH0pO1xufVxuZXhwb3J0IHsgX2Z1bmN0aW9uIGFzIGZ1bmN0aW9uIH07XG5leHBvcnQgY29uc3QgWm9kQ3VzdG9tID0gLypAX19QVVJFX18qLyBjb3JlLiRjb25zdHJ1Y3RvcihcIlpvZEN1c3RvbVwiLCAoaW5zdCwgZGVmKSA9PiB7XG4gICAgY29yZS4kWm9kQ3VzdG9tLmluaXQoaW5zdCwgZGVmKTtcbiAgICBab2RUeXBlLmluaXQoaW5zdCwgZGVmKTtcbiAgICBpbnN0Ll96b2QucHJvY2Vzc0pTT05TY2hlbWEgPSAoY3R4LCBqc29uLCBwYXJhbXMpID0+IHByb2Nlc3NvcnMuY3VzdG9tUHJvY2Vzc29yKGluc3QsIGN0eCwganNvbiwgcGFyYW1zKTtcbn0pO1xuLy8gY3VzdG9tIGNoZWNrc1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrKGZuKSB7XG4gICAgY29uc3QgY2ggPSBuZXcgY29yZS4kWm9kQ2hlY2soe1xuICAgICAgICBjaGVjazogXCJjdXN0b21cIixcbiAgICAgICAgLy8gLi4udXRpbC5ub3JtYWxpemVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbiAgICBjaC5fem9kLmNoZWNrID0gZm47XG4gICAgcmV0dXJuIGNoO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbShmbiwgX3BhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jdXN0b20oWm9kQ3VzdG9tLCBmbiA/PyAoKCkgPT4gdHJ1ZSksIF9wYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlZmluZShmbiwgX3BhcmFtcyA9IHt9KSB7XG4gICAgcmV0dXJuIGNvcmUuX3JlZmluZShab2RDdXN0b20sIGZuLCBfcGFyYW1zKTtcbn1cbi8vIHN1cGVyUmVmaW5lXG5leHBvcnQgZnVuY3Rpb24gc3VwZXJSZWZpbmUoZm4sIHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9zdXBlclJlZmluZShmbiwgcGFyYW1zKTtcbn1cbi8vIFJlLWV4cG9ydCBkZXNjcmliZSBhbmQgbWV0YSBmcm9tIGNvcmVcbmV4cG9ydCBjb25zdCBkZXNjcmliZSA9IGNvcmUuZGVzY3JpYmU7XG5leHBvcnQgY29uc3QgbWV0YSA9IGNvcmUubWV0YTtcbmZ1bmN0aW9uIF9pbnN0YW5jZW9mKGNscywgcGFyYW1zID0ge30pIHtcbiAgICBjb25zdCBpbnN0ID0gbmV3IFpvZEN1c3RvbSh7XG4gICAgICAgIHR5cGU6IFwiY3VzdG9tXCIsXG4gICAgICAgIGNoZWNrOiBcImN1c3RvbVwiLFxuICAgICAgICBmbjogKGRhdGEpID0+IGRhdGEgaW5zdGFuY2VvZiBjbHMsXG4gICAgICAgIGFib3J0OiB0cnVlLFxuICAgICAgICAuLi51dGlsLm5vcm1hbGl6ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xuICAgIGluc3QuX3pvZC5iYWcuQ2xhc3MgPSBjbHM7XG4gICAgLy8gT3ZlcnJpZGUgY2hlY2sgdG8gZW1pdCBpbnZhbGlkX3R5cGUgaW5zdGVhZCBvZiBjdXN0b21cbiAgICBpbnN0Ll96b2QuY2hlY2sgPSAocGF5bG9hZCkgPT4ge1xuICAgICAgICBpZiAoIShwYXlsb2FkLnZhbHVlIGluc3RhbmNlb2YgY2xzKSkge1xuICAgICAgICAgICAgcGF5bG9hZC5pc3N1ZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgY29kZTogXCJpbnZhbGlkX3R5cGVcIixcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogY2xzLm5hbWUsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHBheWxvYWQudmFsdWUsXG4gICAgICAgICAgICAgICAgaW5zdCxcbiAgICAgICAgICAgICAgICBwYXRoOiBbLi4uKGluc3QuX3pvZC5kZWYucGF0aCA/PyBbXSldLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBpbnN0O1xufVxuZXhwb3J0IHsgX2luc3RhbmNlb2YgYXMgaW5zdGFuY2VvZiB9O1xuLy8gc3RyaW5nYm9vbFxuZXhwb3J0IGNvbnN0IHN0cmluZ2Jvb2wgPSAoLi4uYXJncykgPT4gY29yZS5fc3RyaW5nYm9vbCh7XG4gICAgQ29kZWM6IFpvZENvZGVjLFxuICAgIEJvb2xlYW46IFpvZEJvb2xlYW4sXG4gICAgU3RyaW5nOiBab2RTdHJpbmcsXG59LCAuLi5hcmdzKTtcbmV4cG9ydCBmdW5jdGlvbiBqc29uKHBhcmFtcykge1xuICAgIGNvbnN0IGpzb25TY2hlbWEgPSBsYXp5KCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHVuaW9uKFtzdHJpbmcocGFyYW1zKSwgbnVtYmVyKCksIGJvb2xlYW4oKSwgX251bGwoKSwgYXJyYXkoanNvblNjaGVtYSksIHJlY29yZChzdHJpbmcoKSwganNvblNjaGVtYSldKTtcbiAgICB9KTtcbiAgICByZXR1cm4ganNvblNjaGVtYTtcbn1cbi8vIHByZXByb2Nlc3NcbmV4cG9ydCBmdW5jdGlvbiBwcmVwcm9jZXNzKGZuLCBzY2hlbWEpIHtcbiAgICByZXR1cm4gcGlwZSh0cmFuc2Zvcm0oZm4pLCBzY2hlbWEpO1xufVxuIiwiaW1wb3J0ICogYXMgY29yZSBmcm9tIFwiLi4vY29yZS9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgc2NoZW1hcyBmcm9tIFwiLi9zY2hlbWFzLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gc3RyaW5nKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jb2VyY2VkU3RyaW5nKHNjaGVtYXMuWm9kU3RyaW5nLCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG51bWJlcihwYXJhbXMpIHtcbiAgICByZXR1cm4gY29yZS5fY29lcmNlZE51bWJlcihzY2hlbWFzLlpvZE51bWJlciwgcGFyYW1zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBib29sZWFuKHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jb2VyY2VkQm9vbGVhbihzY2hlbWFzLlpvZEJvb2xlYW4sIHBhcmFtcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gYmlnaW50KHBhcmFtcykge1xuICAgIHJldHVybiBjb3JlLl9jb2VyY2VkQmlnaW50KHNjaGVtYXMuWm9kQmlnSW50LCBwYXJhbXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRhdGUocGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvcmUuX2NvZXJjZWREYXRlKHNjaGVtYXMuWm9kRGF0ZSwgcGFyYW1zKTtcbn1cbiIsImltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbi8qKiBVcHBlciBib3VuZCBmb3IgYSBzaW5nbGUgcmVzdW1lLXNpZGUgdXBsb2FkIChieXRlcykuICovXG5leHBvcnQgY29uc3QgUkVTVU1FX1VQTE9BRF9NQVhfQllURVMgPSAxNSAqIDEwMjQgKiAxMDI0O1xuXG4vKipcbiAqIE1heCByZXN1bWUgc2l6ZSB0aGUgZXh0ZW5zaW9uIHdpbGwgZmV0Y2ggaW50byBtZW1vcnkgd2hlbiBhdHRhY2hpbmcgdG8gYSBmaWxlXG4gKiBpbnB1dCAoY29udGVudC1zY3JpcHQgZmV0Y2ggZnJvbSBhIHByZXNpZ25lZCBVUkwgb3IgZGVjb2RpbmcgYSBgZGF0YTpgIFVSTCkuXG4gKi9cbmV4cG9ydCBjb25zdCBSRVNVTUVfQVVUT0ZJTExfTUFYX0JZVEVTID0gOCAqIDEwMjQgKiAxMDI0O1xuXG4vKiogU2hvcnQgbGFiZWwgZm9yIFVJIHdoZW4gYSByZWFkeSByZXN1bWUgaXMgYXZhaWxhYmxlIGZvciBhdXRvZmlsbC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRSZXN1bWVBdHRhY2htZW50TGFiZWwoaW5wdXQ6IHtcbiAgbWltZVR5cGU6IHN0cmluZztcbn0pOiBzdHJpbmcge1xuICBjb25zdCBtaW1lID0gaW5wdXQubWltZVR5cGUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKG1pbWUuaW5jbHVkZXMoXCJwZGZcIikpIHtcbiAgICByZXR1cm4gXCJVcGxvYWRlZCByZXN1bWUgKFBERilcIjtcbiAgfVxuICBpZiAoXG4gICAgbWltZS5pbmNsdWRlcyhcIndvcmRwcm9jZXNzaW5nbWxcIikgfHxcbiAgICBtaW1lID09PSBcImFwcGxpY2F0aW9uL21zd29yZFwiXG4gICkge1xuICAgIHJldHVybiBcIlVwbG9hZGVkIHJlc3VtZSAoV29yZClcIjtcbiAgfVxuICByZXR1cm4gXCJVcGxvYWRlZCByZXN1bWVcIjtcbn1cblxuLyoqIEZpbGVuYW1lIHVzZWQgd2hlbiBhc3NpZ25pbmcgYSB7QGxpbmsgRmlsZX0gdG8gYSBmaWxlIGlucHV0LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc3VtZUF1dG9maWxsRmlsZU5hbWUobWltZVR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IG1pbWUgPSBtaW1lVHlwZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAobWltZS5pbmNsdWRlcyhcInBkZlwiKSkge1xuICAgIHJldHVybiBcInNlYXJjaHBhcnR5LXJlc3VtZS5wZGZcIjtcbiAgfVxuICBpZiAobWltZS5pbmNsdWRlcyhcIndvcmRwcm9jZXNzaW5nbWxcIikpIHtcbiAgICByZXR1cm4gXCJzZWFyY2hwYXJ0eS1yZXN1bWUuZG9jeFwiO1xuICB9XG4gIGlmIChtaW1lID09PSBcImFwcGxpY2F0aW9uL21zd29yZFwiKSB7XG4gICAgcmV0dXJuIFwic2VhcmNocGFydHktcmVzdW1lLmRvY1wiO1xuICB9XG4gIHJldHVybiBcInNlYXJjaHBhcnR5LXJlc3VtZVwiO1xufVxuXG5leHBvcnQgY29uc3QgcmVzdW1lRG9jdW1lbnRLaW5kU2NoZW1hID0gei5lbnVtKFtcbiAgXCJyZXN1bWVcIixcbiAgXCJjb3Zlcl9sZXR0ZXJcIixcbiAgXCJwb3J0Zm9saW9cIixcbiAgXCJvdGhlclwiLFxuXSk7XG5cbmV4cG9ydCBjb25zdCByZXN1bWVVcGxvYWRNaW1lVHlwZVNjaGVtYSA9IHouZW51bShbXG4gIFwiYXBwbGljYXRpb24vcGRmXCIsXG4gIFwiYXBwbGljYXRpb24vbXN3b3JkXCIsXG4gIFwiYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnRcIixcbl0pO1xuXG5leHBvcnQgY29uc3QgcmVzdW1lUHJlc2lnblVwbG9hZElucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBraW5kOiByZXN1bWVEb2N1bWVudEtpbmRTY2hlbWEsXG4gIG1pbWVUeXBlOiByZXN1bWVVcGxvYWRNaW1lVHlwZVNjaGVtYSxcbiAgc2l6ZUJ5dGVzOiB6XG4gICAgLm51bWJlcigpXG4gICAgLmludCgpXG4gICAgLnBvc2l0aXZlKClcbiAgICAubWF4KFJFU1VNRV9VUExPQURfTUFYX0JZVEVTKSxcbiAgZmlsZU5hbWU6IHouc3RyaW5nKCkudHJpbSgpLm1pbigxKS5tYXgoMjAwKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCBjb25zdCByZXN1bWVGaW5hbGl6ZVVwbG9hZElucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBmaW5hbGl6ZVVwbG9hZDogei5saXRlcmFsKHRydWUpLFxufSk7XG5cbmV4cG9ydCBjb25zdCByZXN1bWVVcGxvYWRTdGF0dXNTY2hlbWEgPSB6LmVudW0oW1wicGVuZGluZ1wiLCBcInJlYWR5XCJdKTtcblxuZXhwb3J0IGNvbnN0IHJlc3VtZVJlY29yZFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgaWQ6IHouc3RyaW5nKCksXG4gIGtpbmQ6IHJlc3VtZURvY3VtZW50S2luZFNjaGVtYSxcbiAgbWltZVR5cGU6IHouc3RyaW5nKCksXG4gIHNpemVCeXRlczogei5udW1iZXIoKS5pbnQoKSxcbiAgY2hlY2tzdW06IHouc3RyaW5nKCksXG4gIHVwbG9hZFN0YXR1czogcmVzdW1lVXBsb2FkU3RhdHVzU2NoZW1hLFxuICBjcmVhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbiAgdXBkYXRlZEF0OiB6LnN0cmluZygpLmRhdGV0aW1lKCksXG59KTtcblxuZXhwb3J0IHR5cGUgUmVzdW1lRG9jdW1lbnRLaW5kID0gei5pbmZlcjx0eXBlb2YgcmVzdW1lRG9jdW1lbnRLaW5kU2NoZW1hPjtcbmV4cG9ydCB0eXBlIFJlc3VtZVJlY29yZCA9IHouaW5mZXI8dHlwZW9mIHJlc3VtZVJlY29yZFNjaGVtYT47XG5cbi8qKiBKU09OIGJvZHkgZnJvbSBgUEFUQ0ggL2FwaS9yZXN1bWVzLzpyZXN1bWVJZGAgYWZ0ZXIgYHsgZmluYWxpemVVcGxvYWQ6IHRydWUgfWAuICovXG5leHBvcnQgY29uc3QgcmVzdW1lRmluYWxpemVVcGxvYWRSZXNwb25zZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgcmVzdW1lOiByZXN1bWVSZWNvcmRTY2hlbWEsXG59KTtcblxuZXhwb3J0IHR5cGUgUmVzdW1lRmluYWxpemVVcGxvYWRSZXNwb25zZSA9IHouaW5mZXI8XG4gIHR5cGVvZiByZXN1bWVGaW5hbGl6ZVVwbG9hZFJlc3BvbnNlU2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgcmVzdW1lRG93bmxvYWRSZXNwb25zZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgZG93bmxvYWRVcmw6IHouc3RyaW5nKCkudXJsKCksXG4gIGV4cGlyZXNJblNlY29uZHM6IHoubnVtYmVyKCkuaW50KCksXG59KTtcblxuZXhwb3J0IHR5cGUgUmVzdW1lRG93bmxvYWRSZXNwb25zZSA9IHouaW5mZXI8dHlwZW9mIHJlc3VtZURvd25sb2FkUmVzcG9uc2VTY2hlbWE+O1xuXG5leHBvcnQgY29uc3QgcmVzdW1lUHJlc2lnblVwbG9hZFJlc3BvbnNlU2NoZW1hID0gei5vYmplY3Qoe1xuICByZXN1bWVJZDogei5zdHJpbmcoKSxcbiAgdXBsb2FkVXJsOiB6LnN0cmluZygpLnVybCgpLFxuICBtZXRob2Q6IHoubGl0ZXJhbChcIlBVVFwiKSxcbiAgaGVhZGVyczogei5vYmplY3Qoe1xuICAgIFwiQ29udGVudC1UeXBlXCI6IHouc3RyaW5nKCksXG4gIH0pLFxuICBleHBpcmVzSW5TZWNvbmRzOiB6Lm51bWJlcigpLmludCgpLFxufSk7XG5cbmV4cG9ydCB0eXBlIFJlc3VtZVByZXNpZ25VcGxvYWRSZXNwb25zZSA9IHouaW5mZXI8XG4gIHR5cGVvZiByZXN1bWVQcmVzaWduVXBsb2FkUmVzcG9uc2VTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCByZXN1bWVMaXN0UmVzcG9uc2VTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHJlc3VtZXM6IHouYXJyYXkocmVzdW1lUmVjb3JkU2NoZW1hKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBSZXN1bWVMaXN0UmVzcG9uc2UgPSB6LmluZmVyPHR5cGVvZiByZXN1bWVMaXN0UmVzcG9uc2VTY2hlbWE+O1xuXG5leHBvcnQgdHlwZSBSZXN1bWVQcmVzaWduVXBsb2FkSW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgcmVzdW1lUHJlc2lnblVwbG9hZElucHV0U2NoZW1hXG4+O1xuXG4vKipcbiAqIFByb2R1Y2VzIGEgc2luZ2xlIHBhdGggc2VnbWVudCBzYWZlIGZvciBSMiBvYmplY3Qga2V5cy4gRmFsbHMgYmFjayB0b1xuICogYFwidXBsb2FkXCJgIHdoZW4gdGhlIGlucHV0IGlzIGVtcHR5IGFmdGVyIHNhbml0aXphdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplUmVzdW1lRmlsZU5hbWUoaW5wdXQ6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIGNvbnN0IHJhdyA9IChpbnB1dCA/PyBcInVwbG9hZFwiKS50cmltKCkuc2xpY2UoMCwgMjAwKTtcbiAgY29uc3Qgc3RyaXBwZWQgPSByYXcucmVwbGFjZSgvXi4qW1xcXFwvXS8sIFwiXCIpO1xuICBjb25zdCBzYWZlID0gc3RyaXBwZWRcbiAgICAucmVwbGFjZSgvW15hLXpBLVowLTkuXy1dKy9nLCBcIl9cIilcbiAgICAucmVwbGFjZSgvXl8rfF8rJC9nLCBcIlwiKTtcbiAgcmV0dXJuIHNhZmUubGVuZ3RoID4gMCA/IHNhZmUgOiBcInVwbG9hZFwiO1xufVxuIiwiaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcblxuLyoqIFByb2R1Y3QgY2F0ZWdvcmllcyBmb3IgcHJvZmlsZSBhbmQgYXBwbGljYXRpb24gYW5zd2Vycy4gKi9cbmV4cG9ydCBjb25zdCBhbnN3ZXJDYXRlZ29yeVNjaGVtYSA9IHouZW51bShbXG4gIFwiZmFjdFwiLFxuICBcInByZWZlcmVuY2VcIixcbiAgXCJuYXJyYXRpdmVcIixcbl0pO1xuXG5leHBvcnQgdHlwZSBBbnN3ZXJDYXRlZ29yeSA9IHouaW5mZXI8dHlwZW9mIGFuc3dlckNhdGVnb3J5U2NoZW1hPjtcblxuLyoqIFdoZXJlIGEgcmVzb2x2ZWQgYW5zd2VyIG9yaWdpbmF0ZWQuICovXG5leHBvcnQgY29uc3QgYW5zd2VyU291cmNlU2NoZW1hID0gei5lbnVtKFtcbiAgXCJ1c2VyX2VkaXRcIixcbiAgXCJwcm9maWxlXCIsXG4gIFwiYWNjb3VudFwiLFxuICBcInJlc3VtZVwiLFxuICBcImFwcHJvdmVkX3JldXNhYmxlXCIsXG4gIFwiYXBwcm92ZWRfZ2VuZXJhdGVkXCIsXG4gIFwiZHJhZnRfZ2VuZXJhdGVkXCIsXG5dKTtcblxuZXhwb3J0IHR5cGUgQW5zd2VyU291cmNlID0gei5pbmZlcjx0eXBlb2YgYW5zd2VyU291cmNlU2NoZW1hPjtcblxuLyoqIEFwcHJvdmFsIHN0YXRlIGZvciBhbnN3ZXJzIHRoYXQgbWF5IGVudGVyIGF1dG9maWxsLiAqL1xuZXhwb3J0IGNvbnN0IGFwcHJvdmFsU3RhdHVzU2NoZW1hID0gei5lbnVtKFtcbiAgXCJjb25maXJtZWRcIixcbiAgXCJkcmFmdFwiLFxuICBcInJlamVjdGVkXCIsXG4gIFwicGVuZGluZ1wiLFxuXSk7XG5cbmV4cG9ydCB0eXBlIEFwcHJvdmFsU3RhdHVzID0gei5pbmZlcjx0eXBlb2YgYXBwcm92YWxTdGF0dXNTY2hlbWE+O1xuXG4vKiogT25lIHJlc29sdmVkIGFuc3dlciByZWFkeSBmb3IgVUkgcHJvdmVuYW5jZSBhbmQgYXV0b2ZpbGwgcG9saWN5LiAqL1xuZXhwb3J0IGNvbnN0IHJlc29sdmVkQW5zd2VyU2NoZW1hID0gei5vYmplY3Qoe1xuICBrZXk6IHouc3RyaW5nKCkubWluKDEpLFxuICB2YWx1ZTogei5zdHJpbmcoKSxcbiAgY2F0ZWdvcnk6IGFuc3dlckNhdGVnb3J5U2NoZW1hLFxuICBzb3VyY2U6IGFuc3dlclNvdXJjZVNjaGVtYSxcbiAgYXBwcm92YWw6IGFwcHJvdmFsU3RhdHVzU2NoZW1hLFxuICBsYWJlbDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCB0eXBlIFJlc29sdmVkQW5zd2VyID0gei5pbmZlcjx0eXBlb2YgcmVzb2x2ZWRBbnN3ZXJTY2hlbWE+O1xuXG4vKiogSHVtYW4tcmVhZGFibGUgcHJvdmVuYW5jZSBsYWJlbHMgZm9yIGV4dGVuc2lvbiBwcmV2aWV3cy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm92ZW5hbmNlTGFiZWxGb3JTb3VyY2Uoc291cmNlOiBBbnN3ZXJTb3VyY2UpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHNvdXJjZSkge1xuICAgIGNhc2UgXCJ1c2VyX2VkaXRcIjpcbiAgICAgIHJldHVybiBcIkZyb20geW91ciBlZGl0XCI7XG4gICAgY2FzZSBcInByb2ZpbGVcIjpcbiAgICAgIHJldHVybiBcIkZyb20geW91ciBwcm9maWxlXCI7XG4gICAgY2FzZSBcImFjY291bnRcIjpcbiAgICAgIHJldHVybiBcIkZyb20geW91ciBhY2NvdW50XCI7XG4gICAgY2FzZSBcInJlc3VtZVwiOlxuICAgICAgcmV0dXJuIFwiRnJvbSB5b3VyIHLDqXN1bcOpXCI7XG4gICAgY2FzZSBcImFwcHJvdmVkX3JldXNhYmxlXCI6XG4gICAgICByZXR1cm4gXCJGcm9tIGEgc2F2ZWQgYW5zd2VyXCI7XG4gICAgY2FzZSBcImFwcHJvdmVkX2dlbmVyYXRlZFwiOlxuICAgICAgcmV0dXJuIFwiQXBwcm92ZWQgQUkgZHJhZnRcIjtcbiAgICBjYXNlIFwiZHJhZnRfZ2VuZXJhdGVkXCI6XG4gICAgICByZXR1cm4gXCJBSSBkcmFmdCDigJQgcmV2aWV3IHJlcXVpcmVkXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBXaGV0aGVyIGEgcmVzb2x2ZWQgYW5zd2VyIG1heSBiZSBzZWxlY3RlZCBmb3IgYXV0b2ZpbGwuXG4gKiBEcmFmdCBhbmQgcGVuZGluZyB2YWx1ZXMgbmV2ZXIgZW50ZXIgdGhlIGZpbGwgcGF5bG9hZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQW5zd2VyRWxpZ2libGVGb3JBdXRvZmlsbChcbiAgYW5zd2VyOiBSZXNvbHZlZEFuc3dlciB8IG51bGwgfCB1bmRlZmluZWQsXG4pOiBib29sZWFuIHtcbiAgaWYgKCFhbnN3ZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGFuc3dlci52YWx1ZS50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBhbnN3ZXIuYXBwcm92YWwgPT09IFwiY29uZmlybWVkXCI7XG59XG4iLCJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuXG5pbXBvcnQgeyBhcHByb3ZhbFN0YXR1c1NjaGVtYSB9IGZyb20gXCIuL2Fuc3dlcnMvdHlwZXNcIjtcblxuLyoqIEtpbmQgb2Ygc3RydWN0dXJlZCBjbGFpbSBleHRyYWN0ZWQgZnJvbSBhIHLDqXN1bcOpLiAqL1xuZXhwb3J0IGNvbnN0IGZhY3RQcm9wb3NhbEtpbmRTY2hlbWEgPSB6LmVudW0oW1xuICBcIndvcmtfZXhwZXJpZW5jZVwiLFxuICBcImVkdWNhdGlvblwiLFxuICBcInNraWxsXCIsXG4gIFwicHJvamVjdFwiLFxuICBcImNvbnRhY3RcIixcbiAgXCJzdW1tYXJ5XCIsXG5dKTtcblxuZXhwb3J0IHR5cGUgRmFjdFByb3Bvc2FsS2luZCA9IHouaW5mZXI8dHlwZW9mIGZhY3RQcm9wb3NhbEtpbmRTY2hlbWE+O1xuXG4vKiogU291cmNlIHNwYW4gY2l0YXRpb24gaW5zaWRlIGV4dHJhY3RlZCBkb2N1bWVudCB0ZXh0LiAqL1xuZXhwb3J0IGNvbnN0IGZhY3RTb3VyY2VTcGFuU2NoZW1hID0gei5vYmplY3Qoe1xuICBzdGFydDogei5udW1iZXIoKS5pbnQoKS5ub25uZWdhdGl2ZSgpLFxuICBlbmQ6IHoubnVtYmVyKCkuaW50KCkubm9ubmVnYXRpdmUoKSxcbiAgZXhjZXJwdDogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEZhY3RTb3VyY2VTcGFuID0gei5pbmZlcjx0eXBlb2YgZmFjdFNvdXJjZVNwYW5TY2hlbWE+O1xuXG4vKiogU3RydWN0dXJlZCBwYXlsb2FkIGZvciBhIHNpbmdsZSByw6lzdW3DqSBleHRyYWN0aW9uIHByb3Bvc2FsLiAqL1xuZXhwb3J0IGNvbnN0IGZhY3RQcm9wb3NhbFBheWxvYWRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGNvbXBhbnk6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICB0aXRsZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIHN0YXJ0RGF0ZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGVuZERhdGU6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICBkZXNjcmlwdGlvbjogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIHNjaG9vbDogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGRlZ3JlZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGZpZWxkT2ZTdHVkeTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIG5hbWU6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICBjYXRlZ29yeTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIHllYXJzT2ZFeHBlcmllbmNlOiB6Lm51bWJlcigpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbiAgdGVjaG5vbG9naWVzOiB6LmFycmF5KHouc3RyaW5nKCkpLm9wdGlvbmFsKCksXG4gIGFjaGlldmVtZW50czogei5hcnJheSh6LnN0cmluZygpKS5vcHRpb25hbCgpLFxuICB1cmw6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICByYXdUZXh0OiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBGYWN0UHJvcG9zYWxQYXlsb2FkID0gei5pbmZlcjxcbiAgdHlwZW9mIGZhY3RQcm9wb3NhbFBheWxvYWRTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCBmYWN0UHJvcG9zYWxTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICB1c2VySWQ6IHouc3RyaW5nKCksXG4gIHByb2ZpbGVJZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICByZXN1bWVJZDogei5zdHJpbmcoKSxcbiAga2luZDogZmFjdFByb3Bvc2FsS2luZFNjaGVtYSxcbiAgc3RhdHVzOiBhcHByb3ZhbFN0YXR1c1NjaGVtYSxcbiAgY29uZmlkZW5jZTogei5udW1iZXIoKS5taW4oMCkubWF4KDEpLFxuICBwYXlsb2FkOiBmYWN0UHJvcG9zYWxQYXlsb2FkU2NoZW1hLFxuICBzb3VyY2VTcGFuOiBmYWN0U291cmNlU3BhblNjaGVtYS5udWxsYWJsZSgpLFxuICBjcmVhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbiAgdXBkYXRlZEF0OiB6LnN0cmluZygpLmRhdGV0aW1lKCksXG4gIHJldmlld2VkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKS5udWxsYWJsZSgpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEZhY3RQcm9wb3NhbCA9IHouaW5mZXI8dHlwZW9mIGZhY3RQcm9wb3NhbFNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBmYWN0UHJvcG9zYWxMaXN0UmVzcG9uc2VTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHByb3Bvc2Fsczogei5hcnJheShmYWN0UHJvcG9zYWxTY2hlbWEpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEZhY3RQcm9wb3NhbExpc3RSZXNwb25zZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBmYWN0UHJvcG9zYWxMaXN0UmVzcG9uc2VTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCByZXZpZXdGYWN0UHJvcG9zYWxJbnB1dFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgYWN0aW9uOiB6LmVudW0oW1wiYXBwcm92ZVwiLCBcInJlamVjdFwiLCBcImVkaXRcIl0pLFxuICAvKiogUmVxdWlyZWQgd2hlbiBhY3Rpb24gaXMgZWRpdCDigJQgcmVwbGFjZXMgcHJvcG9zYWwgcGF5bG9hZCBiZWZvcmUgYXBwcm92YWwuICovXG4gIHBheWxvYWQ6IGZhY3RQcm9wb3NhbFBheWxvYWRTY2hlbWEub3B0aW9uYWwoKSxcbiAgcHJvZmlsZUlkOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KTtcblxuZXhwb3J0IHR5cGUgUmV2aWV3RmFjdFByb3Bvc2FsSW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgcmV2aWV3RmFjdFByb3Bvc2FsSW5wdXRTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCBkb2N1bWVudEV4dHJhY3Rpb25TdGF0dXNTY2hlbWEgPSB6LmVudW0oW1xuICBcInBlbmRpbmdcIixcbiAgXCJyZWFkeVwiLFxuICBcImZhaWxlZFwiLFxuXSk7XG5cbmV4cG9ydCBjb25zdCBkb2N1bWVudEV4dHJhY3Rpb25TY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICByZXN1bWVJZDogei5zdHJpbmcoKSxcbiAgdXNlcklkOiB6LnN0cmluZygpLFxuICBzdGF0dXM6IGRvY3VtZW50RXh0cmFjdGlvblN0YXR1c1NjaGVtYSxcbiAgZXh0cmFjdG9yVmVyc2lvbjogei5zdHJpbmcoKSxcbiAgZXh0cmFjdGVkVGV4dFByZXZpZXc6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgZXJyb3JNZXNzYWdlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGNyZWF0ZWRBdDogei5zdHJpbmcoKS5kYXRldGltZSgpLFxuICB1cGRhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBEb2N1bWVudEV4dHJhY3Rpb24gPSB6LmluZmVyPFxuICB0eXBlb2YgZG9jdW1lbnRFeHRyYWN0aW9uU2NoZW1hXG4+O1xuXG4vKipcbiAqIFNjaGVtYS1jb25zdHJhaW5lZCBleHRyYWN0aW9uIHJlc3VsdC4gTWlzc2luZyBmaWVsZHMgbXVzdCBiZSBudWxsIOKAlFxuICogZXh0cmFjdG9ycyBtdXN0IG5ldmVyIGludmVudCBlbXBsb3llcnMsIGRhdGVzLCBvciBjcmVkZW50aWFscy5cbiAqL1xuZXhwb3J0IGNvbnN0IHJlc3VtZUV4dHJhY3Rpb25SZXN1bHRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHN1bW1hcnk6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgd29ya0V4cGVyaWVuY2VzOiB6LmFycmF5KFxuICAgIHoub2JqZWN0KHtcbiAgICAgIGNvbXBhbnk6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICAgIHRpdGxlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICBzdGFydERhdGU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICAgIGVuZERhdGU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICB0ZWNobm9sb2dpZXM6IHouYXJyYXkoei5zdHJpbmcoKSkuZGVmYXVsdChbXSksXG4gICAgICBhY2hpZXZlbWVudHM6IHouYXJyYXkoei5zdHJpbmcoKSkuZGVmYXVsdChbXSksXG4gICAgICBzb3VyY2VTcGFuOiBmYWN0U291cmNlU3BhblNjaGVtYS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gICAgICBjb25maWRlbmNlOiB6Lm51bWJlcigpLm1pbigwKS5tYXgoMSkuZGVmYXVsdCgwLjUpLFxuICAgIH0pLFxuICApLFxuICBlZHVjYXRpb246IHouYXJyYXkoXG4gICAgei5vYmplY3Qoe1xuICAgICAgc2Nob29sOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICBkZWdyZWU6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICAgIGZpZWxkT2ZTdHVkeTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgICAgc3RhcnREYXRlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICBlbmREYXRlOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICBzb3VyY2VTcGFuOiBmYWN0U291cmNlU3BhblNjaGVtYS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gICAgICBjb25maWRlbmNlOiB6Lm51bWJlcigpLm1pbigwKS5tYXgoMSkuZGVmYXVsdCgwLjUpLFxuICAgIH0pLFxuICApLFxuICBza2lsbHM6IHouYXJyYXkoXG4gICAgei5vYmplY3Qoe1xuICAgICAgbmFtZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgICAgY2F0ZWdvcnk6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgICAgIHllYXJzT2ZFeHBlcmllbmNlOiB6Lm51bWJlcigpLm51bGxhYmxlKCksXG4gICAgICBjb25maWRlbmNlOiB6Lm51bWJlcigpLm1pbigwKS5tYXgoMSkuZGVmYXVsdCgwLjUpLFxuICAgIH0pLFxuICApLFxuICBwcm9qZWN0czogei5hcnJheShcbiAgICB6Lm9iamVjdCh7XG4gICAgICBuYW1lOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICBkZXNjcmlwdGlvbjogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICAgICAgdXJsOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gICAgICB0ZWNobm9sb2dpZXM6IHouYXJyYXkoei5zdHJpbmcoKSkuZGVmYXVsdChbXSksXG4gICAgICBjb25maWRlbmNlOiB6Lm51bWJlcigpLm1pbigwKS5tYXgoMSkuZGVmYXVsdCgwLjUpLFxuICAgIH0pLFxuICApLFxufSk7XG5cbmV4cG9ydCB0eXBlIFJlc3VtZUV4dHJhY3Rpb25SZXN1bHQgPSB6LmluZmVyPFxuICB0eXBlb2YgcmVzdW1lRXh0cmFjdGlvblJlc3VsdFNjaGVtYVxuPjtcblxuZXhwb3J0IGNvbnN0IEVYVFJBQ1RPUl9WRVJTSU9OID0gXCJzZWFyY2hwYXJ0eS1yZXN1bWUtdjFcIjtcbiIsImltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5cbmV4cG9ydCBjb25zdCBqb2JQbGF0Zm9ybVNjaGVtYSA9IHouZW51bShbXG4gIFwiZ3JlZW5ob3VzZVwiLFxuICBcImxldmVyXCIsXG4gIFwiYXNoYnlcIixcbiAgXCJnZW5lcmljXCIsXG5dKTtcblxuZXhwb3J0IHR5cGUgSm9iUGxhdGZvcm0gPSB6LmluZmVyPHR5cGVvZiBqb2JQbGF0Zm9ybVNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBqb2JFeHRyYWN0aW9uSW5wdXRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHNvdXJjZVVybDogei5zdHJpbmcoKS51cmwoKSxcbiAgcGxhdGZvcm06IGpvYlBsYXRmb3JtU2NoZW1hLmRlZmF1bHQoXCJnZW5lcmljXCIpLFxuICBjb21wYW55OiB6LnN0cmluZygpLnRyaW0oKS5kZWZhdWx0KFwiXCIpLFxuICB0aXRsZTogei5zdHJpbmcoKS50cmltKCkuZGVmYXVsdChcIlwiKSxcbiAgbG9jYXRpb246IHouc3RyaW5nKCkudHJpbSgpLmRlZmF1bHQoXCJcIiksXG4gIGRlc2NyaXB0aW9uOiB6LnN0cmluZygpLnRyaW0oKS5kZWZhdWx0KFwiXCIpLFxuICByZXF1aXJlbWVudHM6IHouc3RyaW5nKCkudHJpbSgpLmRlZmF1bHQoXCJcIiksXG4gIGV4dHJhY3RvclZlcnNpb246IHouc3RyaW5nKCkudHJpbSgpLmRlZmF1bHQoXCJqb2ItZXh0cmFjdC12MVwiKSxcbiAgcmF3RXZpZGVuY2U6IHoucmVjb3JkKHouc3RyaW5nKCksIHoudW5rbm93bigpKS5kZWZhdWx0KHt9KSxcbn0pO1xuXG5leHBvcnQgdHlwZSBKb2JFeHRyYWN0aW9uSW5wdXQgPSB6LmluZmVyPHR5cGVvZiBqb2JFeHRyYWN0aW9uSW5wdXRTY2hlbWE+O1xuXG5leHBvcnQgY29uc3Qgam9iUG9zdGluZ1NjaGVtYSA9IGpvYkV4dHJhY3Rpb25JbnB1dFNjaGVtYS5leHRlbmQoe1xuICBpZDogei5zdHJpbmcoKSxcbiAgdXNlcklkOiB6LnN0cmluZygpLFxuICBjcmVhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbiAgdXBkYXRlZEF0OiB6LnN0cmluZygpLmRhdGV0aW1lKCksXG59KTtcblxuZXhwb3J0IHR5cGUgSm9iUG9zdGluZyA9IHouaW5mZXI8dHlwZW9mIGpvYlBvc3RpbmdTY2hlbWE+O1xuXG5leHBvcnQgY29uc3Qgam9iUG9zdGluZ3NSZXNwb25zZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgam9iczogei5hcnJheShqb2JQb3N0aW5nU2NoZW1hKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBKb2JQb3N0aW5nc1Jlc3BvbnNlID0gei5pbmZlcjx0eXBlb2Ygam9iUG9zdGluZ3NSZXNwb25zZVNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBKT0JfRVhUUkFDVE9SX1ZFUlNJT04gPSBcImpvYi1leHRyYWN0LXYxXCI7XG4iLCJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb25TdGF0dXNTY2hlbWEgPSB6LmVudW0oW1xuICBcInNhdmVkXCIsXG4gIFwic3RhcnRlZFwiLFxuICBcImFwcGxpZWRcIixcbiAgXCJpbnRlcnZpZXdpbmdcIixcbiAgXCJvZmZlclwiLFxuICBcInJlamVjdGVkXCIsXG4gIFwiYXJjaGl2ZWRcIixcbl0pO1xuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvblN0YXR1cyA9IHouaW5mZXI8dHlwZW9mIGFwcGxpY2F0aW9uU3RhdHVzU2NoZW1hPjtcblxuZXhwb3J0IGNvbnN0IGFwcGxpY2F0aW9uSW5wdXRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIHByb2ZpbGVJZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG4gIGpvYlBvc3RpbmdJZDogei5zdHJpbmcoKS5taW4oMSksXG4gIHJlc3VtZUlkOiB6LnN0cmluZygpLm51bGxhYmxlKCkub3B0aW9uYWwoKSxcbiAgc3RhdHVzOiBhcHBsaWNhdGlvblN0YXR1c1NjaGVtYS5kZWZhdWx0KFwic2F2ZWRcIiksXG4gIG5vdGVzOiB6LnN0cmluZygpLnRyaW0oKS5kZWZhdWx0KFwiXCIpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uSW5wdXQgPSB6LmluZmVyPHR5cGVvZiBhcHBsaWNhdGlvbklucHV0U2NoZW1hPjtcblxuZXhwb3J0IGNvbnN0IGFwcGxpY2F0aW9uVXBkYXRlU2NoZW1hID0gei5vYmplY3Qoe1xuICBzdGF0dXM6IGFwcGxpY2F0aW9uU3RhdHVzU2NoZW1hLm9wdGlvbmFsKCksXG4gIG5vdGVzOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLFxuICBwcm9maWxlSWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKS5vcHRpb25hbCgpLFxuICByZXN1bWVJZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG59KTtcblxuZXhwb3J0IHR5cGUgQXBwbGljYXRpb25VcGRhdGUgPSB6LmluZmVyPHR5cGVvZiBhcHBsaWNhdGlvblVwZGF0ZVNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBhcHBsaWNhdGlvblNjaGVtYSA9IHoub2JqZWN0KHtcbiAgaWQ6IHouc3RyaW5nKCksXG4gIHVzZXJJZDogei5zdHJpbmcoKSxcbiAgcHJvZmlsZUlkOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG4gIGpvYlBvc3RpbmdJZDogei5zdHJpbmcoKSxcbiAgcmVzdW1lSWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAgc3RhdHVzOiBhcHBsaWNhdGlvblN0YXR1c1NjaGVtYSxcbiAgbm90ZXM6IHouc3RyaW5nKCksXG4gIGNyZWF0ZWRBdDogei5zdHJpbmcoKS5kYXRldGltZSgpLFxuICB1cGRhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBBcHBsaWNhdGlvbiA9IHouaW5mZXI8dHlwZW9mIGFwcGxpY2F0aW9uU2NoZW1hPjtcblxuZXhwb3J0IGNvbnN0IGFwcGxpY2F0aW9uc1Jlc3BvbnNlU2NoZW1hID0gei5vYmplY3Qoe1xuICBhcHBsaWNhdGlvbnM6IHouYXJyYXkoYXBwbGljYXRpb25TY2hlbWEpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEFwcGxpY2F0aW9uc1Jlc3BvbnNlID0gei5pbmZlcjxcbiAgdHlwZW9mIGFwcGxpY2F0aW9uc1Jlc3BvbnNlU2NoZW1hXG4+O1xuXG4vKiogQWxsb3dlZCBmb3J3YXJkIHRyYW5zaXRpb25zIGZvciBhcHBsaWNhdGlvbiBzdGF0dXMgdXBkYXRlcy4gKi9cbmV4cG9ydCBjb25zdCBBUFBMSUNBVElPTl9TVEFUVVNfVFJBTlNJVElPTlM6IFJlY29yZDxcbiAgQXBwbGljYXRpb25TdGF0dXMsXG4gIFJlYWRvbmx5QXJyYXk8QXBwbGljYXRpb25TdGF0dXM+XG4+ID0ge1xuICBzYXZlZDogW1wic3RhcnRlZFwiLCBcImFwcGxpZWRcIiwgXCJhcmNoaXZlZFwiXSxcbiAgc3RhcnRlZDogW1wiYXBwbGllZFwiLCBcImFyY2hpdmVkXCJdLFxuICBhcHBsaWVkOiBbXCJpbnRlcnZpZXdpbmdcIiwgXCJyZWplY3RlZFwiLCBcIm9mZmVyXCIsIFwiYXJjaGl2ZWRcIl0sXG4gIGludGVydmlld2luZzogW1wib2ZmZXJcIiwgXCJyZWplY3RlZFwiLCBcImFyY2hpdmVkXCJdLFxuICBvZmZlcjogW1wiYXJjaGl2ZWRcIiwgXCJyZWplY3RlZFwiXSxcbiAgcmVqZWN0ZWQ6IFtcImFyY2hpdmVkXCJdLFxuICBhcmNoaXZlZDogW10sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2FuVHJhbnNpdGlvbkFwcGxpY2F0aW9uU3RhdHVzKFxuICBmcm9tOiBBcHBsaWNhdGlvblN0YXR1cyxcbiAgdG86IEFwcGxpY2F0aW9uU3RhdHVzLFxuKTogYm9vbGVhbiB7XG4gIGlmIChmcm9tID09PSB0bykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBBUFBMSUNBVElPTl9TVEFUVVNfVFJBTlNJVElPTlNbZnJvbV0uaW5jbHVkZXModG8pO1xufVxuIiwiaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlZERvY3VtZW50S2luZFNjaGVtYSA9IHouZW51bShbXG4gIFwiY292ZXJfbGV0dGVyXCIsXG4gIFwib3Blbl9lbmRlZF9hbnN3ZXJcIixcbl0pO1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVEb2N1bWVudElucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBraW5kOiBnZW5lcmF0ZWREb2N1bWVudEtpbmRTY2hlbWEuZGVmYXVsdChcImNvdmVyX2xldHRlclwiKSxcbiAgcHJvZmlsZUlkOiB6LnN0cmluZygpLm1pbigxKSxcbiAgam9iUG9zdGluZ0lkOiB6LnN0cmluZygpLm1pbigxKSxcbiAgLyoqIENvbmZpcm1lZCBldmlkZW5jZSBzdHJpbmdzIHRoZSBtb2RlbCBtYXkgdXNlIOKAlCBuZXZlciBpbnZlbnQgYmV5b25kIHRoZXNlLiAqL1xuICBldmlkZW5jZTogelxuICAgIC5hcnJheShcbiAgICAgIHoub2JqZWN0KHtcbiAgICAgICAgaWQ6IHouc3RyaW5nKCksXG4gICAgICAgIGxhYmVsOiB6LnN0cmluZygpLFxuICAgICAgICB2YWx1ZTogei5zdHJpbmcoKS5taW4oMSksXG4gICAgICB9KSxcbiAgICApXG4gICAgLm1pbigxKSxcbiAgcXVlc3Rpb246IHouc3RyaW5nKCkudHJpbSgpLm9wdGlvbmFsKCksXG4gIHRvbmU6IHouZW51bShbXCJwcm9mZXNzaW9uYWxcIiwgXCJjb25maWRlbnRcIiwgXCJmcmllbmRseVwiXSkuZGVmYXVsdChcInByb2Zlc3Npb25hbFwiKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBHZW5lcmF0ZURvY3VtZW50SW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgZ2VuZXJhdGVEb2N1bWVudElucHV0U2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVkRG9jdW1lbnRTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICB1c2VySWQ6IHouc3RyaW5nKCksXG4gIHByb2ZpbGVJZDogei5zdHJpbmcoKS5udWxsYWJsZSgpLFxuICBqb2JQb3N0aW5nSWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbiAga2luZDogZ2VuZXJhdGVkRG9jdW1lbnRLaW5kU2NoZW1hLFxuICBjb250ZW50OiB6LnN0cmluZygpLFxuICBzdGF0dXM6IHouZW51bShbXCJkcmFmdFwiLCBcImNvbmZpcm1lZFwiLCBcInJlamVjdGVkXCJdKSxcbiAgZXZpZGVuY2VKc29uOiB6Lm9iamVjdCh7XG4gICAgZmFjdElkczogei5hcnJheSh6LnN0cmluZygpKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICB9KSxcbiAgbW9kZWw6IHouc3RyaW5nKCksXG4gIHByb21wdFZlcnNpb246IHouc3RyaW5nKCksXG4gIGNyZWF0ZWRBdDogei5zdHJpbmcoKS5kYXRldGltZSgpLFxuICB1cGRhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbiAgYXBwcm92ZWRBdDogei5zdHJpbmcoKS5kYXRldGltZSgpLm51bGxhYmxlKCksXG59KTtcblxuZXhwb3J0IHR5cGUgR2VuZXJhdGVkRG9jdW1lbnQgPSB6LmluZmVyPHR5cGVvZiBnZW5lcmF0ZWREb2N1bWVudFNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBhcHByb3ZlR2VuZXJhdGVkRG9jdW1lbnRJbnB1dFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgYWN0aW9uOiB6LmVudW0oW1wiYXBwcm92ZVwiLCBcInJlamVjdFwiLCBcImVkaXRcIl0pLFxuICBjb250ZW50OiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG59KTtcblxuZXhwb3J0IGNvbnN0IEdFTkVSQVRJT05fUFJPTVBUX1ZFUlNJT04gPSBcImV2aWRlbmNlLWJvdW5kLXYxXCI7XG5cbi8qKlxuICogVmFsaWRhdGVzIHRoYXQgZ2VuZXJhdGVkIG5hcnJhdGl2ZSBjb250ZW50IGRvZXMgbm90IGludHJvZHVjZSB0b2tlbnMgdGhhdFxuICogbG9vayBsaWtlIGludmVudGVkIGVtcGxveWVycy9zY2hvb2xzIG91dHNpZGUgdGhlIHN1cHBsaWVkIGV2aWRlbmNlIHNldC5cbiAqIFRoaXMgaXMgYSBjb25zZXJ2YXRpdmUgZ3VhcmQsIG5vdCBhIGNvbXBsZXRlIE5MUCBzb2x1dGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydE5vSW52ZW50ZWRFbnRpdGllcyhpbnB1dDoge1xuICBjb250ZW50OiBzdHJpbmc7XG4gIGV2aWRlbmNlVmFsdWVzOiBzdHJpbmdbXTtcbiAgYmFubmVkVG9rZW5zPzogc3RyaW5nW107XG59KTogeyBvazogdHJ1ZSB9IHwgeyBvazogZmFsc2U7IHJlYXNvbjogc3RyaW5nIH0ge1xuICBjb25zdCBiYW5uZWQgPSBpbnB1dC5iYW5uZWRUb2tlbnMgPz8gW107XG4gIGNvbnN0IGhheXN0YWNrID0gaW5wdXQuZXZpZGVuY2VWYWx1ZXMuam9pbihcIlxcblwiKS50b0xvd2VyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IHRva2VuIG9mIGJhbm5lZCkge1xuICAgIGNvbnN0IG5lZWRsZSA9IHRva2VuLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghbmVlZGxlKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgaW5wdXQuY29udGVudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKG5lZWRsZSkgJiZcbiAgICAgICFoYXlzdGFjay5pbmNsdWRlcyhuZWVkbGUpXG4gICAgKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvazogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogYEdlbmVyYXRlZCB0ZXh0IG1lbnRpb25zIFwiJHt0b2tlbn1cIiB3aGljaCBpcyBub3QgaW4gdGhlIHN1cHBsaWVkIGV2aWRlbmNlLmAsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBvazogdHJ1ZSB9O1xufVxuXG4vKipcbiAqIERldGVybWluaXN0aWMgZXZpZGVuY2UtYm91bmQgZHJhZnQgdXNlZCB3aGVuIG5vIG1vZGVsIHByb3ZpZGVyIGlzIGNvbmZpZ3VyZWQuXG4gKiBPbmx5IGNvbmNhdGVuYXRlcyBjb25maXJtZWQgZXZpZGVuY2Ug4oCUIG5ldmVyIGludmVudHMgcGVyc29uYWwgZmFjdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEV2aWRlbmNlQm91bmREcmFmdChpbnB1dDoge1xuICBraW5kOiBcImNvdmVyX2xldHRlclwiIHwgXCJvcGVuX2VuZGVkX2Fuc3dlclwiO1xuICBjb21wYW55OiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHRvbmU6IFwicHJvZmVzc2lvbmFsXCIgfCBcImNvbmZpZGVudFwiIHwgXCJmcmllbmRseVwiO1xuICBldmlkZW5jZTogQXJyYXk8eyBsYWJlbDogc3RyaW5nOyB2YWx1ZTogc3RyaW5nIH0+O1xuICBxdWVzdGlvbj86IHN0cmluZztcbn0pOiBzdHJpbmcge1xuICBjb25zdCBpbnRybyA9XG4gICAgaW5wdXQua2luZCA9PT0gXCJjb3Zlcl9sZXR0ZXJcIlxuICAgICAgPyBgSSBhbSB3cml0aW5nIHRvIGV4cHJlc3MgaW50ZXJlc3QgaW4gdGhlICR7aW5wdXQudGl0bGUgfHwgXCJyb2xlXCJ9IGF0ICR7aW5wdXQuY29tcGFueSB8fCBcInlvdXIgY29tcGFueVwifS5gXG4gICAgICA6IGBSZWdhcmRpbmc6ICR7aW5wdXQucXVlc3Rpb24/LnRyaW0oKSB8fCBcInlvdXIgcXVlc3Rpb25cIn1gO1xuXG4gIGNvbnN0IGJ1bGxldHMgPSBpbnB1dC5ldmlkZW5jZVxuICAgIC5tYXAoKGl0ZW0pID0+IGAtICR7aXRlbS5sYWJlbH06ICR7aXRlbS52YWx1ZX1gKVxuICAgIC5qb2luKFwiXFxuXCIpO1xuXG4gIGNvbnN0IGNsb3NpbmcgPVxuICAgIGlucHV0LnRvbmUgPT09IFwiY29uZmlkZW50XCJcbiAgICAgID8gXCJJIHdvdWxkIHdlbGNvbWUgdGhlIGNoYW5jZSB0byBjb250cmlidXRlIGltbWVkaWF0ZWx5LlwiXG4gICAgICA6IGlucHV0LnRvbmUgPT09IFwiZnJpZW5kbHlcIlxuICAgICAgICA/IFwiSSB3b3VsZCBsb3ZlIHRvIGRpc2N1c3MgaG93IEkgY2FuIGhlbHAuXCJcbiAgICAgICAgOiBcIlRoYW5rIHlvdSBmb3IgeW91ciBjb25zaWRlcmF0aW9uLlwiO1xuXG4gIHJldHVybiBbaW50cm8sIFwiXCIsIFwiRXZpZGVuY2UgZnJvbSBteSBjb25maXJtZWQgcHJvZmlsZTpcIiwgYnVsbGV0cywgXCJcIiwgY2xvc2luZ11cbiAgICAuZmlsdGVyKChsaW5lKSA9PiBsaW5lICE9PSB1bmRlZmluZWQpXG4gICAgLmpvaW4oXCJcXG5cIik7XG59XG4iLCJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuXG5leHBvcnQgY29uc3QgU0VBUkNIUEFSVFlfQVBQID0ge1xuICBuYW1lOiBcIlNlYXJjaFBhcnR5XCIsXG4gIHdlYkRldlVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDFcIixcbn0gYXMgY29uc3Q7XG5cbmV4cG9ydCBjb25zdCBoZWFsdGhTdGF0dXNTY2hlbWEgPSB6LmVudW0oW1wib2tcIl0pO1xuXG5leHBvcnQgY29uc3QgaGVhbHRoUmVzcG9uc2VTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGFwcDogei5saXRlcmFsKFNFQVJDSFBBUlRZX0FQUC5uYW1lKSxcbiAgc3RhdHVzOiBoZWFsdGhTdGF0dXNTY2hlbWEsXG4gIHRpbWVzdGFtcDogei5zdHJpbmcoKS5kYXRldGltZSgpLFxuICB2ZXJzaW9uOiB6LnN0cmluZygpLFxufSk7XG5cbmV4cG9ydCB0eXBlIEhlYWx0aFJlc3BvbnNlID0gei5pbmZlcjx0eXBlb2YgaGVhbHRoUmVzcG9uc2VTY2hlbWE+O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSGVhbHRoUmVzcG9uc2UodmVyc2lvbiA9IFwiMC4wLjBcIik6IEhlYWx0aFJlc3BvbnNlIHtcbiAgcmV0dXJuIGhlYWx0aFJlc3BvbnNlU2NoZW1hLnBhcnNlKHtcbiAgICBhcHA6IFNFQVJDSFBBUlRZX0FQUC5uYW1lLFxuICAgIHN0YXR1czogXCJva1wiLFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgIHZlcnNpb24sXG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgYXBwbGljYW50UHJvZmlsZVRvbmVTY2hlbWEgPSB6LmVudW0oW1xuICBcInByb2Zlc3Npb25hbFwiLFxuICBcImNvbmZpZGVudFwiLFxuICBcImZyaWVuZGx5XCIsXG5dKTtcblxuZXhwb3J0IHR5cGUgQXBwbGljYW50UHJvZmlsZVRvbmUgPSB6LmluZmVyPFxuICB0eXBlb2YgYXBwbGljYW50UHJvZmlsZVRvbmVTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCB3b3JrRXhwZXJpZW5jZUlucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBjb21wYW55OiB6LnN0cmluZygpLnRyaW0oKS5taW4oMSwgXCJDb21wYW55IGlzIHJlcXVpcmVkXCIpLFxuICB0aXRsZTogei5zdHJpbmcoKS50cmltKCkubWluKDEsIFwiVGl0bGUgaXMgcmVxdWlyZWRcIiksXG4gIHN0YXJ0RGF0ZTogei5zdHJpbmcoKS50cmltKCkubWluKDEsIFwiU3RhcnQgZGF0ZSBpcyByZXF1aXJlZFwiKSxcbiAgZW5kRGF0ZTogei5zdHJpbmcoKS50cmltKCkub3B0aW9uYWwoKS5kZWZhdWx0KFwiXCIpLFxuICBkZXNjcmlwdGlvbjogei5zdHJpbmcoKS50cmltKCkub3B0aW9uYWwoKS5kZWZhdWx0KFwiXCIpLFxuICB0ZWNobm9sb2dpZXM6IHouYXJyYXkoei5zdHJpbmcoKS50cmltKCkubWluKDEpKS5kZWZhdWx0KFtdKSxcbiAgYWNoaWV2ZW1lbnRzOiB6LmFycmF5KHouc3RyaW5nKCkudHJpbSgpLm1pbigxKSkuZGVmYXVsdChbXSksXG59KTtcblxuZXhwb3J0IGNvbnN0IHByb2ZpbGVTa2lsbElucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBuYW1lOiB6LnN0cmluZygpLnRyaW0oKS5taW4oMSwgXCJTa2lsbCBuYW1lIGlzIHJlcXVpcmVkXCIpLFxuICBjYXRlZ29yeTogei5zdHJpbmcoKS50cmltKCkubWluKDEsIFwiU2tpbGwgY2F0ZWdvcnkgaXMgcmVxdWlyZWRcIiksXG4gIHllYXJzT2ZFeHBlcmllbmNlOiB6LmNvZXJjZS5udW1iZXIoKS5taW4oMCkubWF4KDgwKS5kZWZhdWx0KDApLFxufSk7XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlUHJvamVjdElucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBuYW1lOiB6LnN0cmluZygpLnRyaW0oKS5taW4oMSwgXCJQcm9qZWN0IG5hbWUgaXMgcmVxdWlyZWRcIiksXG4gIGRlc2NyaXB0aW9uOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIHRlY2hub2xvZ2llczogei5hcnJheSh6LnN0cmluZygpLnRyaW0oKS5taW4oMSkpLmRlZmF1bHQoW10pLFxuICB1cmw6IHouc3RyaW5nKCkudHJpbSgpLnVybCgpLm9yKHoubGl0ZXJhbChcIlwiKSkuZGVmYXVsdChcIlwiKSxcbn0pO1xuXG5jb25zdCBvcHRpb25hbFVybCA9IHpcbiAgLnN0cmluZygpXG4gIC50cmltKClcbiAgLnVybCgpXG4gIC5vcih6LmxpdGVyYWwoXCJcIikpXG4gIC5vcHRpb25hbCgpXG4gIC5kZWZhdWx0KFwiXCIpO1xuXG4vKiogQXJiaXRyYXJ5IG9uYm9hcmRpbmcgYW5zd2VycyBrZXllZCBieSBwcm9maWxlLXF1ZXN0aW9uIGZpZWxkIGlkIChKU09OLXNhZmUpLiAqL1xuZXhwb3J0IGNvbnN0IHByb2ZpbGVPbmJvYXJkaW5nQW5zd2Vyc1NjaGVtYSA9IHoucmVjb3JkKFxuICB6LnN0cmluZygpLFxuICB6LnVua25vd24oKSxcbik7XG5cbmV4cG9ydCB0eXBlIFByb2ZpbGVPbmJvYXJkaW5nQW5zd2VycyA9IHouaW5mZXI8XG4gIHR5cGVvZiBwcm9maWxlT25ib2FyZGluZ0Fuc3dlcnNTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCBhY2NvdW50T25ib2FyZGluZ0lucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBhbnN3ZXJzOiBwcm9maWxlT25ib2FyZGluZ0Fuc3dlcnNTY2hlbWEsXG59KTtcblxuZXhwb3J0IHR5cGUgQWNjb3VudE9uYm9hcmRpbmdJbnB1dCA9IHouaW5mZXI8XG4gIHR5cGVvZiBhY2NvdW50T25ib2FyZGluZ0lucHV0U2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgYXBwbGljYW50UHJvZmlsZUlucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBuYW1lOiB6LnN0cmluZygpLnRyaW0oKS5taW4oMSwgXCJQcm9maWxlIG5hbWUgaXMgcmVxdWlyZWRcIiksXG4gIHRhcmdldFJvbGU6IHouc3RyaW5nKCkudHJpbSgpLm1pbigxLCBcIlRhcmdldCByb2xlIGlzIHJlcXVpcmVkXCIpLFxuICBzdW1tYXJ5OiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIHByZWZlcnJlZFRvbmU6IGFwcGxpY2FudFByb2ZpbGVUb25lU2NoZW1hLmRlZmF1bHQoXCJwcm9mZXNzaW9uYWxcIiksXG4gIGZpcnN0TmFtZTogei5zdHJpbmcoKS50cmltKCkub3B0aW9uYWwoKS5kZWZhdWx0KFwiXCIpLFxuICBsYXN0TmFtZTogei5zdHJpbmcoKS50cmltKCkub3B0aW9uYWwoKS5kZWZhdWx0KFwiXCIpLFxuICBwaG9uZTogei5zdHJpbmcoKS50cmltKCkub3B0aW9uYWwoKS5kZWZhdWx0KFwiXCIpLFxuICBhZGRyZXNzOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIGxpbmtlZGluVXJsOiBvcHRpb25hbFVybCxcbiAgZ2l0aHViVXJsOiBvcHRpb25hbFVybCxcbiAgcG9ydGZvbGlvVXJsOiBvcHRpb25hbFVybCxcbiAgb25ib2FyZGluZ0Fuc3dlcnM6IHByb2ZpbGVPbmJvYXJkaW5nQW5zd2Vyc1NjaGVtYS5kZWZhdWx0KHt9KSxcbiAgd29ya0V4cGVyaWVuY2VzOiB6LmFycmF5KHdvcmtFeHBlcmllbmNlSW5wdXRTY2hlbWEpLmRlZmF1bHQoW10pLFxuICBza2lsbHM6IHouYXJyYXkocHJvZmlsZVNraWxsSW5wdXRTY2hlbWEpLmRlZmF1bHQoW10pLFxuICBwcm9qZWN0czogei5hcnJheShwcm9maWxlUHJvamVjdElucHV0U2NoZW1hKS5kZWZhdWx0KFtdKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBBcHBsaWNhbnRQcm9maWxlSW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgYXBwbGljYW50UHJvZmlsZUlucHV0U2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgYXBwbGljYW50UHJvZmlsZVVwZGF0ZVNjaGVtYSA9XG4gIGFwcGxpY2FudFByb2ZpbGVJbnB1dFNjaGVtYS5wYXJ0aWFsKCk7XG5cbmV4cG9ydCB0eXBlIEFwcGxpY2FudFByb2ZpbGVVcGRhdGUgPSB6LmluZmVyPFxuICB0eXBlb2YgYXBwbGljYW50UHJvZmlsZVVwZGF0ZVNjaGVtYVxuPjtcblxuZXhwb3J0IGNvbnN0IHdvcmtFeHBlcmllbmNlU2NoZW1hID0gd29ya0V4cGVyaWVuY2VJbnB1dFNjaGVtYS5leHRlbmQoe1xuICBpZDogei5zdHJpbmcoKSxcbiAgcHJvZmlsZUlkOiB6LnN0cmluZygpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlU2tpbGxTY2hlbWEgPSBwcm9maWxlU2tpbGxJbnB1dFNjaGVtYS5leHRlbmQoe1xuICBpZDogei5zdHJpbmcoKSxcbiAgcHJvZmlsZUlkOiB6LnN0cmluZygpLFxufSk7XG5cbmV4cG9ydCBjb25zdCBwcm9maWxlUHJvamVjdFNjaGVtYSA9IHByb2ZpbGVQcm9qZWN0SW5wdXRTY2hlbWEuZXh0ZW5kKHtcbiAgaWQ6IHouc3RyaW5nKCksXG4gIHByb2ZpbGVJZDogei5zdHJpbmcoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgYXBwbGljYW50UHJvZmlsZVNjaGVtYSA9IHoub2JqZWN0KHtcbiAgaWQ6IHouc3RyaW5nKCksXG4gIHVzZXJJZDogei5zdHJpbmcoKSxcbiAgbmFtZTogei5zdHJpbmcoKSxcbiAgdGFyZ2V0Um9sZTogei5zdHJpbmcoKSxcbiAgc3VtbWFyeTogei5zdHJpbmcoKSxcbiAgcHJlZmVycmVkVG9uZTogYXBwbGljYW50UHJvZmlsZVRvbmVTY2hlbWEsXG4gIGZpcnN0TmFtZTogei5zdHJpbmcoKSxcbiAgbGFzdE5hbWU6IHouc3RyaW5nKCksXG4gIHBob25lOiB6LnN0cmluZygpLFxuICBhZGRyZXNzOiB6LnN0cmluZygpLFxuICBsaW5rZWRpblVybDogei5zdHJpbmcoKSxcbiAgZ2l0aHViVXJsOiB6LnN0cmluZygpLFxuICBwb3J0Zm9saW9Vcmw6IHouc3RyaW5nKCksXG4gIG9uYm9hcmRpbmdBbnN3ZXJzOiBwcm9maWxlT25ib2FyZGluZ0Fuc3dlcnNTY2hlbWEsXG4gIGNyZWF0ZWRBdDogei5zdHJpbmcoKS5kYXRldGltZSgpLFxuICB1cGRhdGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKSxcbiAgd29ya0V4cGVyaWVuY2VzOiB6LmFycmF5KHdvcmtFeHBlcmllbmNlU2NoZW1hKSxcbiAgc2tpbGxzOiB6LmFycmF5KHByb2ZpbGVTa2lsbFNjaGVtYSksXG4gIHByb2plY3RzOiB6LmFycmF5KHByb2ZpbGVQcm9qZWN0U2NoZW1hKSxcbn0pO1xuXG5leHBvcnQgdHlwZSBBcHBsaWNhbnRQcm9maWxlID0gei5pbmZlcjx0eXBlb2YgYXBwbGljYW50UHJvZmlsZVNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBhcHBsaWNhbnRQcm9maWxlc1Jlc3BvbnNlU2NoZW1hID0gei5vYmplY3Qoe1xuICBwcm9maWxlczogei5hcnJheShhcHBsaWNhbnRQcm9maWxlU2NoZW1hKSxcbiAgYWN0aXZlUHJvZmlsZUlkOiB6LnN0cmluZygpLm51bGxhYmxlKCksXG59KTtcblxuZXhwb3J0IHR5cGUgQXBwbGljYW50UHJvZmlsZXNSZXNwb25zZSA9IHouaW5mZXI8XG4gIHR5cGVvZiBhcHBsaWNhbnRQcm9maWxlc1Jlc3BvbnNlU2NoZW1hXG4+O1xuXG5leHBvcnQgY29uc3QgYWN0aXZlQXBwbGljYW50UHJvZmlsZUlucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBwcm9maWxlSWQ6IHouc3RyaW5nKCkubnVsbGFibGUoKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgY3VycmVudFVzZXJTY2hlbWEgPSB6Lm9iamVjdCh7XG4gIGlkOiB6LnN0cmluZygpLFxuICBlbWFpbDogei5zdHJpbmcoKS5lbWFpbCgpLFxuICBuYW1lOiB6LnN0cmluZygpLFxuICBpbWFnZTogei5zdHJpbmcoKS5udWxsYWJsZSgpLm9wdGlvbmFsKCksXG59KTtcblxuZXhwb3J0IHR5cGUgQ3VycmVudFVzZXIgPSB6LmluZmVyPHR5cGVvZiBjdXJyZW50VXNlclNjaGVtYT47XG5cbmV4cG9ydCBjb25zdCBjdXJyZW50VXNlclJlc3BvbnNlU2NoZW1hID0gei5vYmplY3Qoe1xuICB1c2VyOiBjdXJyZW50VXNlclNjaGVtYSxcbn0pO1xuXG5leHBvcnQgdHlwZSBDdXJyZW50VXNlclJlc3BvbnNlID0gei5pbmZlcjxcbiAgdHlwZW9mIGN1cnJlbnRVc2VyUmVzcG9uc2VTY2hlbWFcbj47XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVDdXJyZW50VXNlcklucHV0U2NoZW1hID0gei5vYmplY3Qoe1xuICBuYW1lOiB6LnN0cmluZygpLnRyaW0oKS5taW4oMSwgXCJOYW1lIGlzIHJlcXVpcmVkXCIpLFxufSk7XG5cbmV4cG9ydCB0eXBlIFVwZGF0ZUN1cnJlbnRVc2VySW5wdXQgPSB6LmluZmVyPFxuICB0eXBlb2YgdXBkYXRlQ3VycmVudFVzZXJJbnB1dFNjaGVtYVxuPjtcblxuZXhwb3J0IGNvbnN0IGN1c3RvbVVybFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgbGFiZWw6IHouc3RyaW5nKCkudHJpbSgpLm1pbigxLCBcIkxhYmVsIGlzIHJlcXVpcmVkXCIpLFxuICB1cmw6IHouc3RyaW5nKCkudHJpbSgpLnVybChcIk11c3QgYmUgYSB2YWxpZCBVUkxcIiksXG59KTtcblxuZXhwb3J0IHR5cGUgQ3VzdG9tVXJsID0gei5pbmZlcjx0eXBlb2YgY3VzdG9tVXJsU2NoZW1hPjtcblxuZXhwb3J0IGNvbnN0IGFjY291bnRTZXR1cFNjaGVtYSA9IHoub2JqZWN0KHtcbiAgZmlyc3ROYW1lOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIGxhc3ROYW1lOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIHBob25lOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIGFkZHJlc3NTdHJlZXQ6IHouc3RyaW5nKCkudHJpbSgpLm9wdGlvbmFsKCkuZGVmYXVsdChcIlwiKSxcbiAgYWRkcmVzc1N0YXRlOiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIGFkZHJlc3NDaXR5OiB6LnN0cmluZygpLnRyaW0oKS5vcHRpb25hbCgpLmRlZmF1bHQoXCJcIiksXG4gIGFkZHJlc3NaaXA6IHouc3RyaW5nKCkudHJpbSgpLm9wdGlvbmFsKCkuZGVmYXVsdChcIlwiKSxcbiAgYWRkcmVzc1VuaXQ6IHouc3RyaW5nKCkudHJpbSgpLm9wdGlvbmFsKCkuZGVmYXVsdChcIlwiKSxcbiAgdXJsczogei5hcnJheShjdXN0b21VcmxTY2hlbWEpLmRlZmF1bHQoW10pLFxufSk7XG5cbmV4cG9ydCB0eXBlIEFjY291bnRTZXR1cCA9IHouaW5mZXI8dHlwZW9mIGFjY291bnRTZXR1cFNjaGVtYT47XG5cbi8qKiBTZXJ2ZXIgR0VUIGAvYXBpL2FjY291bnRgIOKAlCBlZGl0YWJsZSBmaWVsZHMgcGx1cyBvbmUtdGltZSBvbmJvYXJkaW5nIHN0YXRlLiAqL1xuZXhwb3J0IGNvbnN0IGFjY291bnRTZXR1cFJlc3BvbnNlU2NoZW1hID0gYWNjb3VudFNldHVwU2NoZW1hLmV4dGVuZCh7XG4gIGFjY291bnRPbmJvYXJkaW5nQ29tcGxldGVkQXQ6IHouc3RyaW5nKCkuZGF0ZXRpbWUoKS5udWxsYWJsZSgpLFxuICBhY2NvdW50T25ib2FyZGluZ0Fuc3dlcnM6IHByb2ZpbGVPbmJvYXJkaW5nQW5zd2Vyc1NjaGVtYSxcbn0pO1xuXG5leHBvcnQgdHlwZSBBY2NvdW50U2V0dXBSZXNwb25zZSA9IHouaW5mZXI8dHlwZW9mIGFjY291bnRTZXR1cFJlc3BvbnNlU2NoZW1hPjtcblxuZXhwb3J0ICogZnJvbSBcIi4vcmVzdW1lLWRvY3VtZW50c1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vcmVzdW1lLXByZXNpZ25lZC11cGxvYWRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3Jlc3VtZS1leHRyYWN0aW9uXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9yZXN1bWUtZXh0cmFjdC10ZXh0XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9hdXRvZmlsbC9pbmRleFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vYW5zd2Vycy9pbmRleFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vam9icy9pbmRleFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vYXBwbGljYXRpb25zL2luZGV4XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9nZW5lcmF0aW9uL2luZGV4XCI7XG5leHBvcnQgKiBmcm9tIFwiLi9tZXRyaWNzL2F1dG9maWxsLW1ldHJpY3NcIjtcbiIsImltcG9ydCB7XG4gIGFwcGx5UGFuZWxPcGVuQmVoYXZpb3IsXG4gIGV4dGVuc2lvblByZWZlcmVuY2VNZXNzYWdlVHlwZSxcbn0gZnJvbSBcIkAvbGliL2V4dGVuc2lvbi1wcmVmZXJlbmNlc1wiO1xuaW1wb3J0IHsgZXh0ZW5zaW9uRGVidWdBZ2VudExvZ01lc3NhZ2VUeXBlIH0gZnJvbSBcIkAvbGliL2FnZW50LWRlYnVnLWxvZ1wiO1xuaW1wb3J0IHtcbiAgZXh0ZW5zaW9uRmV0Y2hCbG9iTWVzc2FnZVR5cGUsXG4gIHR5cGUgRXh0ZW5zaW9uRmV0Y2hCbG9iTWVzc2FnZSxcbiAgdHlwZSBFeHRlbnNpb25GZXRjaEJsb2JSZXNwb25zZSxcbn0gZnJvbSBcIkAvbGliL2V4dGVuc2lvbi1mZXRjaC1ibG9iXCI7XG5pbXBvcnQge1xuICBleHRlbnNpb25NYWluV29ybGRBc3NpZ25GaWxlTWVzc2FnZVR5cGUsXG4gIHR5cGUgRXh0ZW5zaW9uTWFpbldvcmxkQXNzaWduRmlsZU1lc3NhZ2UsXG59IGZyb20gXCJAL2xpYi9leHRlbnNpb24tbWFpbi13b3JsZC1hc3NpZ25cIjtcbmltcG9ydCB7IFJFU1VNRV9BVVRPRklMTF9NQVhfQllURVMgfSBmcm9tIFwiQHNlYXJjaHBhcnR5L3NoYXJlZFwiO1xuXG5jb25zdCBERUJVR19JTkdFU1RfVVJMID1cbiAgXCJodHRwOi8vMTI3LjAuMC4xOjc1MzkvaW5nZXN0LzBhOGU5NzQ2LTExY2EtNDNkOS04YjI2LWI4MjY1ZTBiZTFhOFwiO1xuY29uc3QgREVCVUdfU0VTU0lPTiA9IFwiMjEwODgzXCI7XG5cbi8qKlxuICogSW5qZWN0ZWQgaW50byB0aGUgcGFnZSAqKk1BSU4qKiB3b3JsZCBzbyBwYWdlIEpTIChSZWFjdCwgQVRTIHdpZGdldHMpIG9ic2VydmVzXG4gKiBgSFRNTElucHV0RWxlbWVudC5maWxlc2AgYW5kIGJ1YmJsaW5nIGV2ZW50cy4gTXVzdCBzdGF5IHNlbGYtY29udGFpbmVkLlxuICovXG5mdW5jdGlvbiBzZWFyY2hQYXJ0eU1haW5Xb3JsZEFzc2lnblJlc3VtZShhcmc6IHtcbiAgc2VsZWN0b3I6IHN0cmluZztcbiAgYnVmZmVyOiB1bmtub3duO1xuICBmaWxlTmFtZTogc3RyaW5nO1xuICBtaW1lVHlwZTogc3RyaW5nO1xufSk6IHtcbiAgb2s6IGJvb2xlYW47XG4gIHJlYXNvbj86IHN0cmluZztcbiAgZmlsZXNMZW4/OiBudW1iZXI7XG59IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFyZy5zZWxlY3Rvcik7XG4gIGlmICghZWwgfHwgIShlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogXCJUYWdnZWQgZmllbGQgd2FzIG5vdCBmb3VuZCBvciBpcyBub3QgYW4gaW5wdXQuXCIsXG4gICAgICBmaWxlc0xlbjogMCxcbiAgICB9O1xuICB9XG4gIGlmIChlbC50eXBlICE9PSBcImZpbGVcIikge1xuICAgIHJldHVybiB7XG4gICAgICBvazogZmFsc2UsXG4gICAgICByZWFzb246IFwiVGFnZ2VkIGlucHV0IGlzIG5vdCB0eXBlPWZpbGUuXCIsXG4gICAgICBmaWxlc0xlbjogMCxcbiAgICB9O1xuICB9XG4gIGxldCBieXRlczogVWludDhBcnJheTtcbiAgY29uc3QgcmF3QnVmID0gYXJnLmJ1ZmZlcjtcbiAgaWYgKHJhd0J1ZiBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgYnl0ZXMgPSBuZXcgVWludDhBcnJheShyYXdCdWYpO1xuICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhyYXdCdWYpKSB7XG4gICAgY29uc3QgdiA9IHJhd0J1ZiBhcyBBcnJheUJ1ZmZlclZpZXc7XG4gICAgYnl0ZXMgPSBuZXcgVWludDhBcnJheShcbiAgICAgIHYuYnVmZmVyLnNsaWNlKHYuYnl0ZU9mZnNldCwgdi5ieXRlT2Zmc2V0ICsgdi5ieXRlTGVuZ3RoKSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBvazogZmFsc2UsXG4gICAgICByZWFzb246IFwiSW52YWxpZCByw6lzdW3DqSBieXRlIHBheWxvYWQuXCIsXG4gICAgICBmaWxlc0xlbjogMCxcbiAgICB9O1xuICB9XG4gIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShcbiAgICBbbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpXSxcbiAgICBhcmcuZmlsZU5hbWUsXG4gICAge1xuICAgICAgdHlwZTogYXJnLm1pbWVUeXBlIHx8IFwiYXBwbGljYXRpb24vcGRmXCIsXG4gICAgfSxcbiAgKTtcbiAgY29uc3QgZHQgPSBuZXcgRGF0YVRyYW5zZmVyKCk7XG4gIGR0Lml0ZW1zLmFkZChmaWxlKTtcbiAgZWwuZmlsZXMgPSBkdC5maWxlcztcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImJsdXJcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgY29uc3QgZmlsZXNMZW4gPSBlbC5maWxlcz8ubGVuZ3RoID8/IDA7XG4gIHJldHVybiB7XG4gICAgb2s6IGZpbGVzTGVuID09PSAxLFxuICAgIHJlYXNvbjpcbiAgICAgIGZpbGVzTGVuID09PSAxXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogXCJUaGUgZmlsZSBpbnB1dCBkaWQgbm90IGFjY2VwdCB0aGUgYXR0YWNobWVudC5cIixcbiAgICBmaWxlc0xlbixcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG4gIHZvaWQgYXBwbHlQYW5lbE9wZW5CZWhhdmlvcigpO1xuXG4gIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgdm9pZCBhcHBseVBhbmVsT3BlbkJlaGF2aW9yKCk7XG4gIH0pO1xuXG4gIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gICAgKFxuICAgICAgbWVzc2FnZTogdW5rbm93bixcbiAgICAgIHNlbmRlcixcbiAgICAgIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlPzogdW5rbm93bikgPT4gdm9pZCxcbiAgICApID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIG1lc3NhZ2UgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgbWVzc2FnZSAhPT0gbnVsbCAmJlxuICAgICAgICBcInR5cGVcIiBpbiBtZXNzYWdlICYmXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9PT0gZXh0ZW5zaW9uUHJlZmVyZW5jZU1lc3NhZ2VUeXBlXG4gICAgICApIHtcbiAgICAgICAgdm9pZCBhcHBseVBhbmVsT3BlbkJlaGF2aW9yKCk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgIG1lc3NhZ2UgIT09IG51bGwgJiZcbiAgICAgICAgXCJ0eXBlXCIgaW4gbWVzc2FnZSAmJlxuICAgICAgICBtZXNzYWdlLnR5cGUgPT09IGV4dGVuc2lvbkRlYnVnQWdlbnRMb2dNZXNzYWdlVHlwZVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBtZXNzYWdlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICAgICAgICB2b2lkIGZldGNoKERFQlVHX0lOR0VTVF9VUkwsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgXCJYLURlYnVnLVNlc3Npb24tSWRcIjogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHNlc3Npb25JZDogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBtZXNzYWdlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgIG1lc3NhZ2UgIT09IG51bGwgJiZcbiAgICAgICAgXCJ0eXBlXCIgaW4gbWVzc2FnZSAmJlxuICAgICAgICBtZXNzYWdlLnR5cGUgPT09IGV4dGVuc2lvbkZldGNoQmxvYk1lc3NhZ2VUeXBlICYmXG4gICAgICAgIFwidXJsXCIgaW4gbWVzc2FnZSAmJlxuICAgICAgICB0eXBlb2YgKG1lc3NhZ2UgYXMgRXh0ZW5zaW9uRmV0Y2hCbG9iTWVzc2FnZSkudXJsID09PSBcInN0cmluZ1wiXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdXJsID0gKG1lc3NhZ2UgYXMgRXh0ZW5zaW9uRmV0Y2hCbG9iTWVzc2FnZSkudXJsLnRyaW0oKTtcbiAgICAgICAgaWYgKCEvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KHVybCkpIHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IFwiT25seSBodHRwKHMpIGRvd25sb2FkIFVSTHMgYXJlIGFsbG93ZWQuXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2b2lkIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgbGV0IGhvc3QgPSBcIlwiO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBob3N0ID0gbmV3IFVSTCh1cmwpLmhvc3RuYW1lO1xuICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgaG9zdCA9IFwiKGludmFsaWQpXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBIVFRQICR7U3RyaW5nKHJlcy5zdGF0dXMpfWAsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsZW5IZWFkZXIgPSByZXMuaGVhZGVycy5nZXQoXCJjb250ZW50LWxlbmd0aFwiKTtcbiAgICAgICAgICAgIGlmIChsZW5IZWFkZXIpIHtcbiAgICAgICAgICAgICAgY29uc3QgbiA9IE51bWJlcihsZW5IZWFkZXIpO1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgTnVtYmVyLmlzRmluaXRlKG4pICYmXG4gICAgICAgICAgICAgICAgbiA+IFJFU1VNRV9BVVRPRklMTF9NQVhfQllURVNcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIGVycm9yOiBcIlLDqXN1bcOpIGV4Y2VlZHMgdGhlIGF1dG9maWxsIHNpemUgbGltaXQuXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgICAgIGlmIChidWZmZXIuYnl0ZUxlbmd0aCA+IFJFU1VNRV9BVVRPRklMTF9NQVhfQllURVMpIHtcbiAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IFwiUsOpc3Vtw6kgZXhjZWVkcyB0aGUgYXV0b2ZpbGwgc2l6ZSBsaW1pdC5cIixcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID1cbiAgICAgICAgICAgICAgcmVzLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpPy5zcGxpdChcIjtcIilbMF0/LnRyaW0oKSA/P1xuICAgICAgICAgICAgICBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiO1xuICAgICAgICAgICAgdm9pZCBmZXRjaChERUJVR19JTkdFU1RfVVJMLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICBcIlgtRGVidWctU2Vzc2lvbi1JZFwiOiBERUJVR19TRVNTSU9OLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBERUJVR19TRVNTSU9OLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBoeXBvdGhlc2lzSWQ6IFwiSC1iZy1mZXRjaFwiLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBcImJhY2tncm91bmQudHM6ZmV0Y2gtYmxvYlwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQmFja2dyb3VuZCBmZXRjaCByZXN1bWUgb2tcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICBob3N0LFxuICAgICAgICAgICAgICAgICAgYnl0ZXM6IGJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgY29udGVudFR5cGUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgICAgY29udGVudFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgICAgICAgICAgY29uc3QgZXJyTXNnID1cbiAgICAgICAgICAgICAgZXJyb3IgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgICAgICAgID8gZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgICAgIDogU3RyaW5nKGVycm9yKTtcbiAgICAgICAgICAgIHZvaWQgZmV0Y2goREVCVUdfSU5HRVNUX1VSTCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJYLURlYnVnLVNlc3Npb24tSWRcIjogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHNlc3Npb25JZDogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgaHlwb3RoZXNpc0lkOiBcIkgtYmctZmV0Y2gtZXJyXCIsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IFwiYmFja2dyb3VuZC50czpmZXRjaC1ibG9iXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCYWNrZ3JvdW5kIGZldGNoIHJlc3VtZSBmYWlsZWRcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGhvc3QsIGVyck1zZyB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnJNc2csXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgbWVzc2FnZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICBtZXNzYWdlICE9PSBudWxsICYmXG4gICAgICAgIFwidHlwZVwiIGluIG1lc3NhZ2UgJiZcbiAgICAgICAgbWVzc2FnZS50eXBlID09PSBleHRlbnNpb25NYWluV29ybGRBc3NpZ25GaWxlTWVzc2FnZVR5cGUgJiZcbiAgICAgICAgXCJzZWxlY3RvclwiIGluIG1lc3NhZ2UgJiZcbiAgICAgICAgXCJidWZmZXJcIiBpbiBtZXNzYWdlICYmXG4gICAgICAgIFwiZmlsZU5hbWVcIiBpbiBtZXNzYWdlICYmXG4gICAgICAgIFwibWltZVR5cGVcIiBpbiBtZXNzYWdlXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgdGFiSWQgPSBzZW5kZXIudGFiPy5pZDtcbiAgICAgICAgaWYgKHRhYklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3I6IFwiTm8gc2VuZGVyIHRhYiBmb3IgTUFJTi13b3JsZCBhc3NpZ24uXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gbWVzc2FnZSBhcyBFeHRlbnNpb25NYWluV29ybGRBc3NpZ25GaWxlTWVzc2FnZTtcbiAgICAgICAgdm9pZCAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBpbmplY3RlZCA9XG4gICAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgICAgICAgICAgICAgIHRhcmdldDogeyB0YWJJZCB9LFxuICAgICAgICAgICAgICAgIHdvcmxkOiBcIk1BSU5cIixcbiAgICAgICAgICAgICAgICBmdW5jOiBzZWFyY2hQYXJ0eU1haW5Xb3JsZEFzc2lnblJlc3VtZSxcbiAgICAgICAgICAgICAgICBhcmdzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBwYXlsb2FkLnNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICBidWZmZXI6IHBheWxvYWQuYnVmZmVyLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogcGF5bG9hZC5maWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbWltZVR5cGU6IHBheWxvYWQubWltZVR5cGUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5qZWN0ZWRbMF0/LnJlc3VsdCBhc1xuICAgICAgICAgICAgICB8IFJldHVyblR5cGU8dHlwZW9mIHNlYXJjaFBhcnR5TWFpbldvcmxkQXNzaWduUmVzdW1lPlxuICAgICAgICAgICAgICB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHZvaWQgZmV0Y2goREVCVUdfSU5HRVNUX1VSTCwge1xuICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJYLURlYnVnLVNlc3Npb24tSWRcIjogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHNlc3Npb25JZDogREVCVUdfU0VTU0lPTixcbiAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICAgICAgaHlwb3RoZXNpc0lkOiBcIkgtbWFpbi13b3JsZC1leGVjXCIsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IFwiYmFja2dyb3VuZC50czptYWluLXdvcmxkLWFzc2lnblwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTUFJTiB3b3JsZCByZXN1bWUgYXNzaWduIGZpbmlzaGVkXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgb2s6IHJlc3VsdD8ub2sgPz8gZmFsc2UsXG4gICAgICAgICAgICAgICAgICBmaWxlc0xlbjogcmVzdWx0Py5maWxlc0xlbixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQgPz8ge1xuICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZWFzb246IFwiTm8gaW5qZWN0aW9uIHJlc3VsdC5cIixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJNc2cgPVxuICAgICAgICAgICAgICBlcnJvciBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgICAgICAgICAgPyBlcnJvci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgOiBTdHJpbmcoZXJyb3IpO1xuICAgICAgICAgICAgdm9pZCBmZXRjaChERUJVR19JTkdFU1RfVVJMLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICBcIlgtRGVidWctU2Vzc2lvbi1JZFwiOiBERUJVR19TRVNTSU9OLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbklkOiBERUJVR19TRVNTSU9OLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgICAgICBoeXBvdGhlc2lzSWQ6IFwiSC1tYWluLXdvcmxkLWV4ZWMtZXJyXCIsXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IFwiYmFja2dyb3VuZC50czptYWluLXdvcmxkLWFzc2lnblwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiZXhlY3V0ZVNjcmlwdCBmYWlsZWRcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7IGVyck1zZyB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICBvazogZmFsc2UsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnJNc2csXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LFxuICApO1xufSk7XG4iLCIvLyBzcmMvaW5kZXgudHNcbnZhciBfTWF0Y2hQYXR0ZXJuID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcbiAgICBpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuICAgICAgdGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uX01hdGNoUGF0dGVybi5QUk9UT0NPTFNdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gXCIqXCI7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBcIipcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ3JvdXBzID0gLyguKik6XFwvXFwvKC4qPykoXFwvLiopLy5leGVjKG1hdGNoUGF0dGVybik7XG4gICAgICBpZiAoZ3JvdXBzID09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgXCJJbmNvcnJlY3QgZm9ybWF0XCIpO1xuICAgICAgY29uc3QgW18sIHByb3RvY29sLCBob3N0bmFtZSwgcGF0aG5hbWVdID0gZ3JvdXBzO1xuICAgICAgdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKTtcbiAgICAgIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSk7XG4gICAgICB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpO1xuICAgICAgdGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuICAgICAgdGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG4gICAgICB0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcbiAgICB9XG4gIH1cbiAgaW5jbHVkZXModXJsKSB7XG4gICAgaWYgKHRoaXMuaXNBbGxVcmxzKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgY29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuICAgIHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG4gICAgICBpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKVxuICAgICAgICByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcbiAgICAgIGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIilcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcbiAgICB9KTtcbiAgfVxuICBpc0h0dHBNYXRjaCh1cmwpIHtcbiAgICByZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcbiAgfVxuICBpc0h0dHBzTWF0Y2godXJsKSB7XG4gICAgcmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuICB9XG4gIGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcbiAgICBpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbXG4gICAgICB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLFxuICAgICAgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSlcbiAgICBdO1xuICAgIGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG4gICAgcmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuICB9XG4gIGlzRmlsZU1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmaWxlOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcbiAgfVxuICBpc0Z0cE1hdGNoKHVybCkge1xuICAgIHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuICB9XG4gIGlzVXJuTWF0Y2godXJsKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IHVybjovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG4gIH1cbiAgY29udmVydFBhdHRlcm5Ub1JlZ2V4KHBhdHRlcm4pIHtcbiAgICBjb25zdCBlc2NhcGVkID0gdGhpcy5lc2NhcGVGb3JSZWdleChwYXR0ZXJuKTtcbiAgICBjb25zdCBzdGFyc1JlcGxhY2VkID0gZXNjYXBlZC5yZXBsYWNlKC9cXFxcXFwqL2csIFwiLipcIik7XG4gICAgcmV0dXJuIFJlZ0V4cChgXiR7c3RhcnNSZXBsYWNlZH0kYCk7XG4gIH1cbiAgZXNjYXBlRm9yUmVnZXgoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG4gIH1cbn07XG52YXIgTWF0Y2hQYXR0ZXJuID0gX01hdGNoUGF0dGVybjtcbk1hdGNoUGF0dGVybi5QUk9UT0NPTFMgPSBbXCJodHRwXCIsIFwiaHR0cHNcIiwgXCJmaWxlXCIsIFwiZnRwXCIsIFwidXJuXCJdO1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcbiAgICBzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuICB9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG4gIGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKFxuICAgICAgbWF0Y2hQYXR0ZXJuLFxuICAgICAgYCR7cHJvdG9jb2x9IG5vdCBhIHZhbGlkIHByb3RvY29sICgke01hdGNoUGF0dGVybi5QUk9UT0NPTFMuam9pbihcIiwgXCIpfSlgXG4gICAgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSkge1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpKVxuICAgIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuICBpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSlcbiAgICB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihcbiAgICAgIG1hdGNoUGF0dGVybixcbiAgICAgIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYFxuICAgICk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZVBhdGhuYW1lKG1hdGNoUGF0dGVybiwgcGF0aG5hbWUpIHtcbiAgcmV0dXJuO1xufVxuZXhwb3J0IHtcbiAgSW52YWxpZE1hdGNoUGF0dGVybixcbiAgTWF0Y2hQYXR0ZXJuXG59O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwzM10sIm1hcHBpbmdzIjoiOztDQUNBLFNBQVMsaUJBQWlCLEtBQUs7QUFDOUIsTUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFdBQVksUUFBTyxFQUFFLE1BQU0sS0FBSztBQUNsRSxTQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0VhUixJQUFNLFVEZmlCLFdBQVcsU0FBUyxTQUFTLEtBQ2hELFdBQVcsVUFDWCxXQUFXOzs7Q0VTZixJQUFBLDBCQUFBOzs7O0NBUUEsSUFBQSxxQkFBQTs7OztDQUtBLGVBQUEsMEJBQUE7O0FBTUUsU0FBQTs7Ozs7Q0FnREYsZUFBQSx5QkFBQTtBQUNFLE1BQUEsQ0FBQSxRQUFBLFdBQUEsaUJBQUE7O0FBR0EsUUFBQSxRQUFBLFVBQUEsaUJBQUEsRUFBQSx3QkFBQSxpQkFBQSxhQUFBLENBQUE7O0NBS0YsU0FBQSxxQkFBQSxPQUFBO0FBR0UsTUFBQSxVQUFBLFdBQUEsVUFBQSxVQUFBLFVBQUEs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O0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLE1BQU0sT0FBTyxRQUFRO0FBQ2pDLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLE1BQU0sT0FBTyxRQUFRO0FBQ2pDLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQWFOLFNBQWdCLFFBQVEsT0FBTyxRQUFRO0FBQ25DLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLFFBQVEsT0FBTyxRQUFRO0FBQ25DLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLFFBQVEsT0FBTyxRQUFRO0FBQ25DLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLFdBQVcsT0FBTyxRQUFRO0FBQ3RDLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xDLENBQUM7OztDQUdOLFNBQWdCLE1BQU0sT0FBTyxRQUFRO0FBQ2pDLFNBQU8sSUFBSSxNQUFNO0dBQ2IsTUFBTTtHQUNOLFFBQVE7R0FDUixPQUFPO0dBQ1AsT0FBTztHQUNQLEdBQUdBLGdCQUFxQixPQUFPO0dBQ2xD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