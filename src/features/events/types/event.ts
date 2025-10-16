export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  posterUrl?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email?: string;
  status: "Present" | "Late" | "Absent";
  timestamp?: string;
  eventId: string;
}
