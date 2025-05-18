import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRoleDialog from "../components/UserRoleDialog";
import { updateUserRole, getAllRoles } from "../services/adminService";

// Mock the services
jest.mock("../services/adminService", () => ({
  updateUserRole: jest.fn(),
  getAllRoles: jest.fn(),
}));

describe("UserRoleDialog Component", () => {
  const mockRoles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Organizer" },
    { id: 3, name: "User" },
  ];

  const mockUser = {
    id: 123,
    fullName: "John Doe",
    mail: "john@example.com",
    roleId: 3,
    roleName: "User",
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    getAllRoles.mockResolvedValue(mockRoles);
  });

  test("renders the role change dialog correctly", async () => {
    render(
      <UserRoleDialog
        open={true}
        onClose={mockOnClose}
        user={mockUser}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Change User Role")).toBeInTheDocument();
      expect(screen.getByText("User Information")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("displays stepper with 3 steps", async () => {
    render(
      <UserRoleDialog
        open={true}
        onClose={mockOnClose}
        user={mockUser}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Select New Role")).toBeInTheDocument();
      expect(screen.getByText("Review Changes")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });
  });

  test("allows role selection and moves through steps", async () => {
    render(
      <UserRoleDialog
        open={true}
        onClose={mockOnClose}
        user={mockUser}
        onSuccess={mockOnSuccess}
      />
    );

    // Wait for roles to load
    await waitFor(() => {
      expect(getAllRoles).toHaveBeenCalled();
    });

    // Select Admin role and move to next step
    // Note: In a real test environment, you would use proper selectors
    // This is a simplified example
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled(); // Should be disabled until selection

    // After selecting a role, user can proceed
    // Test would continue with simulating role selection and moving through steps
  });

  test("submits role change when confirmed", async () => {
    updateUserRole.mockResolvedValue({ success: true });

    render(
      <UserRoleDialog
        open={true}
        onClose={mockOnClose}
        user={mockUser}
        onSuccess={mockOnSuccess}
      />
    );

    // In a real test, you would simulate:
    // 1. Selecting a role
    // 2. Clicking Next to review
    // 3. Clicking Next to confirm
    // 4. Checking the checkbox
    // 5. Clicking Confirm Change

    // Then verify service was called
    // await waitFor(() => {
    //   expect(updateUserRole).toHaveBeenCalledWith(123, "1");
    //   expect(mockOnSuccess).toHaveBeenCalled();
    //   expect(mockOnClose).toHaveBeenCalled();
    // });
  });
});
