/**
 * Joins multiple path segments into a single path.
 * Handles duplicate slashes and ensures no trailing slash unless it's the root "/".
 *
 * @param {...string[]} segments - The path segments to join.
 * @returns {string} The joined path.
 */
function pathJoin(...segments: string[]): string {
    return segments
        .filter(Boolean) // Remove empty values (like empty string, null, undefined)
        .join('/') // Join all segments with '/'
        .replace(/\/{2,}/g, '/') // Replace consecutive slashes with a single slash
        .replace(/\/$/, '') || '/'; // Remove trailing slash, unless it's the root path
}

export { pathJoin };