import { cache } from "react";
import { productApi } from "../internal";
import type { ProductDTO, ProductListDTO } from "../dtos/product.dto";
import type { CreatePostInput, UpdatePostInput } from "../internal";

/**
 * Repository for product data access.
 *
 * This repository wraps the ProductApi and provides a clean interface
 * that returns DTOs directly and throws errors instead of returning
 * ApiResponse types. This enforces the contract-based architecture
 * where components only work with DTOs.
 */
export class ProductRepository {
  /**
   * Get a single product by ID.
   * @param id - Product ID
   * @returns Product DTO
   * @throws ApiError if the request fails
   */
  async getProduct(id: string): Promise<ProductDTO> {
    const response = await productApi.getProduct(id);

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Get a single product by ID (cached for server components).
   * @param id - Product ID
   * @returns Product DTO
   * @throws ApiError if the request fails
   */
  getCachedProduct = cache(async (id: string): Promise<ProductDTO> => {
    const response = await productApi.getCachedProduct(id);

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  });

  /**
   * Get all products.
   * @returns Product list DTO
   * @throws ApiError if the request fails
   */
  async getProducts(): Promise<ProductListDTO> {
    const response = await productApi.getProducts();

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Get all products (cached for server components).
   * @returns Product list DTO
   * @throws ApiError if the request fails
   */
  getCachedProducts = cache(async (): Promise<ProductListDTO> => {
    const response = await productApi.getCachedProducts();

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  });

  /**
   * Create a new product.
   * @param input - Product creation input
   * @returns Created product DTO
   * @throws ApiError if the request fails
   */
  async createProduct(input: CreatePostInput): Promise<ProductDTO> {
    const response = await productApi.createProduct(input);

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Update an existing product.
   * @param id - Product ID
   * @param input - Product update input
   * @returns Updated product DTO
   * @throws ApiError if the request fails
   */
  async updateProduct(id: string, input: UpdatePostInput): Promise<ProductDTO> {
    const response = await productApi.updateProduct(id, input);

    if (!response.success) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Delete a product.
   * @param id - Product ID
   * @throws ApiError if the request fails
   */
  async deleteProduct(id: string): Promise<void> {
    const response = await productApi.deleteProduct(id);

    if (!response.success) {
      throw response.error;
    }
  }
}

export const productRepository = new ProductRepository();
