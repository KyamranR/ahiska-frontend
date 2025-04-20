import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangePassword from "./ChangePassword";
import AhiskaApi from "../api/AhiskaApi";
import { useNavigate } from "react-router-dom";

// Mock modules
vi.mock("../api/AhiskaApi");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ currentUser: { id: 1, username: "testuser" } }),
}));

describe("ChangePassword component", () => {
  let mockNavigate;
  let alertSpy;

  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ChangePassword />);
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls API and navigates on success", async () => {
    AhiskaApi.changePassword.mockResolvedValueOnce();

    render(<ChangePassword />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "newpass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AhiskaApi.changePassword).toHaveBeenCalledWith(1, "newpass123");
      expect(alertSpy).toHaveBeenCalledWith("Password changed successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows error alert if API call fails", async () => {
    AhiskaApi.changePassword.mockRejectedValueOnce(new Error("Failed"));

    render(<ChangePassword />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    const submitButton = screen.getByRole("button", {
      name: /change password/i,
    });

    fireEvent.change(passwordInput, { target: { value: "badpass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Failed to change password.");
    });
  });
});
