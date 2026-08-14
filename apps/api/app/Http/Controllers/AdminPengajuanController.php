<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Illuminate\Http\Request;

class AdminPengajuanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengajuan::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%{$search}%")
                  ->orWhere('nim', 'LIKE', "%{$search}%")
                  ->orWhere('jenis_berkas', 'LIKE', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 10))
        );
    }

    public function show($id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        return response()->json($pengajuan);
    }

    public function updateProgress(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Diproses,Ditandatangani,Selesai,Ditolak',
            'catatan_admin' => 'nullable|string',
        ]);

        $pengajuan = Pengajuan::findOrFail($id);
        $pengajuan->status = $validated['status'];
        if (isset($validated['catatan_admin'])) {
            $pengajuan->catatan_admin = $validated['catatan_admin'];
        }
        $pengajuan->save();

        return response()->json([
            'message' => 'Progress berhasil diupdate',
            'data' => $pengajuan
        ]);
    }

    public function destroy($id)
    {
        $pengajuan = Pengajuan::findOrFail($id);
        $pengajuan->delete();

        return response()->json(['message' => 'Pengajuan berhasil dihapus']);
    }

    public function stats()
    {
        $total = Pengajuan::count();
        $diproses = Pengajuan::where('status', 'Diproses')->count();
        $ditandatangani = Pengajuan::where('status', 'Ditandatangani')->count();
        $selesai = Pengajuan::where('status', 'Selesai')->count();
        $ditolak = Pengajuan::where('status', 'Ditolak')->count();

        // Calculate Hari Ini and Perhatian
        $hari_ini = Pengajuan::whereDate('created_at', now()->toDateString())->count();
        $perhatian = Pengajuan::where('status', 'Diproses')->count();

        // Recent 7 days stats
        $weeklyStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $weeklyStats[] = [
                'date' => now()->subDays($i)->format('D'), // Mon, Tue, etc.
                'count' => Pengajuan::whereDate('created_at', $date)->count()
            ];
        }

        // Generate dynamic activities based on recent pengajuan
        $recentPengajuans = Pengajuan::orderBy('updated_at', 'desc')->take(4)->get();
        $activities = [];
        foreach ($recentPengajuans as $p) {
            $timeAgo = $p->updated_at->diffForHumans();
            
            if ($p->status === 'Selesai') {
                $user = 'Admin';
                $action = "menyelesaikan pengajuan {$p->jenis_berkas} milik {$p->nama}";
                $icon = 'check_circle';
                $iconColor = 'text-[#10b981]';
                $bgColor = 'bg-[#10b981]/10';
            } elseif ($p->status === 'Ditandatangani') {
                $user = 'Dekan Fakultas Sains';
                $action = "menandatangani berkas {$p->jenis_berkas} milik {$p->nama}";
                $icon = 'edit';
                $iconColor = 'text-primary';
                $bgColor = 'bg-primary/10';
            } elseif ($p->status === 'Ditolak') {
                $user = 'Admin';
                $action = "menolak pengajuan {$p->jenis_berkas} milik {$p->nama}";
                $icon = 'error';
                $iconColor = 'text-error';
                $bgColor = 'bg-error/10';
            } else { // Diproses
                $user = $p->nama;
                $action = "mengirim pengajuan baru: {$p->jenis_berkas}";
                $icon = 'description';
                $iconColor = 'text-blue-500';
                $bgColor = 'bg-blue-500/10';
            }

            $activities[] = [
                'user' => $user,
                'action' => $action,
                'time' => $timeAgo,
                'icon' => $icon,
                'iconColor' => $iconColor,
                'bgColor' => $bgColor
            ];
        }

        return response()->json([
            'total' => $total,
            'diproses' => $diproses,
            'ditandatangani' => $ditandatangani,
            'selesai' => $selesai,
            'ditolak' => $ditolak,
            'hari_ini' => $hari_ini,
            'perhatian' => $perhatian,
            'weekly' => $weeklyStats,
            'activities' => $activities
        ]);
    }
}
