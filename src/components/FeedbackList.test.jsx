import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FeedbackList from "./FeedbackList";
import AhiskaApi from "../api/AhiskaApi";

// Mock the API
vi.mock("../api/AhiskaApi");

const mockFeedback = [
  { id: 1, content: "Great event!", eventId: 101 },
  { id: 2, content: "Needs improvement", eventId: 102 },
];

describe("FeedbackList component", () => {
  it("renders feedback items", () => {
    render(<FeedbackList feedback={mockFeedback} refreshFeedback={vi.fn()} />);

    expect(screen.getByText("Great event!")).toBeInTheDocument();
    expect(screen.getByText("Needs improvement")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2);
  });

  it("calls deleteFeedback and refreshFeedback on delete", async () => {
    AhiskaApi.deleteFeedback.mockResolvedValueOnce();
    const refreshFeedback = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(
      <FeedbackList feedback={mockFeedback} refreshFeedback={refreshFeedback} />
    );

    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(AhiskaApi.deleteFeedback).toHaveBeenCalledWith(101, 1);
      expect(refreshFeedback).toHaveBeenCalled();
    });
  });

  it("logs error if deleteFeedback fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    AhiskaApi.deleteFeedback.mockRejectedValueOnce(new Error("Delete error"));

    render(<FeedbackList feedback={mockFeedback} refreshFeedback={vi.fn()} />);

    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Error deleting feedback:",
        expect.any(Error)
      );
    });

    errorSpy.mockRestore();
  });
});
