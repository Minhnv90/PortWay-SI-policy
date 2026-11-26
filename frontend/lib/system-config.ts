export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SDK_LITE_URL: "https://pi-apps.github.io/pi-sdk-lite/build/production/sdklite.js",
  BACKEND_URL: "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com",
  SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX === "true" || (typeof window !== "undefined" && window.location.hostname === "portway-si-frontend-staging.nguyenminh2290.workers.dev"),
} as const;
