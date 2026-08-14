<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use Illuminate\Http\Request;

class PengajuanController extends Controller
{
    public function index()
    {
        return response()->json(Pengajuan::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|max:255',
            'jenis_berkas' => 'required|string|max:255',
            'keterangan' => 'nullable|string'
        ]);

        $pengajuan = Pengajuan::create($validated);

        return response()->json([
            'message' => 'Pengajuan berhasil dibuat!',
            'data' => $pengajuan
        ], 201);
    }

    public function show($identifier)
    {
        // Search by NIM or nama (case-insensitive)
        $pengajuans = Pengajuan::where('nim', $identifier)
            ->orWhere('nama', 'LIKE', '%' . $identifier . '%')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($pengajuans->isEmpty()) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan'], 404);
        }

        return response()->json($pengajuans);
    }
}
