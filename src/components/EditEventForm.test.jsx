import { render, screen, fireEvent } from "@testing-library/react";
import EventForm from "./EventForm";
import { vi } from "vitest";
import React from "react";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ currentUser: { id: 1 } }),
}));

// Mock API
vi.mock("../api/AhiskaApi", () => ({
  default: {
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
  },
}));

describe("EventForm", () => {
  it("renders the form inputs", () => {
    render(<EventForm onEventCreated={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });

  it("submits the form with entered values", async () => {
    const mockCreate = (await import("../api/AhiskaApi")).default.createEvent;
    const onEventCreated = vi.fn();

    render(<EventForm onEventCreated={onEventCreated} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Test Event", name: "title" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Event description", name: "description" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2025-04-30", name: "event_date" },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: "6:00 PM", name: "event_time" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "New York", name: "location" },
    });

    fireEvent.click(screen.getByText(/Create Event/i));

    await screen.findByText(/Create Event/i);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Event",
        description: "Event description",
        event_date: "2025-04-30",
        event_time: "6:00 PM",
        location: "New York",
        created_by: 1,
      })
    );
    expect(onEventCreated).toHaveBeenCalled();
  });
});
