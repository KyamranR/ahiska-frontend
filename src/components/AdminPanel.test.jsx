import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminPanel from "./AdminPanel";
import { vi } from "vitest";

// Mock AuthContext
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    currentUser: { role: "admin", username: "adminUser" },
  }),
}));

// Mock AhiskaApi
vi.mock("../api/AhiskaApi", () => ({
  default: {
    getAllUsers: vi.fn().mockResolvedValue({
      users: [{ id: 1, username: "user1" }],
    }),
    getAllEventsAdmin: vi.fn().mockResolvedValue({
      events: [{ id: 101, title: "Event One" }],
    }),
    getFeedback: vi.fn().mockResolvedValue({
      feedback: [{ id: 201, content: "Great event!" }],
    }),
    deleteEventAdmin: vi.fn().mockResolvedValue({}),
    deleteFeedback: vi.fn().mockResolvedValue({}),
  },
}));

// Mock child components
vi.mock("./EventForm", () => ({
  default: () => <div>Mocked EventForm</div>,
}));

vi.mock("./EditEventForm", () => ({
  default: () => <div>Mocked EditEventForm</div>,
}));

vi.mock("./UserList", () => ({
  default: ({ users }) => <div>Mocked UserList ({users.length})</div>,
}));

vi.mock("./FeedbackList", () => ({
  default: () => <div>Mocked FeedbackList</div>,
}));

describe("AdminPanel", () => {
  it("renders the Admin Panel and displays events tab by default", async () => {
    render(<AdminPanel />);

    expect(screen.getByText("Admin Panel")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Event One")).toBeInTheDocument();
    });

    expect(screen.getByText("Create Event")).toBeInTheDocument();
  });

  it("switches to Feedback tab when clicked", async () => {
    render(<AdminPanel />);
    const feedbackTab = screen.getByRole("tab", { name: "Feedback" });

    fireEvent.click(feedbackTab);

    await waitFor(() => {
      expect(screen.getByText("Great event!")).toBeInTheDocument();
    });
  });

  it("switches to Users tab and shows mocked UserList", async () => {
    render(<AdminPanel />);
    const usersTab = screen.getByRole("tab", { name: "Users" });

    fireEvent.click(usersTab);

    await waitFor(() => {
      expect(screen.getByText(/Mocked UserList/i)).toBeInTheDocument();
    });
  });
});
