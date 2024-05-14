export interface EventProperties {
  id: string;
  name: string;
  about: string;
  full_address: string;
  location: GeoJSON.Point;
  start_date: string;
  end_date?: string;
}
