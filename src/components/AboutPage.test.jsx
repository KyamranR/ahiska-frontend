import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AboutPage from "./AboutPage";

describe("AboutPage", () => {
  it("renders without crashing", () => {
    render(<AboutPage />);
  });

  it("Displays the heading text", () => {
    render(<AboutPage />);
    expect(screen.getByText(/About Ahiska Community/i)).toBeInTheDocument();
  });
});
