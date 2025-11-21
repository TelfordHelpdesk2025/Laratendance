import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import Modal from "@/Components/Modal";
import { useState } from "react";

export default function AttendanceList({ tableData, tableFilters }) {
    const { emp_data } = usePage().props;
    const [rows, setRows] = useState(tableData.data || []);

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

    // ======================
    // Add Biometric
    // ======================
    const addBiometricRow = () => {
        if (!newCin || !selectedDate) {
            return showAIMessage("⚠️ Oops! Please select both a date and a check-in time.");
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

        setRows([newRow, ...rows]);
        setNewCin("");
        setSelectedDate("");
        setShowAddModal(false);

        router.post(route("attendance.store"), newRow, {
            onSuccess: (page) => {
                setRows((prevRows) =>
                    prevRows.map((r) =>
                        r.tempKey === tempKey
                            ? { ...r, id: page.props.newId, tempKey: undefined }
                            : r
                    )
                );
                showAIMessage("✅ Attendance logged successfully.");
            },
            onError: () => {
                showAIMessage("⚠️ Something went wrong while logging your attendance.");
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
        if (!editingRow) return;

        router.post(route("attendance.update", editingRow.id), editingRow, {
            onSuccess: () => {
                setRows(
                    rows.map((r) =>
                        r.id === editingRow.id ? editingRow : r
                    )
                );
                setEditingRow(null);
                setShowEditModal(false);
                showAIMessage("✅ Attendance record updated successfully.");
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

        router.delete(route("attendance.destroy", id), {
            onSuccess: () => {
                setRows(rows.filter((r) => r.id !== id));
                showAIMessage("✅ Attendance deleted successfully.");
            },
            onError: () => {
                showAIMessage("⚠️ Unable to delete attendance. Try again.");
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

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    <i className="fa-regular fa-calendar-check"></i> Attendance List
                </h1>
                <button
                    className="btn btn-sm px-3 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => setShowAddModal(true)}
                >
                    <i className="fa-solid fa-plus"></i>
                    Add Logtime
                </button>
            </div>

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

            {/* Add Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
  <div className="p-6 space-y-4">
    <h2 className="text-xl font-bold mb-4">
      <i className="fa-regular fa-calendar-check"></i> Add Biometric
    </h2>

    <div className="space-y-2">
      <label><i className="fa-regular fa-calendar mr-1"></i>Date</label>
      <input
        type="date"
        className="input input-bordered w-full"
        value={selectedDate}
        max={new Date().toISOString().split("T")[0]} // optional, prevent future date
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    <div className="space-y-2">
      <label><i className="fa-regular fa-calendar-check mr-1"></i>Check In (CIN)</label>
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
      <i className="fa-solid fa-plus"></i>
      Submit
    </button>
    </div>
  </div>
</Modal>


            {/* Edit Modal */}
            {editingRow && (
                <Modal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingRow(null);
                    }}
                >
                    <div className="p-6 space-y-4">
                        <h2 className="text-xl font-bold mb-4">
                            <i className="fa-regular fa-calendar-check mr-1"></i>
                            {editingRow.cin ? "Edit Attendance" : "Add Attendance"}
                        </h2>

                        {/* Select column to edit */}
                        <div className="space-y-2">
                            <label> <i className="fa-solid fa-pen"></i>Choose Column to Edit</label>
                            <select
                                className="select select-bordered w-full"
                                value={editingRow.selectedField || ""}
                                onChange={(e) =>
                                    setEditingRow({ ...editingRow, selectedField: e.target.value })
                                }
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

                        {/* Input for chosen column */}
                        {editingRow.selectedField && (
                            <div className="space-y-2">
                                <label>
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
                                        setEditingRow({
                                            ...editingRow,
                                            [editingRow.selectedField]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}

                        <div className="mt-6 w-full flex justify-end">

                       
                            <button
                                className="btn btn-sm px-3 py-2 bg-green-600 text-white rounded-md"
                                onClick={updateRow}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                                Save
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
        </AuthenticatedLayout>
    );
}
