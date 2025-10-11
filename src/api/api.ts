import { setMenu } from "@/storage/data";
import { postApiCall } from "./base";
import { MENU_UPDATED } from "@/events/constants";
import { bcm } from "@/events/base";
import { IFetchQuery } from "@/components/EntryList";
import { getCachedConfig, setCachedConfig, hasConfigCache } from "@/storage/config";

// ─────────────────────────────────────────────────────────────
// Execute Query

// ─────────────────────────────────────────────────────────────

export async function executeQueryApiCall(config: {
  fetchQuery: IFetchQuery
  configFile: string;
  path: string;
  payload: any[];
}) {
  try {
    const response = await postApiCall("/api/generic/executeQuery", config, true);
    console.log("Execute Query API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// Get Config
// ─────────────────────────────────────────────────────────────

export async function getConfigApiCall(configFile: string) {
  try {
    // Check if config is already cached
    if (hasConfigCache(configFile)) {
      console.log(`Config found in cache for: ${configFile}`);
      return { data: getCachedConfig(configFile) };
    }

    console.log(`Fetching config from API for: ${configFile}`);
    const response = await postApiCall("/api/generic/getConfig", { configFile }, true);
    
    // Cache the response data
    setCachedConfig(configFile, response.data);
    console.log(`Config cached for: ${configFile}`);
    
    return response;
  } catch (error) {
    console.error("Error fetching config:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// Get Menu
// ─────────────────────────────────────────────────────────────

export async function getMenuApiCall() {
  try {
    const response = await postApiCall("/api/generic/getMenu", {}, true);
    console.log("Menu API response:", response);
    setMenu(response.data.children);
    bcm.broadcast({ type: MENU_UPDATED });
  } catch (error) {
    console.error("Error fetching menu:", error);
  }
}
