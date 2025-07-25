import '@logseq/libs';
declare const logseq: any;

export async function loadWasm() {
  if (!(logseq.settings.wasmUrl)) {
    console.error("WASM module URL not found in settings.");
    return;
  }

  const go = new (window as any).Go();
  try {
    const result = await WebAssembly.instantiateStreaming(
      fetch(logseq.settings.wasmUrl),
      go.importObject
    );
    go.run(result.instance);
    console.log("Odyssey WASM module loaded successfully.");
  } catch (error) {
    console.error("Error loading WASM module:", error);
  }
}
