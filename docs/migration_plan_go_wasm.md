### **Migration Plan: Logseq Odyssey Plugin to Go & WebAssembly**

**1. Introduction & Goals**

This document outlines the strategy for refactoring the Logseq Odyssey plugin. The primary goal is to migrate the core business logic from TypeScript to Go, which will be compiled to a WebAssembly (WASM) module. The frontend UI will remain in React/TypeScript.

This migration aims to:
*   **Leverage Go's Strengths:** Utilize Go for performance-sensitive tasks, strong typing, and its robust standard library for things like API requests and data manipulation.
*   **Create a Clean Separation of Concerns:** Isolate the application's core logic (the "engine") from its presentation layer (the UI), leading to a more maintainable and modular codebase.
*   **Explore Modern Web Technologies:** Gain experience with a production-grade WebAssembly implementation.

**2. Scope of Migration**

A clear line must be drawn between what will be moved to Go and what will remain in TypeScript.

**2.1. In Scope (To be migrated to Go):**

*   **SRD API Interaction (`src/lib/srd/srd-api.ts`):** All logic for fetching data from the external 5e SRD API will be moved to Go. This includes making HTTP requests and parsing the JSON responses into Go structs.
*   **Utility Functions (`src/utils.ts`):** General-purpose utility functions, especially those involving string manipulation or complex calculations, are prime candidates for migration.
*   **State Management Logic (where applicable):** While the state itself will be held in React components, the functions that *operate* on that state (e.g., calculating the next turn in the initiative tracker) can be moved to Go. The React components will call the WASM module, pass the current state, and receive the new state in return.

**2.2. Out of Scope (To remain in TypeScript/React):**

*   **All React Components (`src/components/**/*.tsx`):** The entire UI layer will not be changed. These components will be refactored to call the WASM module instead of local TypeScript functions.
*   **Logseq Plugin API Integration (`src/plugin/plugin.ts`, `src/plugin/toolbar.tsx`, etc.):** The code that directly interfaces with the Logseq frontend API (e.g., `logseq.App.showMsg`, `logseq.Editor.*`) must remain in JavaScript/TypeScript, as the WASM module cannot directly access the `logseq` object.
*   **Type Definitions for the Frontend (`src/types.ts`, `src/lib/srd/srd-types.ts`):** The TypeScript types will still be necessary for the React components to understand the shape of the data they are handling, even if that data originates from the WASM module. Go will have its own corresponding structs.
*   **Styling (`*.css`):** All CSS and styling will remain untouched.

**3. Proposed Implementation Strategy**

**3.1. Go Code Structure**

1.  A new top-level directory named `go/` will be created in the project root.
2.  This directory will contain all the Go source code (e.g., `go/main.go`, `go/srd_api.go`).
3.  A `go.mod` file will be created to manage Go dependencies.

**3.2. Exposing Go Functions to JavaScript**

Go functions will be exposed to the JavaScript environment using the `syscall/js` package. We will create explicit "exported" functions that can be called from our TypeScript code.

*Example: Exporting a Go function*
```go
// in go/main.go
package main

import "syscall/js"

// This function will be callable from JavaScript as `odysseyWasm.greet()`
func greet(this js.Value, args []js.Value) interface{} {
    name := "World"
    if len(args) > 0 {
        name = args[0].String()
    }
    return "Hello, " + name + "!"
}

func main() {
    c := make(chan struct{}, 0)
    println("Go WebAssembly Initialized")

    // Expose functions to the global JS scope
    js.Global().Set("odysseyWasm", js.ValueOf(map[string]interface{}{
        "greet": js.FuncOf(greet),
        // Other exported functions will go here
    }))

    <-c // Keep the program alive
}
```

**3.3. Loading and Interacting with WASM in TypeScript**

We will need a small "glue" code in TypeScript to load and instantiate the WASM module. The official Go distribution provides a `wasm_exec.js` file for this purpose, which we will copy into our `public/` directory.

*Example: TypeScript WASM loader*
```typescript
// in src/lib/wasm-loader.ts
import { logseq } from '../globals/globals'; // Assuming access to logseq API

export async function loadWasm() {
  if (!logseq.settings?.wasmUrl) {
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
```
The React components will then call the exported functions:
```typescript
const message = (window as any).odysseyWasm.greet("Gemini");
console.log(message); // "Hello, Gemini!"
```

**4. Build Process Modifications**

The existing `vite` build process needs to be augmented to include the Go-to-WASM compilation step.

1.  **Go Compilation:** A new script will be added to `package.json` to compile the Go code. The output will be a `.wasm` file placed in the `public/` directory, which Vite will automatically copy to the final `dist/` folder.
    ```bash
    # Command for compiling Go to WASM
    GOOS=js GOARCH=wasm go build -o public/odyssey.wasm ./go/main.go
    ```
2.  **`package.json` Scripts:**
    ```json
    "scripts": {
      "dev": "vite",
      "build:wasm": "GOOS=js GOARCH=wasm go build -o public/odyssey.wasm ./go/main.go",
      "build": "pnpm build:wasm && tsc && vite build",
      "preview": "vite preview"
    },
    ```
3.  **`wasm_exec.js`:** The `wasm_exec.js` file from the Go installation (`$(go env GOROOT)/misc/wasm/`) will be copied into the `public/` directory. It will be loaded in `index.html`.
    ```html
    <!-- in index.html -->
    <script src="./wasm_exec.js"></script>
    ```

**5. Step-by-Step Migration Plan**

1.  **Setup Go Environment:**
    *   Create the `go/` directory.
    *   Run `go mod init github.com/shiftregister-vg/logseq-odyssey/go` inside the `go/` directory.
    *   Create a simple `go/main.go` with a "hello world" function to test the pipeline.

2.  **Integrate Build Process:**
    *   Copy `wasm_exec.js` to `public/`.
    *   Add the `build:wasm` script to `package.json` and update the main `build` script.
    *   Include `<script src="./wasm_exec.js"></script>` in `index.html`.

3.  **Create WASM Loader:**
    *   Implement the `loadWasm` function in TypeScript (`src/lib/wasm-loader.ts`).
    *   Call this loader from the main plugin entry point (`src/odyssey.ts`) to ensure the WASM is ready before the UI loads.

4.  **Verify the Pipeline:**
    *   Run `pnpm build` and ensure `public/odyssey.wasm` is created.
    *   Run `pnpm dev` and verify in the browser console that the "hello world" function from Go can be called successfully from TypeScript.

5.  **Migrate `srd-api.ts`:**
    *   Create `go/srd_api.go`.
    *   Re-implement the SRD API fetching logic using Go's `net/http` package.
    *   Define Go structs to match the JSON responses.
    *   Export the new Go function (e.g., `fetchSrdData`) in `go/main.go`.
    *   Refactor the `SRDLookup.tsx` component to call the new WASM function. Data will be passed between WASM and JS as a JSON string, which is then parsed on the respective side.

6.  **Migrate `utils.ts`:**
    *   Translate functions from `utils.ts` into new Go functions in `go/utils.go`.
    *   Export them via `go/main.go`.
    *   Update the TypeScript codebase to call the WASM-based utility functions.

7.  **Refactor Initiative Tracker:**
    *   Identify pure logic functions within the `InitiativeTracker` components.
    *   Move this logic to Go, exposing functions like `nextTurn`, `addCombatant`, etc.
    *   The React components will now manage state by calling these WASM functions, passing the current list of combatants and receiving the updated list.

8.  **Final Cleanup and Testing:**
    *   Remove the now-unused TypeScript files (`srd-api.ts`, `utils.ts`).
    *   Conduct thorough testing of all plugin features to ensure the migration was successful and no regressions were introduced.

---
