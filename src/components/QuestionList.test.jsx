import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuestionList from "./QuestionList";
import AhiskaApi from "../api/AhiskaApi";
import { useAuth } from "../context/AuthContext";

vi.mock("../api/AhiskaApi");
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./AskQuestionForm.jsx", () => ({
  default: ({ onQuestionCreated }) => (
    <button onClick={() => onQuestionCreated(mockNewQuestion)}>
      Mock Ask Form
    </button>
  ),
}));

vi.mock("./QuestionItem.jsx", () => ({
  default: ({ question, onQuestionAnswered, onQuestionDeleted }) => (
    <div data-testid="question-item">
      <p>{question.question}</p>

      {question.answers.map((ans, idx) => (
        <p key={idx}>{ans.answer}</p>
      ))}
      <button onClick={() => onQuestionAnswered(mockUpdatedQuestion)}>
        Mock Answer
      </button>
      <button onClick={() => onQuestionDeleted(question.id)}>
        Mock Delete
      </button>
    </div>
  ),
}));

const mockUser = { id: 1, firstName: "Test", lastName: "User" };
const mockQuestion = {
  id: 100,
  question: "What is React?",
  askedBy: 1,
  askedByFirstName: "Jane",
  askedByLastName: "Doe",
  answers: [],
};
const mockNewQuestion = {
  id: 101,
  question: "What is Tailwind?",
  askedBy: 1,
  askedByFirstName: "Jane",
  askedByLastName: "Doe",
  answers: [],
};
const mockUpdatedQuestion = {
  ...mockQuestion,
  answers: [
    {
      id: 2,
      answer: "A JS library",
      answeredByFirstName: "John",
      answeredByLastName: "Smith",
    },
  ],
};

describe("QuestionList", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ currentUser: mockUser });
    AhiskaApi.getAllQAndA.mockResolvedValue({ questions: [mockQuestion] });
  });

  it("fetches and displays questions on mount", async () => {
    render(<QuestionList />);
    await waitFor(() => {
      expect(screen.getByText(/What is React/i)).toBeInTheDocument();
    });
  });

  it("displays 'No questions available' if none fetched", async () => {
    AhiskaApi.getAllQAndA.mockResolvedValue({ questions: [] });
    render(<QuestionList />);
    await waitFor(() => {
      expect(screen.getByText(/No questions available/i)).toBeInTheDocument();
    });
  });

  it("renders AskQuestionForm when user is logged in", async () => {
    render(<QuestionList />);
    await waitFor(() => {
      expect(screen.getByText("Mock Ask Form")).toBeInTheDocument();
    });
  });

  it("adds a new question on handleQuestionCreated", async () => {
    render(<QuestionList />);

    const askButton = screen.getByText(/mock ask form/i);
    fireEvent.click(askButton);

    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock Ask Form"));
    });

    expect(screen.getByText(/What is Tailwind/i)).toBeInTheDocument();
  });

  it("updates a question on handleQuestionAnswered", async () => {
    render(<QuestionList />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock Answer"));
    });

    expect(screen.getByText(/A JS library/i)).toBeInTheDocument();
  });

  it("deletes a question on handleQuestionDeleted", async () => {
    render(<QuestionList />);
    await waitFor(() => {
      fireEvent.click(screen.getByText("Mock Delete"));
    });

    expect(screen.queryByText(/What is React/i)).not.toBeInTheDocument();
  });
});
