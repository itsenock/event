import React, { useState } from "react";
import { useFetchEvents } from "../hooks/useFetchEvents";
import { useLiveAttendance } from "../hooks/useLiveAttendance";
import type { Event } from "../types/event";
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
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import type { Dispatch, SetStateAction, FC } from "react";

type HeaderSectionProps = {
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
  };
  viewMode: "grid" | "list";
  setViewMode: Dispatch<SetStateAction<"grid" | "list">>;
  setShowMobileAttendance: Dispatch<SetStateAction<boolean>>;
  filterMonth: string;
  setFilterMonth: Dispatch<SetStateAction<string>>;
  filterYear: string;
  setFilterYear: Dispatch<SetStateAction<string>>;
};


const HeaderSection: FC<HeaderSectionProps> = ({
  stats,
  viewMode,
  setViewMode,
  setShowMobileAttendance,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-[1920px] mx-auto mb-8"
  >
    {/* Top Controls Bar */}
    <div className="flex justify-between items-center mb-6">
      {/* Left side - Theme Toggle */}
      {/* <div className=" items-center gap-3">
        <ThemeToggle />
      </div> */}

      {/* Right side - Additional controls can be added here */}
      <div className="flex items-center gap-3">
        {/* Placeholder for future controls */}
      </div>
    </div>

    {/* Main Header Container */}
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-6">
      
      {/* Left Section - Title and Stats */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* Title Section */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl flex-shrink-0">
            <CalendarIcon className="h-7 w-7 text-white" />
          </div>
          
          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                Event Management
              </h1>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {stats.totalEvents} Events
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Total Events */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex-1 min-w-[160px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 shadow-lg border border-blue-200 dark:border-blue-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalEvents}
                </div>
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">
                  Total Events
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex-1 min-w-[160px] bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-2xl p-4 shadow-lg border border-green-200 dark:border-green-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.upcomingEvents}
                </div>
                <div className="text-sm font-medium text-green-700 dark:text-green-300 mt-1">
                  Upcoming
                </div>
              </div>
              <div className="p-2 bg-green-500/10 rounded-xl">
                <PlusIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Completed Events */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            className="flex-1 min-w-[160px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-600/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.pastEvents}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                  Completed
                </div>
              </div>
              <div className="p-2 bg-gray-500/10 rounded-xl">
                <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Controls */}
      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-4 flex-shrink-0">
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              viewMode === "list"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ListBulletIcon className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Mobile Attendance Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMobileAttendance(true)}
          className="lg:hidden p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 flex-1 sm:flex-none"
        >
          <UserGroupIcon className="h-5 w-5" />
          <span className="font-semibold">View Attendance</span>
        </motion.button>
      </div>
    </div>

    {/* Enhanced Filter Section */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Filter Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FunnelIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              Filter Events
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Narrow down your event list
            </p>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto">
          
          {/* Month Filter */}
          <div className="flex flex-col gap-2 flex-1 sm:flex-none sm:min-w-[180px]">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
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

          {/* Year Filter */}
          <div className="flex flex-col gap-2 flex-1 sm:flex-none sm:min-w-[140px]">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
            >
              <option value="">All Years</option>
              {[2023, 2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setFilterMonth("");
                setFilterYear("");
              }}
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium shadow-sm"
            >
              Clear
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

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
  const attendees = liveAttendees;


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

      {/* Enhanced Header Section with Theme Toggle */}
      <HeaderSection
        stats={stats}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setShowMobileAttendance={setShowMobileAttendance}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
      />

      {/* Main Content */}
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Events Section - Flexible Width */}
          <div className="flex-1 min-w-0">
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

            {/* Pagination */}
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

      {/* Mobile Attendance Drawer */}
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