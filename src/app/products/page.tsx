import { productRepository } from "@/data";
import Link from "next/link";

export default async function ProductsPage() {
  try {
    const { products, total } = await productRepository.getCachedProducts();

    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Showing {total} {total === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {product.formattedPrice}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    User {product.userId}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-semibold">
            Error loading products
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }
}
