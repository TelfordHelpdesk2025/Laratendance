<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AttendanceListController extends Controller
{
    protected $datatable;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }

    // =========================
    // Index / DataTable
    // =========================
    public function index(Request $request)
    {
        $result = $this->datatable->handle(
            $request,
            'authify',
            'attendance',
            [
                'conditions' => function ($query) {
                    return $query
                        ->where('emp_id', session('emp_data')['emp_id']);
                },
                'searchColumns' => ['date', 'cin', 'bout1', 'bin1', 'bstatus1', 'bout2', 'bin2', 'bstatus2', 'cout'],
            ]
        );

        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Attendance/AttendanceList', [
            'tableData' => $result['data'],
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
            'emp_data' => session('emp_data'),
        ]);
    }

    // =========================
    // Helper to calculate bstatus
    // =========================
    protected function calculateBStatus(array $row): array
    {
        // Random praise options
        $praises = [
            "Nice, on time.",
            "Good, no excess.",
            "Great, back on time.",
            "Good, didn’t exceed.",
            "Nice, stayed on break time."
        ];

        // -------------------------------
        // BREAK 1 (bstatus1)
        // -------------------------------
        if (!empty($row['bout1']) && !empty($row['bin1'])) {

            $diff1 = (strtotime($row['bin1']) - strtotime($row['bout1'])) / 60;

            if ($diff1 > 60) {
                $row['bstatus1'] = "Over 1 hour break";
            } else {
                // Random praise
                $row['bstatus1'] = $praises[array_rand($praises)];
            }
        } else {
            $row['bstatus1'] = null;
        }

        // -------------------------------
        // BREAK 2 (bstatus2)
        // -------------------------------
        if (!empty($row['bout2']) && !empty($row['bin2'])) {

            $diff2 = (strtotime($row['bin2']) - strtotime($row['bout2'])) / 60;

            if ($diff2 > 30) {
                $row['bstatus2'] = "Over 30 minutes break";
            } else {
                // Random praise
                $row['bstatus2'] = $praises[array_rand($praises)];
            }
        } else {
            $row['bstatus2'] = null;
        }

        return $row;
    }


    // =========================
    // Store new attendance
    // =========================
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'  => 'required|string', // varchar
            'cin'   => 'nullable',
            'cout'  => 'nullable',
            'bout1' => 'nullable',
            'bin1'  => 'nullable',
            'bout2' => 'nullable',
            'bin2'  => 'nullable',
        ]);

        $validated['emp_id'] = session('emp_data')['emp_id'] ?? null;

        // Directly use value from input
        // $validated['date'] = $validated['date']; // optional

        $validated = $this->calculateBStatus($validated);

        $id = DB::connection('authify')->table('attendance')->insertGetId($validated);

        return back()->with([
            'success' => 'Attendance logged successfully',
            'newId'  => $id,
        ]);
    }


    // =========================
    // Update existing attendance
    // =========================
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'cin' => 'nullable',
            'cout' => 'nullable',
            'bout1' => 'nullable',
            'bin1' => 'nullable',
            'bout2' => 'nullable',
            'bin2' => 'nullable',
        ]);

        // Auto calculate bstatus1 & bstatus2
        $validated = $this->calculateBStatus($validated);

        DB::connection('authify')->table('attendance')
            ->where('id', $id)
            ->update($validated);

        return redirect()->back()->with('success', 'Attendance updated successfully');
    }

    public function destroy($id)
    {
        $deleted = DB::connection('authify')->table('attendance')->where('id', $id)->delete();

        if ($deleted) {
            return back()->with('success', 'Attendance deleted successfully.');
        }

        return back()->with('error', 'Unable to delete attendance. Please try again.');
    }
}
