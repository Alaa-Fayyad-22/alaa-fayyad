import en from '../src/messages/en.json';
import ar from '../src/messages/ar.json';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

/**
 * Flatten to "a.b.c" paths. Arrays contribute an `[n]` segment per element, so
 * a list that is shorter in one language is reported as missing keys too.
 */
function paths(value: Json, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => paths(v, `${prefix}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('i18n message files', () => {
  const enKeys = paths(en as Json).sort();
  const arKeys = paths(ar as Json).sort();

  it('en.json and ar.json have identical key sets (deep)', () => {
    expect(arKeys.filter((k) => !enKeys.includes(k))).toEqual([]); // only in ar
    expect(enKeys.filter((k) => !arKeys.includes(k))).toEqual([]); // only in en
    expect(arKeys).toEqual(enKeys);
  });

  it('has no empty strings except intentionally blank values', () => {
    // work.*.plaque2 is blank on purpose (single-line plaque on the Frontend door).
    const allowed = /^home\.work\.frontend\.plaque2$/;
    const flat = (obj: Json, prefix = ''): [string, Json][] =>
      Array.isArray(obj)
        ? obj.flatMap((v, i) => flat(v, `${prefix}[${i}]`))
        : obj && typeof obj === 'object'
          ? Object.entries(obj).flatMap(([k, v]) => flat(v, prefix ? `${prefix}.${k}` : k))
          : [[prefix, obj]];
    for (const messages of [en, ar]) {
      const empty = flat(messages as Json)
        .filter(([, v]) => v === '')
        .map(([k]) => k)
        .filter((k) => !allowed.test(k));
      expect(empty).toEqual([]);
    }
  });

  it('keeps the reply-time placeholder in brackets in both languages', () => {
    expect(en.home.contact.copy).toContain('[24 hours]');
    expect(ar.home.contact.copy).toContain('[24 ساعة]');
  });
});
