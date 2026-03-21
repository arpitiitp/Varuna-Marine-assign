export interface RouteData {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComparisonItem {
  route: RouteData;
  percentDiff: number;
  isCompliant: boolean;
}

export interface ComparisonResult {
  baselineRoute: RouteData;
  comparisonRoutes: ComparisonItem[];
}

export interface ShipCompliance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface PoolMember {
  poolId?: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolData {
  id: string;
  year: number;
  createdAt: string;
  members?: PoolMember[];
}
