/**
 * Typed localStorage abstraction for SpeakLab.
 *
 * Migration contract: this module is the single point of contact with the
 * storage layer. To migrate to a remote DB or IndexedDB, replace the
 * implementation of each function here — all call sites throughout the app
 * remain unchanged.
 *
 * Key convention: "speaklab.<feature>" (defined in types/index.ts)
 */

/** Retrieve a value from storage and deserialize it. Returns null if missing or unreadable. */
export function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    console.warn(`[storage] Failed to parse value for key "${key}"`)
    return null
  }
}

/** Serialize a value and write it to storage. */
export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`[storage] Failed to write key "${key}"`, err)
  }
}

/** Remove a key from storage. */
export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error(`[storage] Failed to remove key "${key}"`, err)
  }
}

/** Check whether a key exists in storage. */
export function storageHas(key: string): boolean {
  return localStorage.getItem(key) !== null
}
