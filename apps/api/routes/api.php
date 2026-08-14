<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PengajuanController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminPengajuanController;

// ========================================
// PUBLIC ROUTES (untuk Web Client)
// ========================================
Route::post('/pengajuan', [PengajuanController::class, 'store']);
Route::get('/pengajuan/{identifier}', [PengajuanController::class, 'show']);
Route::get('/pengajuan', [PengajuanController::class, 'index']);

// ========================================
// ADMIN AUTH ROUTES
// ========================================
Route::post('/auth/login', [AdminAuthController::class, 'login']);

// ========================================
// ADMIN PROTECTED ROUTES (harus login)
// ========================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/me', [AdminAuthController::class, 'me']);
    Route::post('/auth/logout', [AdminAuthController::class, 'logout']);

    // Admin Pengajuan Management
    Route::get('/admin/pengajuan', [AdminPengajuanController::class, 'index']);
    Route::get('/admin/pengajuan/{id}', [AdminPengajuanController::class, 'show']);
    Route::put('/admin/pengajuan/{id}/progress', [AdminPengajuanController::class, 'updateProgress']);
    Route::delete('/admin/pengajuan/{id}', [AdminPengajuanController::class, 'destroy']);
    Route::get('/admin/stats', [AdminPengajuanController::class, 'stats']);
});
