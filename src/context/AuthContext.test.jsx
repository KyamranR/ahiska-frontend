import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TestComponent = () => {
  const { currentUser, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="user">{currentUser ? currentUser.username : "None"}</p>
      <button onClick={() => login({ username: "tester" }, "mock-token")}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const setup = () =>
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user", () => {
    setup();
    expect(screen.getByTestId("user").textContent).toBe("None");
  });

  it("logs in and sets user", async () => {
    setup();
    act(() => {
      screen.getByText("Login").click();
    });

    await waitFor(() =>
      expect(screen.getByTestId("user").textContent).toBe("tester")
    );
    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      username: "tester",
    });
  });

  it("logs out and clears user", () => {
    setup();
    act(() => {
      screen.getByText("Login").click();
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("None");
    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("user")).toBe(null);
  });

  it("restores user from localStorage on mount", () => {
    localStorage.setItem("token", "saved-token");
    localStorage.setItem("user", JSON.stringify({ username: "savedUser" }));
    setup();
    expect(screen.getByTestId("user").textContent).toBe("savedUser");
  });
});
