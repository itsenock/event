import { useEffect, useState } from "react";
import type { Attendee } from "../types/event";

export const useLiveAttendance = (eventId: string | null) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/attendance?eventId=${eventId}`)
      .then((res) => res.json())
      .then((data) => setAttendees(data))
      .catch(() => setAttendees([]));
  }, [eventId]);

  return { attendees };
};
