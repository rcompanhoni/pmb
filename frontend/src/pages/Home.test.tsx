import { render, screen } from "@testing-library/react";
import Home from "./Home";
import Layout from "../components/Layout";

jest.mock("../components/Layout", () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock("../features/posts/components/PostList", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked PostList</div>),
}));
jest.mock("../components/Instructions", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div className="hidden md:block">Mocked Instructions</div>
  )),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Layout component", () => {
    render(<Home />);
    expect(Layout).toHaveBeenCalled();
  });

  it("renders PostList component", () => {
    render(<Home />);
    expect(screen.getByText("Mocked PostList")).toBeInTheDocument();
  });

  it("renders Instructions component on larger screens", () => {
    render(<Home />);
    expect(screen.getByText("Mocked Instructions")).toBeInTheDocument();
  });

  it("adds hidden class to Instructions on small screens", () => {
    // resize window
    global.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));

    render(<Home />);
    const instructionsElement = screen.getByText("Mocked Instructions");

    expect(instructionsElement).toHaveClass("hidden");
  });
});
