import React from "react";
import type { Event } from "../types/event";
import {
  PencilSquareIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

type Props = {
  event: Event;
  onEdit: () => void;
  onSelect: () => void;
  isSelected?: boolean;
};

const EventCard: React.FC<Props> = ({
  event,
  onEdit,
  onSelect,
  isSelected,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === now.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl ${
        isSelected
          ? "ring-4 ring-blue-500 ring-opacity-50 shadow-2xl scale-[1.02]"
          : "border border-gray-200 dark:border-gray-700"
      } ${isPastEvent ? "opacity-80" : ""}`}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            Selected
          </div>
        </div>
      )}

      {/* Past Event Overlay */}
      {isPastEvent && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-20 z-10 rounded-2xl" />
      )}

      {/* Poster Image with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        {event.posterUrl ? (
          <>
            <img
              src={event.posterUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <CalendarIcon className="h-12 w-12 text-white opacity-80" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 text-center min-w-12">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {new Date(event.date).getDate()}
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
              {new Date(event.date).toLocaleString("default", {
                month: "short",
              })}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          disabled={isPastEvent}
          className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <PencilSquareIcon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span
              className={`font-medium ${
                isPastEvent
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {formatDate(event.date)}
              {isPastEvent && " • Past Event"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {event.venue}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isPastEvent
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isPastEvent ? "bg-gray-400" : "bg-green-500"
                }`}
              />
              {isPastEvent ? "Completed" : "Upcoming"}
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click to view
            </span>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-blue-400"
            : "ring-1 ring-transparent group-hover:ring-gray-300 dark:group-hover:ring-gray-600"
        }`}
      />
    </motion.div>
  );
};

export default EventCard;
