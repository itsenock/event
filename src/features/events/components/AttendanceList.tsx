import React, { useEffect, useState } from "react";
import type { Attendee } from "../types/event";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import {
  DocumentArrowDownIcon,
  TableCellsIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import axios from "axios";

type Props = {
  attendees?: Attendee[];
  eventId: string;
  eventTitle: string;
};

const AttendanceList: React.FC<Props> = ({ attendees: initialAttendees = [], eventId, eventTitle }) => {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await axios.get(`https://your-backend-url.com/events/${eventId}/attendance`);
        setAttendees(res.data);
      } catch (error) {
        console.error("Failed to fetch attendees:", error);
      }
    };

    if (eventId) {
      fetchAttendees();
    }
  }, [eventId]);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 220, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Attendance Report - ${eventTitle}`, 14, 20);

    doc.setTextColor(0, 0, 0);

    doc.autoTable({
      startY: 35,
      head: [["Name", "Status", "Timestamp"]],
      body: attendees.map((a) => [
        a.name,
        a.status,
        a.timestamp || new Date().toLocaleDateString(),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });

    doc.save(`attendance-${eventTitle.replace(/\s+/g, "-")}.pdf`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case "Late":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "Absent":
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusCounts = () => {
    return attendees.reduce((acc, attendee) => {
      acc[attendee.status] = (acc[attendee.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Attendance List
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {eventTitle}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
            <CheckCircleIcon className="h-3 w-3 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              {statusCounts.Present || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <ClockIcon className="h-3 w-3 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
              {statusCounts.Late || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
            <XCircleIcon className="h-3 w-3 text-red-600" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              {statusCounts.Absent || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-600 overflow-hidden mb-6">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {attendees.map((attendee, index) => (
                <motion.tr
                  key={attendee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {attendee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {attendee.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attendee.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          attendee.status === "Present"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : attendee.status === "Late"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {getStatusIcon(attendee.status)}
                        {attendee.status}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {attendees.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No attendees found
              </p>
            </div>
          )}
        </div>
      </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total {attendees.length} attendees
        </p>

        <div className="flex gap-3">
          <CSVLink
            data={attendees}
            filename={`attendance-${eventTitle.replace(/\s+/g, '-')}.csv`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <TableCellsIcon className="h-4 w-4" />
            Export CSV
          </CSVLink>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            Export PDF
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceList;
