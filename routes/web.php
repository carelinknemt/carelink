<?php

use App\Http\Controllers\Carelink\AboutController;
use App\Http\Controllers\Carelink\AppointmentController;
use App\Http\Controllers\Carelink\BlogController;
use App\Http\Controllers\Carelink\BookController;
use App\Http\Controllers\Carelink\CareersController;
use App\Http\Controllers\Carelink\DashboardBookingController;
use App\Http\Controllers\Carelink\DashboardController;
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
Route::get('/book', [BookController::class, 'index'])->name('book');
Route::post('/bookings', [BookController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{booking}', [BookController::class, 'show'])->name('bookings.show');
Route::get('/bookings/{booking}/status', [BookController::class, 'status'])->name('bookings.status');
Route::post('/careers/apply', [CareersController::class, 'store'])->name('careers.apply');

Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/bookings', [DashboardBookingController::class, 'index'])->name('dashboard.bookings');
    Route::get('/dashboard/bookings/export', [DashboardBookingController::class, 'export'])->name('dashboard.bookings.export');
    Route::get('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'show'])->name('dashboard.bookings.show');
    Route::get('/dashboard/bookings/{booking}/export', [DashboardBookingController::class, 'showExport'])->name('dashboard.bookings.show-export');
    Route::put('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'update'])->name('dashboard.bookings.update');
    Route::patch('/dashboard/bookings/{booking}/status', [DashboardBookingController::class, 'updateStatus'])->name('dashboard.bookings.update-status');
});

require __DIR__.'/settings.php';
