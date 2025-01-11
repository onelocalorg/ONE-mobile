/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { EventList } from "~/components/events/EventList";
import { Group } from "~/types/group";

interface EventListScreenProps {
  group?: Group;
}
export const EventListScreen = ({ group }: EventListScreenProps) => {
  return (
    <>
      <EventList group={group} />
    </>
  );
};
