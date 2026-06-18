export type SeatStatus = "available" | "held" | "sold";

export type VenueSeat = {
  id: string;
  row: string;
  number: number;
  x: number;
  y: number;
  status: SeatStatus;
};

export type VenueSection = {
  id: string;
  name: string;
  seats: VenueSeat[];
};

export type VenueFixture = {
  id: string;
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
