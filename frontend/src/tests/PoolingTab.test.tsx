import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PoolingTab } from '../adapters/ui/components/PoolingTab';
import { usePoolingTab } from '../core/application/usePoolingTab';

vi.mock('../core/application/usePoolingTab', () => ({
  usePoolingTab: vi.fn()
}));

const mockUsePoolingTab = usePoolingTab as ReturnType<typeof vi.fn>;

describe('PoolingTab Component', () => {
  it('renders correctly and dispatches verifyPool action', () => {
    const mockVerifyPool = vi.fn();
    mockUsePoolingTab.mockReturnValue({
      pools: [],
      loading: false,
      error: null,
      successMsg: null,
      poolPreview: null,
      verifyPool: mockVerifyPool,
      createPool: vi.fn(),
      fetchPools: vi.fn()
    });

    render(<PoolingTab />);
    expect(screen.getByText('Pooling Simulator')).toBeInTheDocument();
    
    const yearInput = screen.getByRole('spinbutton');
    const membersInput = screen.getByRole('textbox');
    
    fireEvent.change(yearInput, { target: { value: '2025' } });
    fireEvent.change(membersInput, { target: { value: 'R001, R002' } });

    const verifyButton = screen.getByText('Verify Members');
    fireEvent.click(verifyButton);
    expect(mockVerifyPool).toHaveBeenCalledWith(2025, ['R001', 'R002']);
  });

  it('renders projected sum when a valid poolPreview is active', () => {
    mockUsePoolingTab.mockReturnValue({
      pools: [],
      loading: false,
      error: null,
      successMsg: null,
      poolPreview: { sum: 500, isValid: true },
      verifyPool: vi.fn(),
      createPool: vi.fn(),
      fetchPools: vi.fn()
    });

    render(<PoolingTab />);
    expect(screen.getByText('Projected Pool Sum')).toBeInTheDocument();
    expect(screen.getByText('Valid Pool ✓')).toBeInTheDocument();
  });

  it('renders Active Pools list when pools data exists', () => {
    mockUsePoolingTab.mockReturnValue({
      pools: [{
        id: 'bb442c9d-a3ac-4c09-8fdd-a8bcb0935dcb',
        year: 2025,
        members: [
          { shipId: 'R001', cbBefore: -500, cbAfter: 0 }
        ]
      }],
      loading: false,
      error: null,
      successMsg: null,
      createPool: vi.fn(),
      fetchPools: vi.fn()
    });

    render(<PoolingTab />);
    expect(screen.getByText('Active Pools')).toBeInTheDocument();
    expect(screen.getByText('Pool ID: bb442c9d...')).toBeInTheDocument();
    expect(screen.getByText('R001')).toBeInTheDocument();
  });
});
