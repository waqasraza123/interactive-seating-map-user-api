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
