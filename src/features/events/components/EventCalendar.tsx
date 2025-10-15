import React from "react";
import type { Event } from "../types/event";
import { 
  CalendarIcon, 
  MapPinIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  events: Event[];
};

const EventCalendar: React.FC<Props> = ({ events }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Group events by date for easier display
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Get upcoming events (next 7 days)
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventCountToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter(event => event.date === today).length;
  };

  const getEventCountThisWeek = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + (6 - today.getDay()));
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Event Calendar
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {currentMonth} {currentYear}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-4 text-right">
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {getEventCountToday()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {getEventCountThisWeek()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
          </div>
        </div>
      </div>

      {/* Calendar Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <ClockIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Upcoming Events
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {upcomingEvents.length} events scheduled
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                      {event.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Event Date Badge */}
                <div className="flex-shrink-0 ml-3 text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-2 min-w-12">
                    <div className="text-xs font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-[10px] uppercase">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No upcoming events scheduled
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Create an event to get started
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {upcomingEvents.length} of {events.length} total events
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EventCalendar;