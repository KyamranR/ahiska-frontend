import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuestionItem from "./QuestionItem";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";

vi.mock("../api/AhiskaApi");
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("QuestionItem component", () => {
  const mockUser = { id: 1, firstName: "Jane", lastName: "Doe" };

  const question = {
    id: 123,
    question: "What is React?",
    askedBy: 1,
    askedByFirstName: "Jane",
    askedByLastName: "Doe",
    answers: [
      {
        id: 1,
        answer: "React is a JavaScript library.",
        answeredByFirstName: "John",
        answeredByLastName: "Smith",
      },
    ],
  };

  beforeEach(() => {
    useAuth.mockReturnValue({ currentUser: mockUser });
    vi.clearAllMocks();
  });

  it("renders question and asked by info", () => {
    render(
      <QuestionItem
        question={question}
        onQuestionAnswered={vi.fn()}
        onQuestionDeleted={vi.fn()}
      />
    );

    expect(screen.getByText(/What is React/i)).toBeInTheDocument();
    expect(screen.getByText(/Asked by: Jane Doe/i)).toBeInTheDocument();
  });

  it("displays all answers", () => {
    render(
      <QuestionItem
        question={question}
        onQuestionAnswered={vi.fn()}
        onQuestionDeleted={vi.fn()}
      />
    );

    expect(
      screen.getByText(/React is a JavaScript library/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Answered by: John Smith/i)).toBeInTheDocument();
  });

  it("shows 'No answers yet' when there are no answers", () => {
    const questionWithNoAnswers = { ...question, answers: [] };

    render(
      <QuestionItem
        question={questionWithNoAnswers}
        onQuestionAnswered={vi.fn()}
        onQuestionDeleted={vi.fn()}
      />
    );

    expect(screen.getByText(/No answers yet/i)).toBeInTheDocument();
  });

  it("toggles the answer form", () => {
    render(
      <QuestionItem
        question={question}
        onQuestionAnswered={vi.fn()}
        onQuestionDeleted={vi.fn()}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /Add Answer/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByPlaceholderText(/Your Answer/i)).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(
      screen.queryByPlaceholderText(/Your Answer/i)
    ).not.toBeInTheDocument();
  });

  it("submits an answer and calls onQuestionAnswered", async () => {
    const mockOnAnswered = vi.fn();
    const newAnswers = [
      ...question.answers,
      {
        id: 2,
        answer: "React lets you build UIs",
        answeredByFirstName: "Jane",
        answeredByLastName: "Doe",
      },
    ];

    AhiskaApi.answerQuestion.mockResolvedValueOnce({ answers: newAnswers });

    render(
      <QuestionItem
        question={question}
        onQuestionAnswered={mockOnAnswered}
        onQuestionDeleted={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Add Answer/i));

    const textarea = screen.getByPlaceholderText(/Your Answer/i);
    fireEvent.change(textarea, {
      target: { value: "React lets you build UIs" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit Answer/i }));

    await waitFor(() => {
      expect(AhiskaApi.answerQuestion).toHaveBeenCalledWith(
        question.id,
        "React lets you build UIs"
      );
      expect(mockOnAnswered).toHaveBeenCalledWith({
        ...question,
        answers: newAnswers,
      });
    });
  });

  it("deletes question when confirmed", async () => {
    const mockDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    AhiskaApi.deleteQuestion.mockResolvedValueOnce();

    render(
      <QuestionItem
        question={question}
        onQuestionAnswered={vi.fn()}
        onQuestionDeleted={mockDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(AhiskaApi.deleteQuestion).toHaveBeenCalledWith(question.id);
      expect(mockDelete).toHaveBeenCalledWith(question.id);
    });
  });
});
