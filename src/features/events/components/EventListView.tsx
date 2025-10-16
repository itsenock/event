import React from "react";
import type { Event } from "../types/event";
import {
  PencilSquareIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  events: Event[];
  onSelect: (event: Event) => void;
  onEdit: (event: Event) => void;
  selectedEventId?: string;
};

const EventListView: React.FC<Props> = ({
  events,
  onSelect,
  onEdit,
  selectedEventId,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return { text: "Today", color: "text-green-600" };
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return { text: "Tomorrow", color: "text-blue-600" };
    } else if (date < now) {
      return {
        text: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        color: "text-gray-500",
      };
    } else {
      return {
        text: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        color: "text-gray-700 dark:text-gray-300",
      };
    }
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {events.map((event, index) => {
          const isSelected = selectedEventId === event.id;
          const isPast = isPastEvent(event.date);
          const dateInfo = formatDate(event.date);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(event)}
              className={`relative rounded-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl overflow-hidden group ${
                isSelected
                  ? "ring-4 ring-blue-500 ring-opacity-50 shadow-2xl border-l-4 border-l-blue-500"
                  : "border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              } ${isPast ? "opacity-80" : ""}`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <EyeIcon className="h-3 w-3" />
                    Selected
                  </div>
                </div>
              )}

              <div className="flex gap-4 p-4">
                {/* Poster Image */}
                <div className="flex-shrink-0 relative">
                  {event.posterUrl ? (
                    <img
                      src={event.posterUrl}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center">
                      <CalendarIcon className="h-8 w-8 text-white opacity-90" />
                    </div>
                  )}

                  {/* Past Event Overlay */}
                  {isPast && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-40 rounded-xl" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <h3
                        className={`text-lg font-bold truncate ${
                          isPast
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-white"
                        }`}
                      >
                        {event.title}
                      </h3>

                      {/* Description */}
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <CalendarIcon
                        className={`h-4 w-4 ${
                          isPast ? "text-gray-400" : "text-blue-500"
                        }`}
                      />
                      <span className={`font-medium ${dateInfo.color}`}>
                        {dateInfo.text}
                      </span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-300 truncate">
                        {event.venue}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isPast
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPast ? "bg-gray-400" : "bg-green-500"
                        }`}
                      />
                      {isPast ? "Completed" : "Upcoming"}
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                  disabled={isPast}
                  className="flex-shrink-0 p-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-200 group/edit"
                  title="Edit Event"
                >
                  <PencilSquareIcon className="h-4 w-4 group-hover/edit:scale-110 transition-transform" />
                </motion.button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty State */}
      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
            Create your first event to get started with attendance tracking and management.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EventListView;
