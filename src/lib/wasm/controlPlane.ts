export interface WasmControlPlane {
  listBlocks(): string;
  getBlock(blockTypeId: string): string;
  listSessions(): string;
  createSession(name: string, grc: string): string;
  getSession(sessionId: string): string;
  startSession(sessionId: string): string;
  stopSession(sessionId: string): string;
  restartSession(sessionId: string): string;
  deleteSession(sessionId: string): void;
  getBlockSettings(sessionId: string, blockName: string): string;
  updateBlockSettings(sessionId: string, blockName: string, settings: string, mode: string): string;
}

type WasmModule = { ControlPlane: new () => WasmControlPlane };
type WasmFactory = (opts?: object) => Promise<WasmModule>;

let initPromise: Promise<WasmControlPlane> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function init(): Promise<WasmControlPlane> {
  await loadScript(`${import.meta.env.BASE_URL}gr4cp_wasm.js`);
  const factory = (globalThis as Record<string, unknown>)['Gr4ControlPlane'] as WasmFactory;
  const mod = await factory();
  return new mod.ControlPlane();
}

export function getControlPlane(): Promise<WasmControlPlane> {
  if (!initPromise) {
    initPromise = init();
  }
  return initPromise;
}
