import { useEffect, useState } from "react";
import type { Event } from "../types/event";
import { getEvents } from "../api/useEvents";

export const useFetchEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motionKey, setMotionKey] = useState(0); // for animation triggers

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
        setMotionKey(prev => prev + 1); // trigger animation
      } catch (err) {
        console.error("Failed to fetch events", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetch();

    const socket = new WebSocket("ws://localhost:5000");
    socket.onmessage = msg => {
      try {
        const updated = JSON.parse(msg.data);
        if (Array.isArray(updated)) {
          setEvents(updated);
          setMotionKey(prev => prev + 1); // animate on update
        }
      } catch (err) {
        console.error("WebSocket update failed", err);
      }
    };

    return () => socket.close();
  }, []);

  return { events, loading, error, motionKey };
};
