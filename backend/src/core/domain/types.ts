export interface RouteEntity {
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

export interface ShipComplianceEntity {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
}

export interface BankEntryEntity {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}

export interface PoolEntity {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMemberEntity {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}
