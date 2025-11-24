<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $emp_id = session('emp_data')['emp_id'] ?? null;

        $empName = session('emp_data')['emp_name'] ?? null;

        // Total Attendance Entries
        $totalAttendance = DB::connection('authify')->table('attendance')
            ->where('emp_id', $emp_id)
            ->count();

        // Total Check-ins today
        $today = Carbon::now()->format('Y-m-d');
        $todayAttendance = DB::connection('authify')->table('attendance')
            ->where('emp_id', $emp_id)
            ->whereDate('date', $today)
            ->count();

        // Total 1st Breaks Today
        $total1stBreak = DB::connection('authify')->table('attendance')
            ->where('emp_id', $emp_id)
            ->whereNotNull('bout1')
            ->whereDate('date', $today)
            ->count();

        // Latest 5 attendance records
        $latestAttendance = DB::connection('authify')->table('attendance')
            ->where('emp_id', $emp_id)
            ->orderByDesc('date')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'empName' => $empName,
            'summary' => [
                'totalAttendance' => $totalAttendance,
                'todayAttendance' => $todayAttendance,
                'total1stBreak' => $total1stBreak,
            ],
            'latestAttendance' => $latestAttendance,
        ]);
    }
}
