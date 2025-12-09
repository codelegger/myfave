# Data Access Layer (DAL)

This directory contains the Data Access Layer implementation with a contract-based architecture that enforces type safety, consistency, and proper abstraction.

## Architecture

The DAL follows a **contract-based architecture** with clear separation of concerns:

```
Component → Repository → API Service → API Client → External API
                ↓
              DTOs (only)
```

### Key Principles

1. **Repository Pattern**: Components access data only through repositories
2. **DTO-Only Interface**: Components work exclusively with DTOs, never raw API responses
3. **Type Safety**: Full TypeScript support with Zod validation
4. **Encapsulation**: Internal implementation details (API services, schemas, clients) are hidden
5. **Error Handling**: Repositories throw errors (use try/catch in components)
6. **Caching**: React's `cache()` for server-side memoization

## Structure

```
data/
├── repositories/          # Repository layer (public API)
│   └── product.repository.ts
├── api/                    # API service layer (internal)
│   └── product.api.ts
├── schemas/                # Zod validation schemas (internal)
│   └── product.schema.ts
├── dtos/                   # Data Transfer Objects (public)
│   └── product.dto.ts
├── utils/                  # Utility functions (internal)
│   └── api-client.ts
├── index.ts               # Public API exports (repositories + DTOs)
├── internal.ts            # Internal exports (for data layer only)
└── README.md              # This file
```

## Public API

Components should **only** import from `@/data` (which exports from `index.ts`):

- ✅ Repositories (e.g., `productRepository`)
- ✅ DTO types (e.g., `ProductDTO`, `ProductListDTO`)

## Internal API

The following are **internal** and should NOT be imported by components:

- ❌ API services (`api/*`)
- ❌ Schemas (`schemas/*`)
- ❌ API client (`utils/api-client`)
- ❌ Internal exports (`internal.ts`)

ESLint rules enforce these restrictions.

## Usage

### In Server Components

```tsx
import { productRepository } from "@/data";

export default async function ProductsPage() {
  try {
    const { products, total } = await productRepository.getCachedProducts();

    return (
      <div>
        <h1>Products ({total})</h1>
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.formattedPrice}</p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div>
        <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
}
```

### In Server Actions

```tsx
"use server";

import { productRepository } from "@/data";
import type { CreatePostInput } from "@/data";

export async function createProduct(input: CreatePostInput) {
  try {
    const product = await productRepository.createProduct(input);
    return { success: true, data: product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### In Client Components

For client components, use Server Actions or API routes that use repositories:

```tsx
"use client";

import { createProduct } from "./actions";

export function ProductForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createProduct({
      title: formData.get("title") as string,
      body: formData.get("body") as string,
    });
    // Handle result...
  }

  return <form action={handleSubmit}>...</form>;
}
```

## Data Mapping

The DAL maps JSONPlaceholder posts to product DTOs:

- `post.id` → `product.id` (converted to string)
- `post.title` → `product.name`
- `post.body` → `product.description`
- `post.userId` → `product.userId`
- Generated `price` and `formattedPrice` for display

## Error Handling

Repositories throw `ApiError` instances instead of returning error responses:

```tsx
try {
  const product = await productRepository.getProduct("1");
  // Use product (type: ProductDTO)
  console.log(product.name);
} catch (error) {
  // Handle error
  if (error instanceof ApiError) {
    console.error(error.message);
    console.error(error.statusCode);
  }
}
```

## Anti-Patterns (What NOT to Do)

### ❌ Don't Import Internal APIs

```tsx
// ❌ WRONG - Will be caught by ESLint
import { productApi } from "@/data/api/product.api";
import { createApiClient } from "@/data/utils/api-client";
import { postSchema } from "@/data/schemas/product.schema";
```

### ❌ Don't Use Direct Fetch

```tsx
// ❌ WRONG - Will be caught by ESLint
const response = await fetch("https://api.example.com/products");
const data = await response.json();
```

### ❌ Don't Work with Raw API Responses

```tsx
// ❌ WRONG - ApiResponse is not exported
import type { ApiResponse } from "@/data"; // This won't work
```

### ✅ Do Use Repositories

```tsx
// ✅ CORRECT
import { productRepository } from "@/data";
import type { ProductDTO } from "@/data";

const product: ProductDTO = await productRepository.getProduct("1");
```

## Benefits of This Architecture

1. **Consistency**: All components use the same data access pattern
2. **Type Safety**: Components can only work with DTOs, preventing type errors
3. **Maintainability**: Changes to API structure only require updates in one place
4. **Testability**: Repositories can be easily mocked for testing
5. **Transparency**: Clear separation between data access and UI logic
6. **Enforcement**: ESLint rules prevent accidental violations

## Adding New Data Sources

When adding a new data source:

1. Create schema in `schemas/` (Zod validation)
2. Create DTO in `dtos/` (component-friendly types)
3. Create API service in `api/` (wraps API client)
4. Create repository in `repositories/` (public interface)
5. Export repository and DTOs from `index.ts`
6. Add API service and schemas to `internal.ts`

## API

The DAL uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as the API endpoint for posts data.
