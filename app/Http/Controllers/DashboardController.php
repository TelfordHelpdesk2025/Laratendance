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

        // Latest 5 attendance records (WITH no_hours computed & SAVED)
        $latestAttendance = DB::connection('authify')->table('attendance')
            ->where('emp_id', $emp_id)
            ->orderByDesc('date')
            ->get()
            ->map(function ($row) {

                $cinRaw  = trim($row->cin ?? "");
                $coutRaw = trim($row->cout ?? "");
                $date    = $row->date; // IMPORTANT – we use this!

                if ($cinRaw !== "" && $coutRaw !== "" && !empty($date)) {

                    try {
                        // Combine DATE + TIME para hindi error
                        $cin  = Carbon::parse("$date $cinRaw");
                        $cout = Carbon::parse("$date $coutRaw");

                        // Overnight fix (ex: 18:51 → 07:00 next day)
                        if ($cout->lessThan($cin)) {
                            $cout->addDay();
                        }

                        $hours = $cin->floatDiffInHours($cout);
                        $computedHours = round($hours, 2);

                        // Save back to DB
                        DB::connection('authify')->table('attendance')
                            ->where('id', $row->id)
                            ->update(['no_hours' => $computedHours]);

                        $row->no_hours = $computedHours;
                    } catch (\Exception $e) {
                        $row->no_hours = null;
                    }
                } else {
                    $row->no_hours = null;
                }

                return $row;
            });


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
