import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { RoutesTab } from '../adapters/ui/components/RoutesTab';
import { useRoutesTab } from '../core/application/useRoutesTab';

vi.mock('../core/application/useRoutesTab', () => ({
  useRoutesTab: vi.fn()
}));

const mockUseRoutesTab = useRoutesTab as ReturnType<typeof vi.fn>;

describe('RoutesTab Component Validation', () => {
  it('renders table correctly and verifies year filter is present', () => {
    mockUseRoutesTab.mockReturnValue({
      routes: [
        { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'LNG', year: 2024, ghgIntensity: 90, fuelConsumption: 100, isBaseline: false }
      ],
      loading: false,
      error: null,
      setBaseline: vi.fn()
    });

    render(<RoutesTab />);
    expect(screen.getByText('Route Registry')).toBeInTheDocument();
    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filter by Year...')).toBeInTheDocument();
  });

  it('triggers setBaseline when Make Baseline button is clicked', () => {
    const mockSetBaseline = vi.fn();
    mockUseRoutesTab.mockReturnValue({
      routes: [
        { id: 'uuid-1', routeId: 'R001', vesselType: 'Container', fuelType: 'LNG', year: 2024, ghgIntensity: 90, fuelConsumption: 100, isBaseline: false }
      ],
      loading: false,
      error: null,
      setBaseline: mockSetBaseline
    });

    render(<RoutesTab />);
    const buttons = screen.getAllByText('Set Baseline');
    fireEvent.click(buttons[0]);
    expect(mockSetBaseline).toHaveBeenCalledWith('uuid-1');
  });
});
