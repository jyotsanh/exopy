/**
 * Vitest global setup.
 *
 * - Registers @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 * - Polyfills window.matchMedia, which jsdom does not provide. ThemeProvider
 *   uses it to detect system color-scheme preference; without this stub
 *   reading the initial theme throws.
 * - Resets the DOM and localStorage between tests so state never leaks.
 */

import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom lacks matchMedia entirely. Provide a minimal, deterministic shim that
// always reports "no match" — tests that need a specific value can override it.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  window.sessionStorage.clear();
  document.documentElement.className = "";
});
