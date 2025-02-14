export interface Transfer {
  id: string;
  event: {
    id: string;
  };
  expense?: {
    id: string;
  };
  payout?: {
    id: string;
  };
}
