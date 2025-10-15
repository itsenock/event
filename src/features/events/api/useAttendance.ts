import api from "./api";
import type { Attendee } from "../types/event";

export const getAttendance = async (eventId: string): Promise<Attendee[]> => {
  const res = await api.get(`/attendance/${eventId}`);
  return res.data;
};
