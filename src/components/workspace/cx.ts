/** Join truthy class names. Also drops `undefined` from CSS-module lookups so
 *  the DOM stays clean when the stylesheet is mocked (tests). */
export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');
