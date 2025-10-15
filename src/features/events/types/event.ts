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
  status: "Present" | "Late" | "Absent";
  eventId: string;
}
