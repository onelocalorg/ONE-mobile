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

export interface Rsvp extends RsvpData {
  id: string;
  guest: OneUser;
}

export interface RsvpData {
  eventId: string;
  type: RsvpType;
}
