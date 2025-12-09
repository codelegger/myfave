import { z } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 30000
    );

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...this.config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    schema: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request(endpoint, { method: "GET" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error };
      }
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: new ApiError("Invalid response data", 500, error.issues),
        };
      }
      return {
        success: false,
        error: new ApiError(
          error instanceof Error ? error.message : "Unknown error",
          500
        ),
      };
    }
  }

  async post<T, D = unknown>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    body?: D
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request(endpoint, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error };
      }
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: new ApiError("Invalid response data", 500, error.issues),
        };
      }
      return {
        success: false,
        error: new ApiError(
          error instanceof Error ? error.message : "Unknown error",
          500
        ),
      };
    }
  }

  async put<T, D = unknown>(
    endpoint: string,
    schema: z.ZodSchema<T>,
    body?: D
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request(endpoint, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error };
      }
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: new ApiError("Invalid response data", 500, error.issues),
        };
      }
      return {
        success: false,
        error: new ApiError(
          error instanceof Error ? error.message : "Unknown error",
          500
        ),
      };
    }
  }

  async delete<T = void>(
    endpoint: string,
    schema?: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request(endpoint, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json().catch(() => ({}));
      if (Object.keys(data).length === 0 || !schema) {
        return { success: true, data: {} as T };
      }
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error };
      }
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: new ApiError("Invalid response data", 500, error.issues),
        };
      }
      return {
        success: false,
        error: new ApiError(
          error instanceof Error ? error.message : "Unknown error",
          500
        ),
      };
    }
  }
}

export const createApiClient = (config: ApiConfig) => new ApiClient(config);
