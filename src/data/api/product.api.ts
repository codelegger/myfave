import { cache } from "react";
import { createApiClient, type ApiResponse } from "../utils/api-client";
import {
  postSchema,
  postListSchema,
  type CreatePostInput,
  type UpdatePostInput,
} from "../schemas/product.schema";
import {
  toProductDTO,
  toProductListDTO,
  type ProductDTO,
  type ProductListDTO,
} from "../dtos/product.dto";

const apiClient = createApiClient({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export class ProductApi {
  async getProduct(id: string): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.get(`/posts/${id}`, postSchema);

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: toProductDTO(response.data),
    };
  }

  getCachedProduct = cache(
    async (id: string): Promise<ApiResponse<ProductDTO>> => {
      return this.getProduct(id);
    }
  );

  async getProducts(): Promise<ApiResponse<ProductListDTO>> {
    const response = await apiClient.get("/posts", postListSchema);

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: toProductListDTO(response.data),
    };
  }

  getCachedProducts = cache(async (): Promise<ApiResponse<ProductListDTO>> => {
    return this.getProducts();
  });

  async createProduct(
    input: CreatePostInput
  ): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.post("/posts", postSchema, input);

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: toProductDTO(response.data),
    };
  }

  async updateProduct(
    id: string,
    input: UpdatePostInput
  ): Promise<ApiResponse<ProductDTO>> {
    const response = await apiClient.put(`/posts/${id}`, postSchema, input);

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: toProductDTO(response.data),
    };
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/posts/${id}`);
  }
}

export const productApi = new ProductApi();
