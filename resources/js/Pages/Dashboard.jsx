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
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ==============================
// Holiday Animations
// ==============================
const Snowfall = () => {
  const snowflakes = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {snowflakes.map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-75"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -100}%`,
            animation: `fall ${5 + Math.random() * 5}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(110vh); }
        }
      `}</style>
    </div>
  );
};

const Valentines = () => {
  const hearts = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {hearts.map((_, i) => (
        <div
          key={i}
          className="absolute bg-pink-500 rounded-full opacity-80"
          style={{
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -100}%`,
            animation: `fall ${3 + Math.random() * 3}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const Halloween = () => {
  const bats = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {bats.map((_, i) => (
        <div
          key={i}
          className="absolute bg-black w-4 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animation: `fly ${5 + Math.random() * 5}s linear infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes fly {
          0% { transform: translate(0,0) rotate(0deg); }
          100% { transform: translate(${Math.random()*50-25}px, ${Math.random()*50-25}px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const Fireworks = () => {
  const sparks = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {sparks.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-75"
          style={{
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            backgroundColor: `hsl(${Math.random() * 360},100%,60%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animation: `firework ${1 + Math.random() * 1.5}s ease-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          50% { transform: scale(1) translateY(-50px); opacity: 1; }
          100% { transform: scale(0) translateY(-100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// ==============================
// Dashboard Component
// ==============================
export default function Dashboard() {
  const { empName, summary, latestAttendance } = usePage().props;
  const todayStr = dayjs().format("YYYY-MM-DD");

  // console.log(empName);

  const todayLogs = latestAttendance.filter(log => log.date === todayStr);
  const allStatuses = Array.from(
    new Set([...todayLogs.map(a => a.bstatus1), ...todayLogs.map(a => a.bstatus2)])
  );
  const bstatus1Counts = allStatuses.map(
    status => todayLogs.filter(a => a.bstatus1 === status).length
  );
  const bstatus2Counts = allStatuses.map(
    status => todayLogs.filter(a => a.bstatus2 === status).length
  );

  // Determine Holiday / Event
  const getHoliday = () => {
    const today = dayjs();
    const year = today.year();
    const events = {
      christmas: [dayjs(`${year}-11-03`), dayjs(`${year}-12-30`)],
      newyear: [dayjs(`${year}-12-31`), dayjs(`${year + 1}-01-02`)],
      valentine: [dayjs(`${year}-02-10`), dayjs(`${year}-02-14`)],
      halloween: [dayjs(`${year}-10-25`), dayjs(`${year}-10-31`)],
    };
    for (const [key, [start, end]] of Object.entries(events)) {
      if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) return key;
    }
    return null;
  };

  const holiday = getHoliday();

  // Greeting text
  const greetings = {
    christmas: "Merry Christmas",
    newyear: "Happy New Year",
    valentine: "Happy Valentines",
    halloween: "Happy Halloween",
  };

  // Event gradient backgrounds
  const eventGradients = {
    christmas: "bg-gradient-to-r from-red-600 via-green-600 to-yellow-400",
    newyear: "bg-gradient-to-r from-yellow-400 via-white to-yellow-200",
    valentine: "bg-gradient-to-r from-red-500 via-pink-500 to-pink-300",
    halloween: "bg-gradient-to-r from-orange-700 via-black to-gray-900",
  };

  const themeGradient = holiday ? eventGradients[holiday] : "bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400";

  // Card color overlay for contrast
  const cardColor = "bg-white/70 dark:bg-gray-800/70";

  // Chart Data
  const chartData = {
    labels: allStatuses,
    datasets: [
      { label: "1st Break Status", data: bstatus1Counts, backgroundColor: "rgba(54,162,235,0.7)" },
      { label: "2nd Break Status", data: bstatus2Counts, backgroundColor: "rgba(153,204,255,0.7)" }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: `Break Status Today (${todayStr})` } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <div className={`min-h-screen relative p-6 rounded-md ${themeGradient}`}>

        {/* Event Animations */}
        {holiday === "christmas" && <Snowfall />}
        {holiday === "newyear" && <Fireworks />}
        {holiday === "valentine" && <Valentines />}
        {holiday === "halloween" && <Halloween />}

        {/* Content Layer */}
        <div className="relative z-10">
          <h3 className="text-3xl font-semibold mb-6 text-white flex items-center gap-2">
  {holiday 
    ? `Welcome ${empName}, ${greetings[holiday]}` 
    : `Welcome back, ${empName}.`} 
  {holiday && (
    <span>
      {holiday === "christmas" && "🎄"}
      {holiday === "newyear" && "🎆"}
      {holiday === "valentine" && "💖"}
      {holiday === "halloween" && "🎃"}
    </span>
  )}
</h3>


          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className={`${cardColor} text-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center`}>
              <p className="text-sm">Total Attendance</p>
              <p className="text-2xl font-bold">{summary.totalAttendance}</p>
            </div>
            <div className={`${cardColor} text-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center`}>
              <p className="text-sm">Today's Attendance</p>
              <p className="text-2xl font-bold">{summary.todayAttendance}</p>
            </div>
            <div className={`${cardColor} text-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center`}>
              <p className="text-sm">1st Break Today</p>
              <p className="text-2xl font-bold">{summary.total1stBreak}</p>
            </div>
          </div>

          {/* Chart */}
          <div className={`${cardColor} shadow-md rounded-lg p-4`}>
            {todayLogs.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-100">No attendance logs for today.</p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
