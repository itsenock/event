import api from "./api";
import type { Event } from "../types/event";

export const getEvents = async (): Promise<Event[]> => {
  const res = await api.get("/events");
  return res.data;
};

export const updateEvent = async (event: Event): Promise<void> => {
  try {
    await api.put(`/events/${event.id}`, event);
  } catch (error) {
    // Re-throw with a clean message (Axios errors include extra noise)
    throw new Error("Failed to update event");
    console.log(error);
  }
};
