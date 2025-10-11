import { getAllKeys, getJSON, remove, setJSON } from "./base";
import { CONFIG_PREFIX } from "./contants";

/**
 * Creates a config key for localStorage
 * @param configFile The config file name/identifier
 * @returns The formatted key for localStorage
 */
export function createConfigKey(configFile: string): string {
  return CONFIG_PREFIX + configFile;
}

/**
 * Gets cached config from localStorage
 * @param configFile The config file name/identifier
 * @returns The cached config or null if not found
 */
export function getCachedConfig(configFile: string): any | null {
  return getJSON(createConfigKey(configFile));
}

/**
 * Caches config data in localStorage
 * @param configFile The config file name/identifier
 * @param config The config data to cache
 */
export function setCachedConfig(configFile: string, config: any): void {
  setJSON(createConfigKey(configFile), config);
}

/**
 * Checks if a config is cached
 * @param configFile The config file name/identifier
 * @returns true if config exists in cache, false otherwise
 */
export function hasConfigCache(configFile: string): boolean {
  return getCachedConfig(configFile) !== null;
}

/**
 * Removes a specific config from cache
 * @param configFile The config file name/identifier
 */
export function removeCachedConfig(configFile: string): void {
  remove(createConfigKey(configFile));
}

/**
 * Clears all cached configs from localStorage
 */
export function clearAllConfigs(): void {
  const configKeys = getAllKeys(CONFIG_PREFIX);
  configKeys.forEach(key => {
    remove(key);
  });
}

/**
 * Gets all cached config identifiers
 * @returns Array of config file identifiers that are cached
 */
export function getAllCachedConfigIds(): string[] {
  return getAllKeys(CONFIG_PREFIX).map(key => key.replace(CONFIG_PREFIX, ''));
}