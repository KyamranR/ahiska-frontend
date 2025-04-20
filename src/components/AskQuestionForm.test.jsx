import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AskQuestionForm from "./AskQuestionForm";
import AhiskaApi from "../api/AhiskaApi";

// Mock the API
vi.mock("../api/AhiskaApi");

describe("AskQuestionForm component", () => {
  it("renders form elements", () => {
    render(<AskQuestionForm onQuestionCreated={() => {}} />);
    expect(screen.getByPlaceholderText(/your question/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ask/i })).toBeInTheDocument();
  });

  it("calls onQuestionCreated and clears textarea on successful submit", async () => {
    const mockQuestion = { id: 1, text: "What is React?" };
    AhiskaApi.createQuestion.mockResolvedValueOnce({ question: mockQuestion });

    const mockOnQuestionCreated = vi.fn();

    render(<AskQuestionForm onQuestionCreated={mockOnQuestionCreated} />);

    const textarea = screen.getByPlaceholderText(/your question/i);
    const button = screen.getByRole("button", { name: /ask/i });

    fireEvent.change(textarea, { target: { value: "What is React?" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnQuestionCreated).toHaveBeenCalledWith(mockQuestion);
      expect(textarea.value).toBe("");
    });
  });

  it("logs error if createQuestion fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    AhiskaApi.createQuestion.mockRejectedValueOnce(new Error("API Error"));

    render(<AskQuestionForm onQuestionCreated={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(/your question/i), {
      target: { value: "Test failure" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Error creating question:",
        expect.any(Error)
      );
    });

    errorSpy.mockRestore();
  });
});
