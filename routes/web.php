<?php

use App\Http\Controllers\Carelink\AboutController;
use App\Http\Controllers\Carelink\AppointmentController;
use App\Http\Controllers\Carelink\BlogController;
use App\Http\Controllers\Carelink\BookController;
use App\Http\Controllers\Carelink\BusinessPartnerController;
use App\Http\Controllers\Carelink\CareersController;
use App\Http\Controllers\Carelink\DashboardAnalyticsController;
use App\Http\Controllers\Carelink\DashboardBookingController;
use App\Http\Controllers\Carelink\DashboardBusinessPartnerController;
use App\Http\Controllers\Carelink\DashboardCareerApplicationController;
use App\Http\Controllers\Carelink\DashboardController;
use App\Http\Controllers\Carelink\DashboardJobOpeningController;
use App\Http\Controllers\Carelink\DashboardPaymentController;
use App\Http\Controllers\Carelink\DashboardUserController;
use App\Http\Controllers\Carelink\FaqController;
use App\Http\Controllers\Carelink\FleetController;
use App\Http\Controllers\Carelink\HomeController;
use App\Http\Controllers\Carelink\ServicesController;
use App\Http\Controllers\Carelink\TermsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/terms', TermsController::class)->name('terms');
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
Route::get('/for-businesses', [BusinessPartnerController::class, 'index'])->name('business');
Route::post('/business-partners', [BusinessPartnerController::class, 'store'])->name('business.store');

Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/analytics', [DashboardAnalyticsController::class, 'index'])->name('dashboard.analytics');
    Route::get('/dashboard/bookings', [DashboardBookingController::class, 'index'])->name('dashboard.bookings');
    Route::get('/dashboard/bookings/export', [DashboardBookingController::class, 'export'])->name('dashboard.bookings.export');
    Route::get('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'show'])->name('dashboard.bookings.show');
    Route::get('/dashboard/bookings/{booking}/export', [DashboardBookingController::class, 'showExport'])->name('dashboard.bookings.show-export');
    Route::put('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'update'])->name('dashboard.bookings.update');
    Route::patch('/dashboard/bookings/{booking}/status', [DashboardBookingController::class, 'updateStatus'])->name('dashboard.bookings.update-status');
    Route::post('/dashboard/bookings/{booking}/cancel', [DashboardBookingController::class, 'cancel'])->name('dashboard.bookings.cancel');
    Route::get('/dashboard/business-partners', [DashboardBusinessPartnerController::class, 'index'])->name('dashboard.business-partners');
    Route::post('/dashboard/business-partners/{businessRequest}/approve', [DashboardBusinessPartnerController::class, 'approve'])->name('dashboard.business-partners.approve');
    Route::post('/dashboard/business-partners/{businessRequest}/reject', [DashboardBusinessPartnerController::class, 'reject'])->name('dashboard.business-partners.reject');
    Route::get('/dashboard/payments', [DashboardPaymentController::class, 'index'])->name('dashboard.payments');
    Route::get('/dashboard/applications', [DashboardCareerApplicationController::class, 'index'])->name('dashboard.applications');
    Route::get('/dashboard/applications/{application}/resume', [DashboardCareerApplicationController::class, 'resume'])->name('dashboard.applications.resume');
    Route::post('/dashboard/applications/{application}/accept', [DashboardCareerApplicationController::class, 'accept'])->name('dashboard.applications.accept');
    Route::post('/dashboard/applications/{application}/reject', [DashboardCareerApplicationController::class, 'reject'])->name('dashboard.applications.reject');
    Route::delete('/dashboard/applications/{application}', [DashboardCareerApplicationController::class, 'destroy'])->name('dashboard.applications.destroy');
    Route::get('/dashboard/job-openings', [DashboardJobOpeningController::class, 'index'])->name('dashboard.job-openings');
    Route::post('/dashboard/job-openings', [DashboardJobOpeningController::class, 'store'])->name('dashboard.job-openings.store');
    Route::put('/dashboard/job-openings/{career}', [DashboardJobOpeningController::class, 'update'])->name('dashboard.job-openings.update');
    Route::post('/dashboard/job-openings/{career}/toggle', [DashboardJobOpeningController::class, 'toggle'])->name('dashboard.job-openings.toggle');
    Route::delete('/dashboard/job-openings/{career}', [DashboardJobOpeningController::class, 'destroy'])->name('dashboard.job-openings.destroy');
    Route::get('/dashboard/users', [DashboardUserController::class, 'index'])->name('dashboard.users');
    Route::post('/dashboard/users', [DashboardUserController::class, 'store'])->name('dashboard.users.store');
    Route::post('/dashboard/users/{user}/ban-toggle', [DashboardUserController::class, 'toggleBan'])->name('dashboard.users.ban-toggle');
});

require __DIR__.'/settings.php';
