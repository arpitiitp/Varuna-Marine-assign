import { calculateEnergyInScope, calculateComplianceBalance, calculatePercentageDifference } from '../../core/domain/FuelEUFormulas';

describe('FuelEU Formulas', () => {
  it('should calculate Energy In Scope correctly', () => {
    // 5000 t * 41000 = 205,000,000 MJ
    expect(calculateEnergyInScope(5000)).toBe(205000000);
  });

  it('should calculate Compliance Balance (CB) - Surplus', () => {
    // Target 89.3368. Actual: 88.0. Difference: +1.3368
    // Energy: 4800 * 41000 = 196,800,000
    // CB = 1.3368 * 196,800,000 = 263,082,240
    const cb = calculateComplianceBalance(88.0, 4800);
    expect(cb).toBeCloseTo(263082240, 0);
  });

  it('should calculate Compliance Balance (CB) - Deficit', () => {
    // Target 89.3368. Actual: 91.0. Difference = -1.6632
    // Energy: 5000 * 41000 = 205,000,000
    // CB = -1.6632 * 205,000,000 = -340,956,000
    const cb = calculateComplianceBalance(91.0, 5000);
    expect(cb).toBeCloseTo(-340956000, 0);
  });

  it('should calculate percentage difference accurately', () => {
    // baseline = 91.0, compare = 88.0 -> ((88 / 91) - 1) * 100 = -3.296%
    const diff = calculatePercentageDifference(88.0, 91.0);
    expect(diff).toBeCloseTo(-3.2967, 3);
  });
});
