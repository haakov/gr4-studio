import type { AppConfig } from './runtime-config';
import { resolveAppConfig } from './runtime-config';

const resolved = resolveAppConfig(import.meta.env.VITE_CONTROL_PLANE_BASE_URL, import.meta.env.VITE_CONTROL_PLANE_MODE);

if (resolved.issues.length > 0) {
  resolved.issues.forEach((issue) => {
    console.warn(`[config] ${issue.message}`);
  });
}

if (resolved.controlPlaneMode == 'wasm') {
    resolved.controlPlaneBaseUrl = 'WASM';
}

if (import.meta.env.DEV) {
  console.info(`[config] Control plane base URL: ${resolved.controlPlaneBaseUrl} (${resolved.source})`);
  console.info('[config] Current-session renderer routing uses app-owned /api paths; backend URL remains for diagnostics and legacy direct-endpoint fallback.');
  console.info(`[config] Control plane mode: ${resolved.controlPlaneMode}`);
}

export const config: AppConfig = {
  controlPlaneBaseUrl: resolved.controlPlaneBaseUrl,
  controlPlaneMode: resolved.controlPlaneMode,
  backendMode: resolved.backendMode,
  source: resolved.source,
  issues: resolved.issues,
};
