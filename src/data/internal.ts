/**
 * Internal exports for the data access layer.
 *
 * These exports are only for use within the data layer itself
 * (repositories, API services, etc.) and should NOT be imported
 * by components or other parts of the application.
 *
 * Components should only import from the main index.ts file.
 */

// API services (for repository use only)
export * from "./api/product.api";

// Schemas (for API services and repositories)
export * from "./schemas/product.schema";

// API client utilities (for API services only)
export * from "./utils/api-client";
