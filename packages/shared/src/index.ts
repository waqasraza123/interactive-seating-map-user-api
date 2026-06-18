export type SeatStatus = "available" | "held" | "reserved" | "sold";

export type PriceTier = "standard" | "premium" | "vip";

export type VenueSeat = {
  id: string;
  number: number;
  priceTier: PriceTier;
  row: string;
  status: SeatStatus;
  x: number;
  y: number;
};

export type VenueSection = {
  id: string;
  name: string;
  seats: VenueSeat[];
};

export type VenueFixture = {
  id: string;
  map: {
    height: number;
    width: number;
  };
  name: string;
  sections: VenueSection[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
};

export type CacheStatus = {
  size: number;
  hits: number;
  misses: number;
  averageResponseTimeMs: number;
};

export type HealthStatus = {
  status: "ok";
};

export type ApiDataResponse<TData> = {
  data: TData;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
