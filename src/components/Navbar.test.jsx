import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { vi } from "vitest";

// Mock the useAuth hook
vi.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuthValue,
}));

let mockUseAuthValue;

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe("Navbar", () => {
  beforeEach(() => {
    mockUseAuthValue = { currentUser: null, logout: vi.fn() };
  });

  it("renders main links", () => {
    renderNavbar();
    expect(screen.getByText(/Ahiska Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
    expect(screen.getByText(/Q and A/i)).toBeInTheDocument();
  });

  it("shows login/signup when no user is logged in", () => {
    renderNavbar();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it("shows user greeting and logout button when logged in", () => {
    mockUseAuthValue = {
      currentUser: { firstName: "Jane" },
      logout: vi.fn(),
    };
    renderNavbar();
    expect(screen.getByText(/welcome, jane/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("shows Admin Panel when user is admin", () => {
    mockUseAuthValue = {
      currentUser: { firstName: "Admin", role: "admin" },
      logout: vi.fn(),
    };
    renderNavbar();
    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  });
});
