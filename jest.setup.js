// jsdom implements no `matchMedia`. Several components read it directly
// (prefers-reduced-motion) and `lenis` calls it on construction, so without a
// shim the Legal + workspace suites throw. Returns a non-matching, no-op query
// list — enough for every current test.
const g = globalThis;
if (typeof g.matchMedia !== 'function') {
  g.matchMedia = function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };
}
