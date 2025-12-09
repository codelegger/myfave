import { describe, it, expect } from "vitest";

describe("Example Utility Test", () => {
  it("should perform basic arithmetic", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle string operations", () => {
    const str = "Hello, World!";
    expect(str.toLowerCase()).toBe("hello, world!");
  });
});
