import { useEffect, useState } from "react";
import type { Attendee } from "../types/event";
import { getAttendance } from "../api/useAttendance"; // ✅ Backend integration

export const useLiveAttendance = (eventId: string | null) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchAttendance = async () => {
      try {
        const data = await getAttendance(eventId);
        setAttendees(data);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
        setAttendees([]);
      }
    };

    fetchAttendance();
  }, [eventId]);

  return { attendees };
};
