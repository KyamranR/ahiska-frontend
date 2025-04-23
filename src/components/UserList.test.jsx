import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "../components/UserList";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AhiskaApi from "../api/AhiskaApi";

// Mock API methods
vi.mock("../api/AhiskaApi", () => ({
  default: {
    deleteUserAdmin: vi.fn(),
    updatedUserRole: vi.fn(),
  },
}));

const mockUsers = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    role: "user",
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    role: "admin",
  },
];

const mockRefresh = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserList", () => {
  it("renders users and their roles", () => {
    render(<UserList users={mockUsers} refreshUsers={mockRefresh} />);

    expect(
      screen.getByText("Alice Smith (alice@example.com)")
    ).toBeInTheDocument();
    expect(screen.getByText("Role: user")).toBeInTheDocument();

    expect(
      screen.getByText("Bob Johnson (bob@example.com)")
    ).toBeInTheDocument();
    expect(screen.getByText("Role: admin")).toBeInTheDocument();
  });

  it("calls deleteUserAdmin and refreshUsers on delete", async () => {
    AhiskaApi.deleteUserAdmin.mockResolvedValue({});

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<UserList users={mockUsers} refreshUsers={mockRefresh} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(AhiskaApi.deleteUserAdmin).toHaveBeenCalledWith(1);
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("updates role and refreshes", async () => {
    AhiskaApi.updatedUserRole.mockResolvedValue({});

    render(<UserList users={mockUsers} refreshUsers={mockRefresh} />);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "admin" } });

    const updateButtons = screen.getAllByRole("button", {
      name: /update role/i,
    });
    fireEvent.click(updateButtons[0]);

    await waitFor(() => {
      expect(AhiskaApi.updatedUserRole).toHaveBeenCalledWith(1, "admin");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("allows switching roles and does not call API until update is clicked", async () => {
    render(<UserList users={mockUsers} refreshUsers={mockRefresh} />);

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "user" } });

    expect(AhiskaApi.updatedUserRole).not.toHaveBeenCalled();

    const updateButtons = screen.getAllByRole("button", {
      name: /update role/i,
    });
    fireEvent.click(updateButtons[1]);

    await waitFor(() => {
      expect(AhiskaApi.updatedUserRole).toHaveBeenCalledWith(2, "user");
    });
  });
});
