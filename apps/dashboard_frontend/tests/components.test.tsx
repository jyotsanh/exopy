/**
 * Component tests with React Testing Library.
 *
 * No mocks — components are rendered with real children and real handlers.
 * We only provide context wrappers (router, ThemeProvider) where the component
 * pulls from those contexts.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import InputField from "@/features/auth/components/InputField";
import PagenotFound from "@/pages/pagenotfound/PagenotFound";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { ThemeProvider, useTheme } from "@/components/theme/ThemeProvider";

describe("<InputField />", () => {
  it("renders the label and uses it as the input's accessible name", () => {
    render(
      <InputField
        id="email"
        label="Email"
        placeholder="you@example.com"
        register={{}}
      />,
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("forwards the placeholder to the input", () => {
    render(
      <InputField
        id="email"
        label="Email"
        placeholder="you@example.com"
        register={{}}
      />,
    );
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("defaults type to 'text' but accepts overrides", () => {
    const { rerender } = render(
      <InputField id="x" label="X" placeholder="x" register={{}} />,
    );
    expect(screen.getByLabelText("X")).toHaveAttribute("type", "text");

    rerender(
      <InputField id="x" label="X" placeholder="x" register={{}} type="email" />,
    );
    expect(screen.getByLabelText("X")).toHaveAttribute("type", "email");
  });

  it("shows the error message only when one is provided", () => {
    const { rerender } = render(
      <InputField id="x" label="X" placeholder="x" register={{}} />,
    );
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();

    rerender(
      <InputField
        id="x"
        label="X"
        placeholder="x"
        register={{}}
        error="Email is required"
      />,
    );
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });
});

describe("<PagenotFound />", () => {
  // PagenotFound uses <Link>, so it needs a Router context.
  const renderPage = () =>
    render(
      <MemoryRouter>
        <PagenotFound />
      </MemoryRouter>,
    );

  it("renders the 404 heading and supporting text", () => {
    renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/page not found/i);
  });

  it("renders a link back to the home page", () => {
    renderPage();
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});

describe("<ThemeToggle /> + <ThemeProvider />", () => {
  // A small probe so we can read the current theme inside the test tree.
  const ThemeProbe = () => {
    const { theme } = useTheme();
    return <span data-testid="theme">{theme}</span>;
  };

  it("starts in light mode by default (no system pref, no localStorage)", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    // Aria label reflects the action available, not the current state
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it("clicking the toggle flips the theme and updates the <html> class", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    // The aria label updates after the flip
    expect(
      screen.getByRole("button", { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it("persists the selected theme to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button"));
    expect(window.localStorage.getItem("exopy-theme")).toBe("dark");
  });

  it("reads the persisted theme on mount", () => {
    window.localStorage.setItem("exopy-theme", "dark");
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: /switch to light mode/i }),
    ).toBeInTheDocument();
  });

  it("useTheme throws when used outside the provider", () => {
    // Suppress React's error-boundary console noise for this expected throw.
    const consoleError = console.error;
    console.error = () => {};
    try {
      expect(() => render(<ThemeProbe />)).toThrow(
        /useTheme must be used within ThemeProvider/,
      );
    } finally {
      console.error = consoleError;
    }
  });
});
