import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Profile from "./Profile";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";
import { useNavigate } from "react-router-dom";

// Mock modules
vi.mock("../api/AhiskaApi");
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Profile component", () => {
  let mockNavigate;
  let setCurrentUserMock;
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    bio: "Hello, I'm John!",
    profilePic: "https://example.com/profile.jpg",
  };

  beforeEach(() => {
    mockNavigate = vi.fn();
    setCurrentUserMock = vi.fn();

    useAuth.mockReturnValue({
      currentUser: mockUser,
      setCurrentUser: setCurrentUserMock,
    });

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    Object.defineProperty(window, "localStorage", {
      value: {
        removeItem: vi.fn(),
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders profile information when not in edit mode", () => {
    render(<Profile />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Hello, I'm John!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete profile/i })
    ).toBeInTheDocument();
  });

  it("renders the edit profile form when clicking the 'Edit Profile' button", () => {
    render(<Profile />);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Bio")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Profile Picture URL")
    ).toBeInTheDocument();
  });

  it("submits updated profile information", async () => {
    AhiskaApi.updateUser.mockResolvedValueOnce({
      user: { ...mockUser, firstName: "Jane", lastName: "Smith" },
    });

    render(<Profile />);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const bioInput = screen.getByPlaceholderText("Bio");
    const profilePicInput = screen.getByPlaceholderText("Profile Picture URL");

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(bioInput, { target: { value: "Updated bio" } });
    fireEvent.change(profilePicInput, {
      target: { value: "https://example.com/new-profile.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(AhiskaApi.updateUser).toHaveBeenCalledWith(1, {
        firstName: "Jane",
        lastName: "Smith",
        bio: "Updated bio",
        profilePic: "https://example.com/new-profile.jpg",
      });
    });
  });

  it("shows confirmation when deleting profile", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    AhiskaApi.deleteUser.mockResolvedValueOnce();

    render(<Profile />);

    fireEvent.click(screen.getByRole("button", { name: /delete profile/i }));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledWith(
        "Are you sure you want to delete your profile? This action cannot be undone."
      );
      expect(AhiskaApi.deleteUser).toHaveBeenCalledWith(1);
      expect(localStorage.removeItem).toHaveBeenCalledWith("token");
      expect(localStorage.removeItem).toHaveBeenCalledWith("user");
      expect(setCurrentUserMock).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("navigates to change password page when 'Change Password' button is clicked", () => {
    render(<Profile />);

    fireEvent.click(screen.getByRole("button", { name: /change password/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/change-password");
  });
});
