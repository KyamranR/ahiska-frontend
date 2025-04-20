import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventsPage from "../components/EventsPage";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AhiskaApi from "../api/AhiskaApi";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock API
vi.mock("../api/AhiskaApi", () => ({
  default: {
    getAllEvents: vi.fn(),
    getFeedback: vi.fn(),
    getUserRegistrations: vi.fn(),
    registerForEvent: vi.fn(),
    unregisterFromEvent: vi.fn(),
    addFeedback: vi.fn(),
  },
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

const mockEvent = {
  id: 1,
  title: "Test Event",
  description: "Event description",
  event_date: "2025-04-30",
  event_time: "6:00 PM",
  location: "New York",
};

const mockFeedback = [
  {
    id: 101,
    firstName: "John",
    lastName: "Doe",
    content: "Great event!",
  },
];

describe("EventsPage", () => {
  it("renders events and feedback for logged-in user", async () => {
    useAuth.mockReturnValue({
      currentUser: { id: 1, username: "testuser" },
    });

    AhiskaApi.getAllEvents.mockResolvedValue({ events: [mockEvent] });
    AhiskaApi.getFeedback.mockResolvedValue({ feedback: mockFeedback });
    AhiskaApi.getUserRegistrations.mockResolvedValue({
      registrations: { registration: [{ eventId: 1 }] },
    });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Event")).toBeInTheDocument();
    expect(screen.getByText("Great event!")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /unregister/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add feedback/i })
    ).toBeInTheDocument();
  });

  it("submits feedback for an event", async () => {
    useAuth.mockReturnValue({
      currentUser: { id: 1, username: "testuser" },
    });

    AhiskaApi.getAllEvents.mockResolvedValue({ events: [mockEvent] });
    AhiskaApi.getFeedback.mockResolvedValue({ feedback: [] });
    AhiskaApi.getUserRegistrations.mockResolvedValue({
      registrations: { registration: [] },
    });
    AhiskaApi.addFeedback.mockResolvedValue({});

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    const addFeedbackBtn = await screen.findByRole("button", {
      name: /add feedback/i,
    });

    fireEvent.click(addFeedbackBtn);

    const textarea = screen.getByPlaceholderText("Leave feedback...");
    fireEvent.change(textarea, { target: { value: "This is my feedback" } });

    const submitBtn = screen.getByRole("button", {
      name: /submit feedback/i,
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(AhiskaApi.addFeedback).toHaveBeenCalledWith(1, {
        content: "This is my feedback",
      });
    });
  });

  it("toggles register and unregister", async () => {
    useAuth.mockReturnValue({
      currentUser: { id: 1, username: "testuser" },
    });

    AhiskaApi.getAllEvents.mockResolvedValue({ events: [mockEvent] });
    AhiskaApi.getFeedback.mockResolvedValue({ feedback: [] });
    AhiskaApi.getUserRegistrations.mockResolvedValue({
      registrations: { registration: [] },
    });

    AhiskaApi.registerForEvent.mockResolvedValue({});
    AhiskaApi.unregisterFromEvent.mockResolvedValue({});

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    const registerBtn = await screen.findByRole("button", {
      name: /register/i,
    });
    fireEvent.click(registerBtn);

    await waitFor(() => {
      expect(AhiskaApi.registerForEvent).toHaveBeenCalledWith(1);
    });

    fireEvent.click(screen.getByRole("button", { name: /unregister/i }));

    await waitFor(() => {
      expect(AhiskaApi.unregisterFromEvent).toHaveBeenCalledWith(1);
    });
  });

  it("redirects to login if unauthenticated user tries to register", async () => {
    useAuth.mockReturnValue({ currentUser: null });

    AhiskaApi.getAllEvents.mockResolvedValue({ events: [mockEvent] });
    AhiskaApi.getFeedback.mockResolvedValue({ feedback: [] });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    const registerBtn = await screen.findByRole("button", {
      name: /register/i,
    });

    fireEvent.click(registerBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("does not show Add Feedback button if user is not logged in", async () => {
    useAuth.mockReturnValue({ currentUser: null });

    AhiskaApi.getAllEvents.mockResolvedValue({ events: [mockEvent] });
    AhiskaApi.getFeedback.mockResolvedValue({ feedback: mockFeedback });

    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Event")).toBeInTheDocument();
    const feedbackBtn = screen.queryByRole("button", {
      name: /add feedback/i,
    });

    expect(feedbackBtn).not.toBeInTheDocument();
  });
});
