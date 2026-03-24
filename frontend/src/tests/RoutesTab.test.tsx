import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { RoutesTab } from '../adapters/ui/components/RoutesTab';
import { useRoutesTab } from '../core/application/useRoutesTab';

vi.mock('../core/application/useRoutesTab', () => ({
  useRoutesTab: vi.fn(),
}));

// Correct Vitest mock typing
const mockUseRoutesTab = vi.mocked(useRoutesTab);

const sampleRoute = {
  id: 'uuid-1',
  routeId: 'R001',
  vesselType: 'Container',
  fuelType: 'LNG',
  year: 2024,
  ghgIntensity: 90.5,
  fuelConsumption: 1200,
  distance: 4500,
  totalEmissions: 108000,
  isBaseline: false,
};

const baseHookState = {
  routes: [],
  loading: false,
  error: null,
  setBaseline: vi.fn(),
  fetchRoutes: vi.fn(),
};

beforeEach(() => {
  vi.resetAllMocks();
  mockUseRoutesTab.mockReturnValue({ ...baseHookState });
});

describe('RoutesTab Component', () => {
  it('renders the table header and route data when routes are loaded', () => {
    mockUseRoutesTab.mockReturnValue({ ...baseHookState, routes: [sampleRoute] });

    render(<RoutesTab />);

    expect(screen.getByText('Route Registry')).toBeInTheDocument();
    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getByText('Container')).toBeInTheDocument();
    // fuelType rendered in a badge
    expect(screen.getByText('LNG')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('renders filter inputs with connected accessible labels (aria-label)', () => {
    mockUseRoutesTab.mockReturnValue({ ...baseHookState, routes: [sampleRoute] });

    render(<RoutesTab />);

    // Query by accessible label — confirms aria-label is present on the inputs
    expect(screen.getByRole('textbox', { name: /filter by vessel type/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /filter by fuel type/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /filter by compliance year/i })).toBeInTheDocument();
  });

  it('filters routes by vessel type as the user types', async () => {
    const user = userEvent.setup();
    mockUseRoutesTab.mockReturnValue({
      ...baseHookState,
      routes: [
        sampleRoute,
        { ...sampleRoute, id: 'uuid-2', routeId: 'R002', vesselType: 'Tanker' },
      ],
    });

    render(<RoutesTab />);

    const vesselFilter = screen.getByRole('textbox', { name: /filter by vessel type/i });
    await user.type(vesselFilter, 'Tanker');

    // R002 matches, R001 (Container) should be hidden
    expect(screen.getByText('R002')).toBeInTheDocument();
    expect(screen.queryByText('R001')).not.toBeInTheDocument();
  });

  it('calls setBaseline with the correct route id when the button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetBaseline = vi.fn();
    mockUseRoutesTab.mockReturnValue({
      ...baseHookState,
      routes: [sampleRoute],
      setBaseline: mockSetBaseline,
    });

    render(<RoutesTab />);

    await user.click(screen.getByRole('button', { name: /set baseline/i }));
    expect(mockSetBaseline).toHaveBeenCalledOnce();
    expect(mockSetBaseline).toHaveBeenCalledWith('uuid-1');
  });

  it('shows a shimmer skeleton loader while routes are loading', () => {
    mockUseRoutesTab.mockReturnValue({ ...baseHookState, loading: true });

    render(<RoutesTab />);

    const skeletons = document.querySelectorAll('.skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders an error message when the hook returns an error', () => {
    mockUseRoutesTab.mockReturnValue({ ...baseHookState, error: 'Failed to fetch routes' });

    render(<RoutesTab />);

    expect(screen.getByText('Failed to fetch routes')).toBeInTheDocument();
  });

  it('shows the empty state message when no routes match the current filters', async () => {
    const user = userEvent.setup();
    mockUseRoutesTab.mockReturnValue({ ...baseHookState, routes: [sampleRoute] });

    render(<RoutesTab />);

    // Filter by something that won't match any route
    await user.type(screen.getByRole('textbox', { name: /filter by vessel type/i }), 'ZZZNOMATCH');

    expect(screen.getByText(/no routes match your filters/i)).toBeInTheDocument();
  });

  it('does not show the Set Baseline button for routes that are already the baseline', () => {
    mockUseRoutesTab.mockReturnValue({
      ...baseHookState,
      routes: [{ ...sampleRoute, isBaseline: true }],
    });

    render(<RoutesTab />);

    expect(screen.queryByRole('button', { name: /set baseline/i })).not.toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
  });
});
