import type { Attendee } from "../types/event";

export const mockAttendees: Attendee[] = [
  { id: "a1", name: "Its", status: "Present", eventId: "e1" },
  { id: "a2", name: "Amina", status: "Late", eventId: "e1" },
  { id: "a3", name: "Brian", status: "Absent", eventId: "e1" },
  { id: "a4", name: "Diana", status: "Present", eventId: "e2" },
  { id: "a5", name: "Ethan", status: "Late", eventId: "e2" },
  { id: "a6", name: "Faith", status: "Present", eventId: "e3" },
  { id: "a7", name: "George", status: "Absent", eventId: "e3" },
];
