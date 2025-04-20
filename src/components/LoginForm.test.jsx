import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../components/LoginForm";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";

// Mock navigate from react-router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth context
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

// Mock AhiskaApi login
vi.mock("../api/AhiskaApi", () => ({
  default: {
    login: vi.fn(),
  },
}));

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("LoginForm", () => {
  it("renders form inputs and button", () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("submits login form and redirects", async () => {
    const mockUser = { id: 1, email: "test@example.com" };
    const mockToken = "mock-token";

    AhiskaApi.login.mockResolvedValueOnce({ user: mockUser, token: mockToken });

    renderWithRouter(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(AhiskaApi.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays an error message on failed login", async () => {
    AhiskaApi.login.mockRejectedValueOnce({
      error: { message: "Invalid credentials" },
    });

    renderWithRouter(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});
