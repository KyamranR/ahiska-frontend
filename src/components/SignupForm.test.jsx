import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../components/SignupForm";
import { BrowserRouter } from "react-router-dom";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";

// Mock useAuth
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock AhiskaApi
vi.mock("../api/AhiskaApi", () => ({
  default: {
    register: vi.fn(),
    decodeToken: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

// Mock react-router-dom useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ login: mockLogin });
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <SignupForm />
    </BrowserRouter>
  );

describe("SignupForm", () => {
  it("renders all fields and submit button", () => {
    renderComponent();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("allows user to type in fields", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText(/first name/i).value).toBe("Jane");
    expect(screen.getByLabelText(/last name/i).value).toBe("Doe");
    expect(screen.getByLabelText(/email/i).value).toBe("jane@example.com");
    expect(screen.getByLabelText(/password/i).value).toBe("password123");
  });

  it("calls API, logs in user and navigates on success", async () => {
    const fakeToken = "fake.token.string";
    const decoded = { userId: 42 };
    const user = { id: 42, name: "Jane" };

    AhiskaApi.register.mockResolvedValue(fakeToken);
    AhiskaApi.decodeToken.mockReturnValue(decoded);
    AhiskaApi.getCurrentUser.mockResolvedValue({ user });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(AhiskaApi.register).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
      });
      expect(AhiskaApi.decodeToken).toHaveBeenCalledWith(fakeToken);
      expect(AhiskaApi.getCurrentUser).toHaveBeenCalledWith(42);
      expect(mockLogin).toHaveBeenCalledWith(user, fakeToken);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error on failed signup", async () => {
    AhiskaApi.register.mockRejectedValue({ error: "Email already in use" });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already in use")).toBeInTheDocument();
    });
  });
});
