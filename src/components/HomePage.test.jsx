import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { vi } from "vitest";
import AhiskaApi from "../api/AhiskaApi";
import { AuthProvider } from "../context/AuthContext";

// Mock the API
vi.mock("../api/AhiskaApi", async () => {
  const actual = await vi.importActual("../api/AhiskaApi");
  return {
    default: {
      ...actual.default,
      request: vi.fn(),
    },
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithProviders() {
    return render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );
  }

  it("displays a message when no events are available", async () => {
    AhiskaApi.request.mockResolvedValueOnce({ events: [] });

    renderWithProviders();

    await waitFor(() =>
      expect(screen.getByText(/no events available/i)).toBeInTheDocument()
    );
  });

  it("displays a list of events when available", async () => {
    AhiskaApi.request.mockResolvedValueOnce({
      events: [
        {
          id: 1,
          title: "Cultural Gathering",
          event_date: "2025-06-10",
          event_time: "18:00",
          description: "An evening of culture, food, and music.",
        },
      ],
    });

    renderWithProviders();

    await waitFor(() =>
      expect(screen.getByText(/cultural gathering/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/an evening of culture/i)).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    AhiskaApi.request.mockRejectedValueOnce(new Error("API failure"));

    renderWithProviders();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load events:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
