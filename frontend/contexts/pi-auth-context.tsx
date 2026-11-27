"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import { pi, type PiUser } from "@/lib/pi";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  // The signed-in Pi user (uid and username). Null until login completes.
  user: PiUser | null;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

function authDeadline<T>(promise: Promise<T>, stage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(stage + " timed out")), 20000);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);
  const [user, setUser] = useState<PiUser | null>(null);

  const fetchProducts = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    }
  };

  const busy = useRef(false);
  const initialize = async () => {
    if (busy.current) return;
    busy.current = true;
    // Every attempt starts from a clean Pi session, so a retry re-authenticates instead of
    // reusing a user cached by an earlier, partially failed attempt.
    setIsAuthenticated(false);
    setSdk(null);
    setProducts(null);
    pi.auth.reset();
    setUser(null);
    setHasError(false);
    setRestoredPurchases(null);
    try {
      setAuthMessage("Loading Pi SDK...");
      await authDeadline(loadPiSDK(), "Pi SDK load");
      setAuthMessage("Initializing Pi Network...");
      await authDeadline(Promise.resolve(window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      })), "Pi SDK init");
      setAuthMessage("Logging in to Pi backend...");
      const piUser = await authDeadline(pi.auth.login(), "Pi backend login");
      setUser(piUser);
      setIsAuthenticated(true);
      // Optional commerce integration must not block verified sign-in.
      try {
      await authDeadline(loadSDKLite(), "SDKLite load");
      const sdkLite = await authDeadline(window.SDKLite.init(), "SDKLite init");
      const success = await authDeadline(sdkLite.login(), "SDKLite login");
      if (!success) throw new Error("SDKLite login failed");
      setSdk(sdkLite);
      await fetchProducts(sdkLite);

      try {
        const { purchases } = await sdkLite.state.restore();
        setRestoredPurchases(purchases);
        console.log("[PiAuth] Purchases restored", purchases);
      } catch (e) {
        console.error("[PiAuth] Failed to restore purchases:", e);
        setRestoredPurchases([]);
      }
      } catch {
        setSdk(null);
        setProducts([]);
        setRestoredPurchases([]);
      }
    } catch (err) {
      console.error("Pi authentication failed");
      setHasError(true);
      setAuthMessage(
        previous => { const message = err instanceof Error ? err.message : ""; const safe = /^(Pi verification HTTP [1-5][0-9]{2}|Pi backend login timed out|Pi SDK load timed out|Pi SDK init timed out|Invalid verified identity|Missing Pi access token)$/.test(message) ? message : "Check Pi SDK, app domain or network"; return `${previous} Failed. ${safe}. Please retry.`; },
      );
    } finally {
      busy.current = false;
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    user,
    sdk,
    products,
    restoredPurchases,
    reinitialize: initialize,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
