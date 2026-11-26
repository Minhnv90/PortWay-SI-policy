"use client";

// Self-contained Pi client for App Studio custom apps.
//
// Auth and user-state talk to the App Studio backend directly over fetch. The `pi` singleton
// below is the one instance the whole app shares: the auth context logs in through it on
// startup, and app code reads and writes user state through `pi.userState` from anywhere,
// no hook needed. Payments, ads, products and purchase balances are served by SDKLite,
// reached through `usePiAuth().sdk`. The two do not overlap.
//
// This file is locked in generated apps. Keep it free of imports other than
// lib/system-config.ts and type-only imports. Only `pi` and types are exported on purpose:
// there is exactly one client, and nothing outside this file should build another.

import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import type { PiAuthResult, UserStateRecord } from "@/lib/sdklite-types";

export type PiUser = PiAuthResult["user"];

export interface PiAuthApi {
  /** Logs in through Pi and the App Studio backend. Returns the cached user after the first call. */
  login: () => Promise<PiUser>;
  getUser: () => PiUser | null;
  isLoggedIn: () => boolean;
  /** Forgets the cached user and token so the next login() authenticates again. */
  reset: () => void;
}

export interface PiUserStateApi {
  get: (key: string) => Promise<UserStateRecord | null>;
  set: (key: string, blob: Record<string, unknown>) => Promise<void>;
  delete: (key: string) => Promise<void>;
  keys: () => Promise<string[]>;
}

export interface PiSdk {
  auth: PiAuthApi;
  userState: PiUserStateApi;
}

export interface PiBackendError extends Error {
  name: "PiBackendError";
  status: number;
  data: unknown;
}

const AUTH_SCOPES = ["username", "payments"];
const REQUEST_TIMEOUT_MS = 10_000;
const AUTH_BASE_PATH = "/pi/auth/v1";
const USER_STATE_BASE_PATH = "/pi/user-state/v1";

interface LoginResponse {
  sessionToken: string;
  user: PiUser;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface AuthSession {
  api: PiAuthApi;
  headers: () => Record<string, string>;
  ensureLoggedIn: () => Promise<void>;
}

function parseBody(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Minimal JSON client against the App Studio backend: 10 s timeout so a stalled request fails
 * instead of hanging the login screen, JSON content type only when a body is sent, throws on
 * any non-2xx status, resolves to the parsed JSON body (or null for an empty body).
 */
async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${PI_NETWORK_CONFIG.BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const data = parseBody(await response.text());

  if (!response.ok) {
    const error = new Error(
      `Pi backend request failed: ${response.status} ${response.statusText}`,
    ) as PiBackendError;
    error.name = "PiBackendError";
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

/**
 * Authenticates with the Pi Platform SDK and exchanges the access token for an App Studio
 * session token. `login()` is idempotent: once a user is known it returns immediately, and
 * concurrent callers share one in-flight login so Pi is never prompted twice.
 */
function createAuth(): AuthSession {
  let user: PiUser | null = null;
  let sessionToken: string | null = null;
  let inflight: Promise<PiUser> | null = null;
  let piToken: string | null = null;
  let storageInflight: Promise<void> | null = null;
  let generation = 0;
  // Deliberate no-op. Payments are owned by SDKLite, which handles incomplete payments itself.
  const onIncompletePaymentFound = () => {};

  async function authenticate(): Promise<PiUser> {
    if (typeof window === "undefined" || !window.Pi) {
      throw new Error("Pi SDK is not available in this environment");
    }

    const attempt = generation;
    const staging = window.location.hostname === "portway-si-frontend-staging.nguyenminh2290.workers.dev";
    const result = await window.Pi.authenticate(staging ? ["username"] : AUTH_SCOPES, onIncompletePaymentFound);
    if (!result.accessToken) throw new Error("Missing Pi access token");
    if (staging) {
      const response = await fetch("https://portway-si-staging.nguyenminh2290.workers.dev/api/pi/verify", {
        method: "POST", headers: { Authorization: `Bearer ${result.accessToken}` },
        signal: AbortSignal.timeout(15000), redirect: "error",
      });
      if (!response.ok) throw new Error(`Pi verification HTTP ${response.status}`);
      const data = await response.json();
      if (data.verified !== true || typeof data.user?.uid !== "string" || !data.user.uid || typeof data.user.username !== "string" || data.user.uid !== result.user.uid) throw new Error("Invalid verified identity");
      if (attempt !== generation) throw new Error("Authentication superseded");
      piToken = result.accessToken;
      user = { uid: data.user.uid, username: data.user.username };
      return user;
    }
    const response = await request<LoginResponse>(`${AUTH_BASE_PATH}/login`, {
      method: "POST",
      body: JSON.stringify({ accessToken: result.accessToken }),
    });

    if (!response || typeof response.sessionToken !== "string" || !response.sessionToken || !response.user || typeof response.user.uid !== "string" || typeof response.user.username !== "string") throw new Error("Invalid backend login response");
    if (attempt !== generation) throw new Error("Authentication superseded");
    sessionToken = response.sessionToken;
    user = response.user;
    return user;
  }

  function login(): Promise<PiUser> {
    if (user) return Promise.resolve(user);
    if (inflight) return inflight;

    const attempt = generation;
    const pending = authenticate().finally(() => {
      if (attempt === generation && inflight === pending) inflight = null;
    });
    inflight = pending;
    return pending;
  }

  function headers(): Record<string, string> {
    return sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
  }

  async function ensureLoggedIn(): Promise<void> {
    if (!user) await login();
    if (sessionToken) return;
    if (!piToken || !user) throw new Error("Storage session unavailable");
    if (!storageInflight) {
      const attempt = generation;
      const uid = user.uid;
      storageInflight = (async () => {
        const response = await request<LoginResponse>(`${AUTH_BASE_PATH}/login`, {
          method: "POST", body: JSON.stringify({ accessToken: piToken }),
        });
        if (attempt !== generation || response?.user?.uid !== uid || typeof response.sessionToken !== "string" || !response.sessionToken) throw new Error("Storage identity could not be verified");
        sessionToken = response.sessionToken;
      })().finally(() => { if (attempt === generation) storageInflight = null; });
    }
    await storageInflight;
  }

  function reset(): void {
    generation++;
    piToken = null;
    storageInflight = null;
    user = null;
    sessionToken = null;
    inflight = null;
  }

  return {
    api: {
      login,
      getUser: () => user,
      isLoggedIn: () => user !== null,
      reset,
    },
    headers,
    ensureLoggedIn,
  };
}

/**
 * Per-user key/value storage backed by the App Studio backend. Every call logs in first if
 * needed and sends the session token.
 */
function createUserState(auth: AuthSession): PiUserStateApi {
  async function authedRequest<T>(path: string, init: RequestOptions): Promise<T> {
    await auth.ensureLoggedIn();
    return request<T>(`${USER_STATE_BASE_PATH}${path}`, {
      ...init,
      headers: { ...(init.headers ?? {}), ...auth.headers() },
    });
  }

  return {
    get: (key) =>
      authedRequest<UserStateRecord | null>(`/${encodeURIComponent(key)}`, { method: "GET" }),
    set: async (key, blob) => {
      await authedRequest<null>(`/${encodeURIComponent(key)}`, {
        method: "PUT",
        body: JSON.stringify(blob),
      });
    },
    delete: async (key) => {
      await authedRequest<null>(`/${encodeURIComponent(key)}`, { method: "DELETE" });
    },
    keys: () => authedRequest<string[]>("/", { method: "GET" }),
  };
}

function buildPiClient(): PiSdk {
  const auth = createAuth();
  // Frozen so app code cannot replace or monkeypatch the client by accident.
  return Object.freeze({
    auth: Object.freeze(auth.api),
    userState: Object.freeze(createUserState(auth)),
  });
}

/**
 * The shared Pi client. Import it anywhere in client code:
 *
 *   import { pi } from "@/lib/pi";
 *   await pi.userState.set("save", { level: 4 });
 *
 * User-state calls log in on demand and wait for a login already in progress, so they are
 * safe to call before the auth context has finished starting up.
 */
export const pi: PiSdk = buildPiClient();
