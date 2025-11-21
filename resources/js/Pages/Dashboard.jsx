import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { empName, summary, latestAttendance } = usePage().props;

  // Get today's date in yyyy-MM-dd
  const today = dayjs().format("YYYY-MM-DD");

  // Filter latestAttendance for today only
  const todayLogs = latestAttendance.filter(log => log.date === today);

  // Collect all unique status texts for today
  const allStatuses = Array.from(
    new Set([
      ...todayLogs.map(a => a.bstatus1),
      ...todayLogs.map(a => a.bstatus2)
    ])
  );

  // Count occurrences for each status for today
  const bstatus1Counts = allStatuses.map(
    status => todayLogs.filter(a => a.bstatus1 === status).length
  );

  const bstatus2Counts = allStatuses.map(
    status => todayLogs.filter(a => a.bstatus2 === status).length
  );

  const chartData = {
    labels: allStatuses,
    datasets: [
      {
        label: "1st Break Status",
        data: bstatus1Counts,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "2nd Break Status",
        data: bstatus2Counts,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Break Status Today (${today})` },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <h1 className="text-2xl font-bold mb-6">Welcome to Dashboard {empName}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <p className="text-sm">Total Attendance</p>
          <p className="text-2xl font-bold">{summary.totalAttendance}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <p className="text-sm">Today's Attendance</p>
          <p className="text-2xl font-bold">{summary.todayAttendance}</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <p className="text-sm">1st Break Today</p>
          <p className="text-2xl font-bold">{summary.total1stBreak}</p>
        </div>
      </div>

      {/* Graph for Today's bstatus1 & bstatus2 */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        {todayLogs.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className="text-center text-gray-500">No attendance logs for today.</p>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
