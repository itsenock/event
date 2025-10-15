import React, { useState } from "react";
import { useFetchEvents } from "../hooks/useFetchEvents";
import { useLiveAttendance } from "../hooks/useLiveAttendance";
import type { Event } from "../types/event";
import { mockAttendees } from "../data/mockAttendees";
import AttendanceList from "../components/AttendanceList";
import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";
import EventCard from "../components/EventCard";
import EventListView from "../components/EventListView";
import AnalyticsPanel from "../components/AnalyticsPanel";
import FloatingButton from "../../../components/FloatingButton";
import {
  Squares2X2Icon,
  ListBulletIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FunnelIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

const EventsPage: React.FC = () => {
  const { events, loading, motionKey } = useFetchEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileAttendance, setShowMobileAttendance] = useState(false);
  const [page, setPage] = useState(1);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const eventsPerPage = 6;

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const matchMonth = filterMonth
      ? eventDate.getMonth().toString() === filterMonth
      : true;
    const matchYear = filterYear
      ? eventDate.getFullYear().toString() === filterYear
      : true;
    return matchMonth && matchYear;
  });

  const paginatedEvents = filteredEvents.slice(
    (page - 1) * eventsPerPage,
    page * eventsPerPage
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / eventsPerPage)
  );

  const { attendees: liveAttendees } = useLiveAttendance(
    selectedEvent?.id || null
  );
  const attendees = [
    ...mockAttendees.filter((a) => a.eventId === selectedEvent?.id),
    ...liveAttendees,
  ];

  const getEventStats = () => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).length;
    const pastEvents = totalEvents - upcomingEvents;
    
    return { totalEvents, upcomingEvents, pastEvents };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6">
      <Toaster position="top-right" />

      {/* Header Section with Improved Flexbox */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1920px] mx-auto mb-8"
      >
        {/* Main Header Row */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-6">
          {/* Title and Stats Section */}
          <div className="flex-1 w-full">
            <div className="flex items-start sm:items-center gap-4 mb-4 flex-col sm:flex-row">
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    Event Management
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Create, manage, and track events
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards with Flexbox Wrap */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px] max-w-[200px] bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalEvents}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Events</div>
              </div>
              <div className="flex-1 min-w-[140px] max-w-[200px] bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.upcomingEvents}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Upcoming</div>
              </div>
              <div className="flex-1 min-w-[140px] max-w-[200px] bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.pastEvents}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
              </div>
            </div>
          </div>

          {/* View Controls - Better Flex Arrangement */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full xs:w-auto">
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowMobileAttendance(true)}
              className="lg:hidden p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 flex-1 xs:flex-none"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span className="font-medium">Attendance</span>
            </motion.button>
          </div>
        </div>

        {/* Filters with Improved Flexbox */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Filter Events
              </span>
            </div>
            
            {/* Filter Controls with Flexible Layout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full lg:w-auto">
              <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month, index) => (
                    <option key={month} value={index.toString()}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Years</option>
                  {[2023, 2024, 2025, 2026, 2027].map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content with Improved Flexbox */}
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Events Section - Flexible Width */}
          <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex overflow */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                  <motion.div
                    key={`grid-${motionKey}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center sm:justify-start"
                  >
                    {paginatedEvents.map((event) => (
                      <div key={event.id} className="flex-1 min-w-[280px] max-w-[380px]">
                        <EventCard
                          event={event}
                          onEdit={() => {
                            setEventToEdit(event);
                            setShowEditModal(true);
                          }}
                          onSelect={() => setSelectedEvent(event)}
                          isSelected={selectedEvent?.id === event.id}
                        />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`list-${motionKey}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <EventListView
                      events={paginatedEvents}
                      onSelect={(event) => setSelectedEvent(event)}
                      onEdit={(event) => {
                        setEventToEdit(event);
                        setShowEditModal(true);
                      }}
                      selectedEventId={selectedEvent?.id}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Pagination with Better Flexbox */}
            {filteredEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
              >
                <div className="flex items-center gap-3 order-2 sm:order-1">
                  <motion.button
                    whileHover={{ scale: page > 1 ? 1.05 : 1 }}
                    whileTap={{ scale: page > 1 ? 0.95 : 1 }}
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`p-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center ${
                      page > 1
                        ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </motion.button>

                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page
                    </span>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-lg font-semibold min-w-[40px] text-center">
                      {page}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      of {totalPages}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: page < totalPages ? 1.05 : 1 }}
                    whileTap={{ scale: page < totalPages ? 0.95 : 1 }}
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`p-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center ${
                      page < totalPages
                        ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </motion.button>
                </div>
                
                {/* Results Count */}
                <div className="order-1 sm:order-2 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                  Showing {paginatedEvents.length} of {filteredEvents.length} events
                </div>
              </motion.div>
            )}
          </div>

          {/* Attendance + Analytics Sidebar - Fixed but Flexible */}
          <div className="hidden xl:flex flex-col gap-6 w-full max-w-[400px] xl:min-w-[380px] xl:max-w-[420px] flex-shrink-0">
            {selectedEvent ? (
              <div className="flex flex-col gap-6 h-full">
                <div className="flex-1">
                  <AttendanceList
                    attendees={attendees}
                    eventId={selectedEvent.id}
                    eventTitle={selectedEvent.title}
                  />
                </div>
                <div className="flex-1">
                  <AnalyticsPanel attendees={attendees} events={[selectedEvent]} />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center justify-center h-64"
              >
                <UserGroupIcon className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Event Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Select an event to view attendance
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Global Analytics Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <AnalyticsPanel attendees={attendees} events={events} />
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingButton onClick={() => setShowCreateModal(true)} />

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(event) => setSelectedEvent(event)}
        />
      )}

      {showEditModal && eventToEdit && (
        <EditEventModal
          event={eventToEdit}
          onClose={() => setShowEditModal(false)}
          onUpdate={(event) => setSelectedEvent(event)}
        />
      )}

      {/* Mobile Attendance Drawer with Better Flexbox */}
      <AnimatePresence>
        {showMobileAttendance && selectedEvent && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowMobileAttendance(false)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Events
              </button>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate flex-1 text-center px-4">
                {selectedEvent.title}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
                <AttendanceList
                  attendees={attendees}
                  eventId={selectedEvent.id}
                  eventTitle={selectedEvent.title}
                />
                <AnalyticsPanel attendees={attendees} events={[selectedEvent]} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;