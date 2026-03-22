import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BankingTab } from '../adapters/ui/components/BankingTab';
import { useBankingTab } from '../core/application/useBankingTab';

vi.mock('../core/application/useBankingTab', () => ({
  useBankingTab: vi.fn()
}));

const mockUseBankingTab = useBankingTab as ReturnType<typeof vi.fn>;

describe('BankingTab Component', () => {
  it('renders input fields for initial state and allows typing', () => {
    mockUseBankingTab.mockReturnValue({
      cbRecord: null,
      adjustedCb: null,
      bankEntries: [],
      loading: false,
      error: null,
      successMsg: null,
      loadShipData: vi.fn(),
      bankSurplus: vi.fn(),
      applyBanked: vi.fn()
    });

    render(<BankingTab />);
    expect(screen.getByText('Banking Dashboard')).toBeInTheDocument();
    
    // Label tests
    expect(screen.getByText('Route / Ship ID')).toBeInTheDocument();
    expect(screen.getByText('Compliance Year')).toBeInTheDocument();
  });

  it('triggers load data on button click', () => {
    const mockLoadShipData = vi.fn();
    mockUseBankingTab.mockReturnValue({
      cbRecord: null,
      adjustedCb: null,
      bankEntries: [],
      loading: false,
      error: null,
      successMsg: null,
      loadShipData: mockLoadShipData,
      bankSurplus: vi.fn(),
      applyBanked: vi.fn()
    });

    render(<BankingTab />);
    
    const shipInput = screen.getByRole('textbox');
    const yearInput = screen.getByRole('spinbutton');
    
    fireEvent.change(shipInput, { target: { value: 'R001' } });
    fireEvent.change(yearInput, { target: { value: '2024' } });

    const loadButton = screen.getByText('Load Data');
    fireEvent.click(loadButton);
    expect(mockLoadShipData).toHaveBeenCalledWith('R001', 2024);
  });
});
