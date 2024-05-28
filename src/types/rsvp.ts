import { OneUser } from "./one-user";

export interface RsvpList {
  rsvps: Rsvp[];
  going: number;
  interested: number;
  cantgo: number;
}

export enum RsvpType {
  GOING = "going",
  INTERESTED = "interested",
  CANT_GO = "cantgo",
}

export interface Rsvp {
  id: string;
  rsvp: RsvpType;
  guest: OneUser;
}
