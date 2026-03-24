import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankingTab } from '../adapters/ui/components/BankingTab';
import { useBankingTab } from '../core/application/useBankingTab';

vi.mock('../core/application/useBankingTab', () => ({
  useBankingTab: vi.fn(),
}));

// Correct Vitest mock typing — vi.mocked infers the right type automatically
const mockUseBankingTab = vi.mocked(useBankingTab);

const baseHookState = {
  cbRecord: null,
  adjustedCb: null,
  bankEntries: [],
  loading: false,
  error: null,
  loadShipData: vi.fn(),
  bankSurplus: vi.fn(),
  applyBanked: vi.fn(),
};

beforeEach(() => {
  // Reset all mocks between tests to prevent state bleed
  vi.resetAllMocks();
  mockUseBankingTab.mockReturnValue({ ...baseHookState });
});

describe('BankingTab Component', () => {
  it('renders the form with labelled inputs in the initial state', () => {
    render(<BankingTab />);

    expect(screen.getByText('Banking Dashboard')).toBeInTheDocument();

    // Query by accessible label — verifies that the label is *connected* to the input
    expect(screen.getByRole('textbox', { name: /route or ship id/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /compliance year/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load data/i })).toBeInTheDocument();
  });

  it('calls loadShipData with the correct arguments when form is submitted', async () => {
    const user = userEvent.setup();
    const mockLoad = vi.fn();
    mockUseBankingTab.mockReturnValue({ ...baseHookState, loadShipData: mockLoad });

    render(<BankingTab />);

    // userEvent.type simulates realistic keystroke-by-keystroke typing
    await user.type(screen.getByRole('textbox', { name: /route or ship id/i }), 'R001');
    await user.type(screen.getByRole('spinbutton', { name: /compliance year/i }), '2024');
    await user.click(screen.getByRole('button', { name: /load data/i }));

    expect(mockLoad).toHaveBeenCalledOnce();
    expect(mockLoad).toHaveBeenCalledWith('R001', 2024);
  });

  it('does not call loadShipData when either input is empty', async () => {
    const user = userEvent.setup();
    const mockLoad = vi.fn();
    mockUseBankingTab.mockReturnValue({ ...baseHookState, loadShipData: mockLoad });

    render(<BankingTab />);

    // Only fill ship ID, leave year empty
    await user.type(screen.getByRole('textbox', { name: /route or ship id/i }), 'R001');
    await user.click(screen.getByRole('button', { name: /load data/i }));

    expect(mockLoad).not.toHaveBeenCalled();
  });

  it('shows a skeleton loader while data is loading', () => {
    mockUseBankingTab.mockReturnValue({ ...baseHookState, loading: true });

    render(<BankingTab />);

    // The skeleton cards should render — query the shimmer divs
    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays an error message when the hook returns an error', () => {
    mockUseBankingTab.mockReturnValue({
      ...baseHookState,
      error: 'Ship not found',
    });

    render(<BankingTab />);

    expect(screen.getByText('Ship not found')).toBeInTheDocument();
  });

  it('renders compliance balance card when cbRecord is available', () => {
    mockUseBankingTab.mockReturnValue({
      ...baseHookState,
      cbRecord: { id: 'cb-001', shipId: 'R001', year: 2024, cbGco2eq: 1200 },
      adjustedCb: 1100,
      bankEntries: [],
    });

    render(<BankingTab />);

    expect(screen.getByText('Compliance Balance')).toBeInTheDocument();
    // Adjusted CB value is labelled inline
    expect(screen.getByText('1,100')).toBeInTheDocument();
  });

  it('renders bank ledger table when bankEntries are present', () => {
    mockUseBankingTab.mockReturnValue({
      ...baseHookState,
      cbRecord: { id: 'cb-001', shipId: 'R001', year: 2024, cbGco2eq: 500 },
      adjustedCb: 500,
      bankEntries: [
        { id: 'entry-abc-123', shipId: 'R001', year: 2024, amountGco2eq: 500 },
        { id: 'entry-def-456', shipId: 'R001', year: 2024, amountGco2eq: -200 },
      ],
    });

    render(<BankingTab />);

    expect(screen.getByText('Bank Ledger Entries')).toBeInTheDocument();
    expect(screen.getByText('entry-abc-123')).toBeInTheDocument();
    expect(screen.getByText('entry-def-456')).toBeInTheDocument();
  });
});
