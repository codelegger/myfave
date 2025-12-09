/**
 * Public API for the data access layer.
 *
 * Components should only import from this file.
 * This enforces the contract-based architecture where:
 * - Components work only with DTOs
 * - Data access goes through repositories
 * - Internal implementation details are hidden
 */

// Repositories (primary data access interface)
export * from "./repositories/product.repository";

// DTOs (data transfer objects for components)
export * from "./dtos/product.dto";

// Input types (for repository method parameters)
export type {
  CreatePostInput,
  UpdatePostInput,
} from "./schemas/product.schema";
