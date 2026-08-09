<?php

use App\Http\Controllers\Carelink\AboutController;
use App\Http\Controllers\Carelink\Admin\AdminAuthController;
use App\Http\Controllers\Carelink\Admin\AdminDashboardController;
use App\Http\Controllers\Carelink\AppointmentController;
use App\Http\Controllers\Carelink\BlogController;
use App\Http\Controllers\Carelink\CareersController;
use App\Http\Controllers\Carelink\FaqController;
use App\Http\Controllers\Carelink\FleetController;
use App\Http\Controllers\Carelink\HomeController;
use App\Http\Controllers\Carelink\ServicesController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/services', [ServicesController::class, 'index'])->name('services');
Route::get('/fleet', [FleetController::class, 'index'])->name('fleet');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/faq', [FaqController::class, 'index'])->name('faq');
Route::get('/blog', [BlogController::class, 'index'])->name('blog');
Route::get('/careers', [CareersController::class, 'index'])->name('careers');

Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('admin.login.attempt');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/fleet', [AdminDashboardController::class, 'fleet'])->name('fleet');
        Route::get('/services', [AdminDashboardController::class, 'services'])->name('services');
        Route::patch('/bookings/{rideBooking}/status', [AdminDashboardController::class, 'updateBookingStatus'])
            ->name('bookings.update-status');
        Route::put('/services/rates', [AdminDashboardController::class, 'updateServiceRates'])
            ->name('services.update-rates');
    });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
