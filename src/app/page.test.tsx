import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home Page", () => {
  it("should render the heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Porject Initiation");
  });

  it("should render the main container", () => {
    render(<Home />);
    const container = screen.getByRole("heading").closest("div");
    expect(container).toBeInTheDocument();
  });
});
