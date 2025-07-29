import '@logseq/libs';
declare const logseq: any;

export async function loadWasm() {
  const go = new (window as any).Go();
  try {
    const result = await WebAssembly.instantiateStreaming(
      fetch('./odyssey.wasm'),
      go.importObject
    );
    go.run(result.instance);
    console.log("Odyssey WASM module loaded successfully.");
  } catch (error) {
    console.error("Error loading WASM module:", error);
  }
}
