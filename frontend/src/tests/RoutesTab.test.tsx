import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RoutesTab } from '../adapters/ui/components/RoutesTab';

vi.mock('../core/application/useRoutesTab', () => ({
  useRoutesTab: () => ({
    routes: [
      { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'LNG', year: 2024, ghgIntensity: 90, fuelConsumption: 100, isBaseline: false }
    ],
    loading: false,
    error: null,
    setBaseline: vi.fn()
  })
}));

describe('RoutesTab Component Validation', () => {
  it('renders table correctly and verifies year filter is present', () => {
    render(<RoutesTab />);
    expect(screen.getByText('Route Registry')).toBeDefined();
    expect(screen.getByText('R001')).toBeDefined();
    expect(screen.getByPlaceholderText('Filter by Year...')).toBeDefined();
  });
});
