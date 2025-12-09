import type { Post, PostList } from "../schemas/product.schema";

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  userId: number;
}

export interface ProductListDTO {
  products: ProductDTO[];
  total: number;
}

export function toProductDTO(post: Post): ProductDTO {
  const price = Math.floor(Math.random() * 1000) + 10;

  return {
    id: String(post.id),
    name: post.title,
    description: post.body,
    price,
    formattedPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price),
    userId: post.userId,
  };
}

export function toProductListDTO(posts: PostList): ProductListDTO {
  return {
    products: posts.map(toProductDTO),
    total: posts.length,
  };
}
