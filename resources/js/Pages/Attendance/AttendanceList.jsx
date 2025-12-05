import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

export default function AttendanceList({ tableData, tableFilters }) {
    const { emp_data } = usePage().props;
    const [rows, setRows] = useState(tableData.data || []);

    dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const getHoliday = () => {
  const today = dayjs();
  const year = today.year();
  const events = {
    christmas: [dayjs(`${year}-11-03`), dayjs(`${year}-12-30`)],
    newyear: [dayjs(`${year}-12-31`), dayjs(`${year+1}-01-02`)],
    valentine: [dayjs(`${year}-02-10`), dayjs(`${year}-02-14`)],
    halloween: [dayjs(`${year}-10-25`), dayjs(`${year}-10-31`)],
  };
  for (const [key, [start, end]] of Object.entries(events)) {
    if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) return key;
  }
  return null;
};

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

const holiday = getHoliday();

// Greeting text
  const greetings = {
    christmas: "Merry Christmas",
    newyear: "Happy New Year",
    valentine: "Happy Valentines",
    halloween: "Happy Halloween",
  };

const eventGradients = {
  christmas: "bg-gradient-to-r from-red-600 via-green-600 to-yellow-400",
  newyear: "bg-gradient-to-r from-yellow-400 via-white to-yellow-200",
  valentine: "bg-gradient-to-r from-red-500 via-pink-500 to-pink-300",
  halloween: "bg-gradient-to-r from-orange-700 via-black to-gray-900",
};

const modalBg = holiday ? eventGradients[holiday] : "bg-white dark:bg-gray-800";
const modalTextColor = holiday ? "text-white" : "text-gray-900 dark:text-gray-100";
const themeGradient = holiday ? eventGradients[holiday] : "bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400";


    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCin, setNewCin] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // AI-style message
    const showAIMessage = (message) => alert(message); // Replace with toast if needed

    useEffect(() => {
    const msg = localStorage.getItem("afterReloadMessage");

    if (msg) {
        alert(msg);            // show alert AFTER reload
        localStorage.removeItem("afterReloadMessage");
    }
}, []);


    // ======================
    // Add Biometric
    // ======================
 const addBiometricRow = () => {
    if (!newCin || !selectedDate) {
        return alert("⚠️ Oops! Please select both a date and a check-in time.");
    }

    const tempKey = Date.now();

    const newRow = {
        tempKey,
        id: null,
        date: selectedDate,
        cin: newCin,
        bout1: "",
        bin1: "",
        bout2: "",
        bin2: "",
        cout: "",
        no_hours: "",
        emp_id: emp_data?.emp_id,
        emp_name: emp_data?.emp_name,
    };

    // insert placeholder row sa UI
    setRows([newRow, ...rows]);

    // reset inputs
    setNewCin("");
    setSelectedDate("");
    setShowAddModal(false);

    // send data
    router.post(route("attendance.store"), newRow, {
        onSuccess: (page) => {
            // update temporary row with actual ID
            setRows((prevRows) =>
                prevRows.map((r) =>
                    r.tempKey === tempKey
                        ? { ...r, id: page.props.newId, tempKey: undefined }
                        : r
                )
            );

            // === HERE IS THE MAGIC ===
            // Set message → then reload
            localStorage.setItem(
                "afterReloadMessage",
                "✅ Attendance logged successfully."
            );

           setTimeout(() => window.location.reload(), 500);
 // RELOAD FIRST
        },

        onError: () => {
            alert("⚠️ Something went wrong while logging your attendance.");
        },
    });
};



    // ======================
    // Edit Row
    // ======================
    const openEditModal = (row) => {
        setEditingRow({ ...row });
        setShowEditModal(true);
    };

const updateRow = () => {
    if (!editingRow || !editingRow.id) {
        return showAIMessage("⚠️ Missing row ID. Please reload and try again.");
    }

    router.put(route("attendance.update", { id: editingRow.id }), editingRow, {
        onSuccess: () => {
            setRows(
                rows.map((r) =>
                    r.id === editingRow.id ? editingRow : r
                )
            );

            setEditingRow(null);

            alert("✅ Attendance record updated successfully.", () => {
               
           setTimeout(() => window.location.reload(), 500);
            });
        },
        onError: () => {
            showAIMessage("⚠️ Something went wrong while updating. Try again.");
        },
    });
};



    // ======================
    // Delete Row
    // ======================
const deleteAttendance = (id) => {
    if (!confirm("Are you sure you want to delete this attendance?")) return;

    router.delete(route("attendance.destroy", { id }), {
        onSuccess: () => {
            setRows(rows.filter((r) => r.id !== id));
            alert("✅ Attendance deleted successfully.");
           setTimeout(() => window.location.reload(), 500);

        },
        onError: () => {
            alert("⚠️ Unable to delete attendance. Try again.");
        },
    });
};


    // ======================
    // View Modal
    // ======================
   const openViewModal = (row) => {
    // Directly use the database values for bstatus1 and bstatus2
    setSelectedRow(row);
    setShowViewModal(true);
};



    // ======================
    // Prepare table rows
    // ======================
    const tableRows = rows.map((row) => ({
        ...row,
        actions: (
            <div className="flex gap-2 justify-center">
                <button
                    className="px-3 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => openViewModal(row)}
                >
                    <i className="fa-solid fa-eye"></i>
                </button>

                { !row.cout && ( // only show if cout is null/empty
    <button
      className="px-3 py-2 bg-blue-600 text-white rounded-md"
      onClick={() => openEditModal(row)}
    >
      <i className="fa-solid fa-pen"></i>
    </button>
  )}

  { !row.cout && (
    <button
      className="px-3 py-2 bg-red-600 text-white rounded-md"
      onClick={() => deleteAttendance(row.id)}
    >
      <i className="fa-solid fa-trash"></i>
    </button>
  )}
            </div>
        ),
    }));

    return (
        <AuthenticatedLayout>
            <Head title="Attendance" />

            <div className={`min-h-screen relative p-6 rounded-md ${themeGradient}`}>
  {/* Animated layer */}
  {holiday === "christmas" && <Snowfall />}
  {holiday === "newyear" && <Fireworks />}
  {holiday === "valentine" && <Valentines />}
  {holiday === "halloween" && <Halloween />}

  {/* Page content */}
  <div className="relative z-10">
    {/* Header with greeting */}
    <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
      {holiday 
        ? `${greetings[holiday]}` 
        : ""}
      {holiday && (
        <span>
          {holiday === "christmas" && "🎄"}
          {holiday === "newyear" && "🎆"}
          {holiday === "valentine" && "💖"}
          {holiday === "halloween" && "🎃"}
        </span>
      )}
    </h3>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
  <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
    <i className="fa-regular fa-calendar-check"></i> Attendance List
  </h1>

  <button
    className="btn btn-sm px-3 py-2 bg-green-600 text-white rounded-md w-full sm:w-auto flex items-center justify-center gap-2"
    onClick={() => setShowAddModal(true)}
  >
    <i className="fa-solid fa-plus"></i>
    Add Logtime
  </button>
</div>

          <div className="bg-gray-100 rounded-md">
            <DataTable
                columns={[
                    { key: "date", label: "Date" },
                    { key: "cin", label: "Check In" },
                    { key: "bout1", label: "1st Break Out" },
                    { key: "bin1", label: "1st Break In" },
                    { key: "bout2", label: "2nd Break Out" },
                    { key: "bin2", label: "2nd Break In" },
                    { key: "cout", label: "Check Out" },
                    { key: "no_hours", label: "No. of Hours" },
                    { key: "actions", label: "Actions" },
                ]}
                data={tableRows}
                meta={{
                    from: tableData.from,
                    to: tableData.to,
                    total: tableData.total,
                    links: tableData.links,
                    currentPage: tableData.current_page,
                    lastPage: tableData.last_page,
                }}
                rowKey={(row) => row.id || row.tempKey}
                showExport={false}
            />
          </div>
            


            {/* Add Modal */}
<Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
  <div className={`${modalBg} p-6 space-y-4 rounded-xl shadow-xl`}>
    <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${modalTextColor}`}>
      <i className="fa-regular fa-calendar-check"></i> Add Biometric
    </h2>

    <div className="space-y-2">
      <label className={modalTextColor}><i className="fa-regular fa-calendar mr-1"></i>Date</label>
      <input
        type="date"
        className="input input-bordered w-full"
        value={selectedDate}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label className={modalTextColor}><i className="fa-regular fa-calendar-check mr-1"></i>Check In (CIN)</label>
      <input
        type="time"
        className="input input-bordered w-full"
        value={newCin}
        onChange={(e) => setNewCin(e.target.value)}
      />
    </div>

    <div className="mt-6 w-full flex justify-end">
      <button
        className="btn btn-sm px-3 py-2 bg-green-600 text-white rounded-md"
        onClick={addBiometricRow}
      >
        <i className="fa-solid fa-plus"></i> Submit
      </button>
    </div>
  </div>
</Modal>



            {/* Edit Modal */}
           {editingRow && (
  <Modal show={showEditModal} onClose={() => { setShowEditModal(false); setEditingRow(null); }}>
    <div className={`${modalBg} p-6 space-y-4 rounded-xl shadow-xl`}>
      <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${modalTextColor}`}>
        <i className="fa-regular fa-calendar-check mr-1"></i>
        {editingRow.cin ? "Edit Attendance" : "Add Attendance"}
      </h2>

      {/* Column select and input fields */}
      <div className="space-y-2">
        <label className={modalTextColor}><i className="fa-solid fa-pen"></i>Choose Column to Edit</label>
        <select
          className="select select-bordered w-full"
          value={editingRow.selectedField || ""}
          onChange={(e) => setEditingRow({ ...editingRow, selectedField: e.target.value })}
        >
          <option value="">-- Select --</option>
          <option value="cin">Check In</option>
          <option value="bout1">1st Break Out</option>
          <option value="bin1">1st Break In</option>
          <option value="bout2">2nd Break Out</option>
          <option value="bin2">2nd Break In</option>
          <option value="cout">Check Out</option>
        </select>
      </div>

      {editingRow.selectedField && (
        <div className="space-y-2">
          <label className={modalTextColor}>
            {editingRow.selectedField === "cin" && "Check In"}
            {editingRow.selectedField === "cout" && "Check Out"}
            {editingRow.selectedField === "bout1" && "1st Break Out"}
            {editingRow.selectedField === "bin1" && "1st Break In"}
            {editingRow.selectedField === "bout2" && "2nd Break Out"}
            {editingRow.selectedField === "bin2" && "2nd Break In"}
          </label>
          <input
            type="time"
            step="60"
            className="input input-bordered w-full"
            value={editingRow[editingRow.selectedField] || ""}
            onChange={(e) =>
              setEditingRow({ ...editingRow, [editingRow.selectedField]: e.target.value })
            }
          />
        </div>
      )}

      <div className="mt-6 w-full flex justify-end">
        <button
          className="btn btn-sm px-3 py-2 bg-green-600 text-white rounded-md"
          onClick={updateRow}
        >
          <i className="fa-solid fa-floppy-disk"></i> Save
        </button>
      </div>
    </div>
  </Modal>
)}


            {/* View Modal */}
{showViewModal && selectedRow && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
    onClick={() => setShowViewModal(false)}
  >
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl p-6 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <i className="fa-regular fa-calendar-check"></i> Attendance Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-900 dark:text-gray-100">
        {/* Date / Check In / Check Out */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-1">
          <p className="flex items-center gap-2">
            <i className="fa-regular fa-calendar"></i>
            <strong>Date:</strong> {selectedRow.date}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-sign-in-alt"></i>
            <strong>Check In:</strong> {selectedRow.cin}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-sign-out-alt"></i>
            <strong>Check Out:</strong> {selectedRow.cout}
          </p>
        </div>

        {/* 1st Break */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-1">
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-clock"></i>
            <strong>1st Break Out:</strong> {selectedRow.bout1}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <strong>1st Break In:</strong> {selectedRow.bin1}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-star"></i>
            <strong>1st Break Status:</strong> {selectedRow.bstatus1}
          </p>
        </div>

        {/* 2nd Break */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm space-y-1">
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-clock"></i>
            <strong>2nd Break Out:</strong> {selectedRow.bout2}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left"></i>
            <strong>2nd Break In:</strong> {selectedRow.bin2}
          </p>
          <p className="flex items-center gap-2">
            <i className="fa-solid fa-star"></i>
            <strong>2nd Break Status:</strong> {selectedRow.bstatus2}
          </p>
        </div>
      </div>

      {/* Close button */}
      <div className="mt-6 w-full flex justify-end">
        <button
          className="bg-red-500 px-4 py-2 text-white rounded-lg hover:bg-red-600 transition flex items-center"
          onClick={() => setShowViewModal(false)}
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          Close
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  </div>
        </AuthenticatedLayout>
    );
    
}
