import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "../components/ContactPage";
import { vi } from "vitest";
import emailjs from "emailjs-com";

// Mock emailjs
vi.mock("emailjs-com", () => ({
  default: {
    send: vi.fn(),
  },
}));

describe("Contact component", () => {
  beforeEach(() => {
    emailjs.send.mockReset();
  });

  it("renders form inputs correctly", () => {
    render(<Contact />);

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your message...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("updates form fields on user input", () => {
    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "John", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@example.com"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello", name: "subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message..."), {
      target: { value: "Just saying hi", name: "message" },
    });

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Just saying hi")).toBeInTheDocument();
  });

  it("submits the form and shows success message", async () => {
    emailjs.send.mockResolvedValueOnce({ status: 200 });

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "Jane", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@example.com"), {
      target: { value: "jane@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Greetings", name: "subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message..."), {
      target: { value: "Test message", name: "message" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/message sent successfully/i)
      ).toBeInTheDocument();
    });

    expect(emailjs.send).toHaveBeenCalledWith(
      "service_swsrve9",
      "template_we5dqc9",
      {
        name: "Jane",
        email: "jane@example.com",
        subject: "Greetings",
        message: "Test message",
      },
      "9zaM_GwjLLtVqw2Kj"
    );
  });

  it("shows error message if emailjs.send fails", async () => {
    emailjs.send.mockRejectedValueOnce(new Error("Failed"));

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), {
      target: { value: "John", name: "name" },
    });
    fireEvent.change(screen.getByPlaceholderText("your@example.com"), {
      target: { value: "john@example.com", name: "email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Oops", name: "subject" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message..."), {
      target: { value: "Something went wrong", name: "message" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });
});
