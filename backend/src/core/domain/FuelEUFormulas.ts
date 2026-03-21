// Core configuration defined by the FuelEU Maritime regulation (2025 specifically)
export const FUEL_EU_CONSTANTS = {
  TARGET_INTENSITY_2025: 89.3368, // gCO2e/MJ (representing a 2% reduction from the 91.16 reference value)
  ENERGY_FACTOR_MJ_PER_TON: 41000, // MJ/t
};

/**
 * Calculates the Energy in scope (MJ) for a ship.
 * Formula: Fuel Consumption (t) * 41,000 MJ/t
 */
export function calculateEnergyInScope(fuelConsumptionTs: number): number {
  return fuelConsumptionTs * FUEL_EU_CONSTANTS.ENERGY_FACTOR_MJ_PER_TON;
}

/**
 * Calculates the Compliance Balance (gCO2eq) for a ship.
 * Formula: (Target Intensity - Actual GHG Intensity) * Energy in Scope
 * 
 * Positive values = Surplus (compliant)
 * Negative values = Deficit (non-compliant)
 */
export function calculateComplianceBalance(
  actualGhgIntensity: number,
  fuelConsumptionTs: number,
  targetIntensity: number = FUEL_EU_CONSTANTS.TARGET_INTENSITY_2025
): number {
  const energyInScope = calculateEnergyInScope(fuelConsumptionTs);
  return (targetIntensity - actualGhgIntensity) * energyInScope;
}

/**
 * Calculates the percentage difference between a comparison measure and a baseline.
 * Formula: ((comparison / baseline) - 1) * 100
 */
export function calculatePercentageDifference(
  comparisonValue: number,
  baselineValue: number
): number {
  if (baselineValue === 0) return 0; // Prevent division by zero mathematically
  return ((comparisonValue / baselineValue) - 1) * 100;
}
