import React, { useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  ChartPieIcon,
  ChartBarSquareIcon,
  EyeIcon
} from "@heroicons/react/24/outline";
import type { Attendee, Event } from "../types/event";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  attendees: Attendee[];
  events: Event[];
};

const AnalyticsPanel: React.FC<Props> = ({ attendees, events }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");

  const filteredAttendees = selectedEventId
    ? attendees.filter((a) => a.eventId === selectedEventId)
    : attendees;

  const counts = { Present: 0, Late: 0, Absent: 0 };
  filteredAttendees.forEach((a) => counts[a.status]++);

  const totalSummary = {
    Present: attendees.filter((a) => a.status === "Present").length,
    Late: attendees.filter((a) => a.status === "Late").length,
    Absent: attendees.filter((a) => a.status === "Absent").length,
  };

  const eventTitle = selectedEventId
    ? events.find((e) => e.id === selectedEventId)?.title || "Selected Event"
    : "All Events";

  const chartData = {
    bar: {
      labels: ["Present", "Late", "Absent"],
      datasets: [
        {
          label: `Attendance for ${eventTitle}`,
          data: [counts.Present, counts.Late, counts.Absent],
          backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
          borderColor: ["#059669", "#d97706", "#dc2626"],
          borderWidth: 2,
          barThickness: 40,
          borderRadius: 8,
        },
      ],
    },
    pie: {
      labels: ["Present", "Late", "Absent"],
      datasets: [
        {
          data: [counts.Present, counts.Late, counts.Absent],
          backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
          borderColor: ["#059669", "#d97706", "#dc2626"],
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    },
    line: {
      labels: ["Week 1", "Week 2", "Week 3", "Current"],
      datasets: [
        {
          label: "Present",
          data: [Math.floor(counts.Present * 0.3), Math.floor(counts.Present * 0.6), Math.floor(counts.Present * 0.8), counts.Present],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: "Late",
          data: [Math.floor(counts.Late * 0.3), Math.floor(counts.Late * 0.6), Math.floor(counts.Late * 0.8), counts.Late],
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#f59e0b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
        {
          label: "Absent",
          data: [Math.floor(counts.Absent * 0.3), Math.floor(counts.Absent * 0.6), Math.floor(counts.Absent * 0.8), counts.Absent],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    },
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600' as const,
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart" as const,
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        type: "category" as const,
        grid: { 
          display: false,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: { 
          color: "#6b7280",
          font: {
            size: 12,
            weight: '600' as const,
          }
        },
      },
      y: {
        type: "linear" as const,
        beginAtZero: true,
        grid: { 
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: { 
          stepSize: 1, 
          color: "#6b7280",
          font: {
            size: 11,
          }
        },
      },
    },
  };

  const lineOptions = {
    ...barOptions,
    spanGaps: false,
    showLine: true,
  };

  const pieOptions = {
    ...commonOptions,
    cutout: '0%',
    animation: {
      ...commonOptions.animation,
      animateRotate: true,
      animateScale: true,
    },
  };

  const exportChart = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
    pdf.save("event-attendance.pdf");
  };

  const exportCSV = () => {
    const rows = [
      ["Status", "Count", "Event"],
      ["Present", counts.Present.toString(), eventTitle],
      ["Late", counts.Late.toString(), eventTitle],
      ["Absent", counts.Absent.toString(), eventTitle],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "event-attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartIcons = {
    bar: ChartBarSquareIcon,
    line: ChartBarIcon,
    pie: ChartPieIcon,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-6 mt-10 border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Event Analytics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track and analyze attendance patterns
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportChart}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <EyeIcon className="h-4 w-4" />
            Select Event
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Chart Type
          </label>
          <div className="flex gap-2">
            {(['bar', 'line', 'pie'] as const).map((type) => {
              const Icon = chartIcons[type];
              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChartType(type)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    chartType === type
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="capitalize text-sm font-medium">{type}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart */}
      <motion.div
        key={chartType + selectedEventId}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        ref={chartRef}
        className="h-80 mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner border border-gray-100 dark:border-gray-700"
      >
        {chartType === "bar" && <Bar data={chartData.bar} options={barOptions} />}
        {chartType === "line" && <Line data={chartData.line} options={lineOptions} />}
        {chartType === "pie" && <Pie data={chartData.pie} options={pieOptions} />}
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Present", value: totalSummary.Present, color: "green" },
          { label: "Total Late", value: totalSummary.Late, color: "yellow" },
          { label: "Total Absent", value: totalSummary.Absent, color: "red" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {item.label}
            </p>
            <p className={`text-2xl font-bold text-${item.color}-600`}>
              {item.value}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
              <div
                className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                style={{
                  width: `${(item.value / attendees.length) * 100}%`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;