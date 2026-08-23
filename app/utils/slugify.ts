// Unicode combining diacritical marks (U+0300-U+036F) left over after NFD normalization.
const DIACRITICS_REGEX = /[̀-ͯ]/g

/**
 * Turns an arbitrary string (e.g. a movie/TV show title) into a URL-safe slug:
 * lowercased, accents stripped, everything that isn't alphanumeric collapsed
 * into single hyphens, with leading/trailing hyphens trimmed.
 *
 * "Zeg 'ns Aaa" -> "zeg-ns-aaa"
 * "Amélie"      -> "amelie"
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
