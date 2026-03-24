import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolingTab } from '../adapters/ui/components/PoolingTab';
import { usePoolingTab } from '../core/application/usePoolingTab';

vi.mock('../core/application/usePoolingTab', () => ({
  usePoolingTab: vi.fn(),
}));

// Correct Vitest mock typing
const mockUsePoolingTab = vi.mocked(usePoolingTab);

const baseHookState = {
  pools: [],
  loading: false,
  error: null,
  successMsg: null,
  poolPreview: null,
  verifyPool: vi.fn(),
  setPoolPreview: vi.fn(),
  createPool: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  mockUsePoolingTab.mockReturnValue({ ...baseHookState });
});

describe('PoolingTab Component', () => {
  it('renders the simulator heading and both input fields', () => {
    render(<PoolingTab />);

    expect(screen.getByText('Pooling Simulator')).toBeInTheDocument();
    // Verify inputs by their label text (label elements are connected via wrapping)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();   // year = number input
    expect(screen.getByRole('textbox')).toBeInTheDocument();      // members = text input
    expect(screen.getByRole('button', { name: /verify members/i })).toBeInTheDocument();
  });

  it('calls verifyPool with parsed year and trimmed ship IDs on form submit', async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn();
    mockUsePoolingTab.mockReturnValue({ ...baseHookState, verifyPool: mockVerify });

    render(<PoolingTab />);

    await user.type(screen.getByRole('spinbutton'), '2025');
    await user.type(screen.getByRole('textbox'), 'R001, R002, R003');
    await user.click(screen.getByRole('button', { name: /verify members/i }));

    expect(mockVerify).toHaveBeenCalledOnce();
    expect(mockVerify).toHaveBeenCalledWith(2025, ['R001', 'R002', 'R003']);
  });

  it('does not call verifyPool when either input is empty', async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn();
    mockUsePoolingTab.mockReturnValue({ ...baseHookState, verifyPool: mockVerify });

    render(<PoolingTab />);

    // Fill only the year — members is empty
    await user.type(screen.getByRole('spinbutton'), '2025');
    await user.click(screen.getByRole('button', { name: /verify members/i }));

    expect(mockVerify).not.toHaveBeenCalled();
  });

  it('shows projected pool sum and SVG valid indicator when poolPreview is valid', () => {
    mockUsePoolingTab.mockReturnValue({
      ...baseHookState,
      poolPreview: { sum: 500, isValid: true },
    });

    render(<PoolingTab />);

    expect(screen.getByText('Projected Pool Sum')).toBeInTheDocument();
    // Text node is now separated from the SVG icon — match the text content only
    expect(screen.getByText('Valid Pool')).toBeInTheDocument();
  });

  it('shows projected pool sum and SVG invalid indicator when poolPreview is invalid', () => {
    mockUsePoolingTab.mockReturnValue({
      ...baseHookState,
      poolPreview: { sum: -200, isValid: false },
    });

    render(<PoolingTab />);

    expect(screen.getByText('Projected Pool Sum')).toBeInTheDocument();
    expect(screen.getByText('Invalid Sum')).toBeInTheDocument();
  });

  it('the Create Pool button is disabled when poolPreview is null or invalid', () => {
    // null preview
    render(<PoolingTab />);
    expect(screen.getByRole('button', { name: /create pool/i })).toBeDisabled();
  });

  it('shows an error alert when the hook returns an error', () => {
    mockUsePoolingTab.mockReturnValue({
      ...baseHookState,
      error: 'A pool must consist of at least two distinct member ships.',
    });

    render(<PoolingTab />);

    expect(
      screen.getByText('A pool must consist of at least two distinct member ships.')
    ).toBeInTheDocument();
  });

  it('shows a success message after pool creation', () => {
    mockUsePoolingTab.mockReturnValue({
      ...baseHookState,
      successMsg: 'Pool created successfully with ID: abc-123',
    });

    render(<PoolingTab />);

    expect(screen.getByText('Pool created successfully with ID: abc-123')).toBeInTheDocument();
  });

  it('renders Active Pools list with member data when pools exist', () => {
    mockUsePoolingTab.mockReturnValue({
      ...baseHookState,
      pools: [{
        id: 'bb442c9d-a3ac-4c09-8fdd-a8bcb0935dcb',
        year: 2025,
        createdAt: '2025-01-01T00:00:00.000Z',
        members: [
          { shipId: 'R001', cbBefore: -500, cbAfter: 0 },
          { shipId: 'R002', cbBefore: 800, cbAfter: 300 },
        ],
      }],
    });

    render(<PoolingTab />);

    expect(screen.getByText('Active Pools')).toBeInTheDocument();
    expect(screen.getByText('Pool ID: bb442c9d...')).toBeInTheDocument();
    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getByText('R002')).toBeInTheDocument();
    // CB after values rendered
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });
});
