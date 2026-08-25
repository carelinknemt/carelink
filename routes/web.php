<?php

use App\Http\Controllers\Carelink\AboutController;
use App\Http\Controllers\Carelink\AppointmentController;
use App\Http\Controllers\Carelink\BlogController;
use App\Http\Controllers\Carelink\BookController;
use App\Http\Controllers\Carelink\BusinessPartnerController;
use App\Http\Controllers\Carelink\CareersController;
use App\Http\Controllers\Carelink\Cms\CmsBlogPostController;
use App\Http\Controllers\Carelink\Cms\CmsFaqController;
use App\Http\Controllers\Carelink\Cms\CmsFleetVehicleController;
use App\Http\Controllers\Carelink\Cms\CmsImageController;
use App\Http\Controllers\Carelink\Cms\CmsSectionController;
use App\Http\Controllers\Carelink\Cms\CmsServiceController;
use App\Http\Controllers\Carelink\Cms\CmsTeamMemberController;
use App\Http\Controllers\Carelink\ContactController;
use App\Http\Controllers\Carelink\DashboardAnalyticsController;
use App\Http\Controllers\Carelink\DashboardBlacklistController;
use App\Http\Controllers\Carelink\DashboardBookingController;
use App\Http\Controllers\Carelink\DashboardBusinessPartnerController;
use App\Http\Controllers\Carelink\DashboardCareerApplicationController;
use App\Http\Controllers\Carelink\DashboardContactMessageController;
use App\Http\Controllers\Carelink\DashboardController;
use App\Http\Controllers\Carelink\DashboardJobOpeningController;
use App\Http\Controllers\Carelink\DashboardPaymentController;
use App\Http\Controllers\Carelink\DashboardUserController;
use App\Http\Controllers\Carelink\FaqController;
use App\Http\Controllers\Carelink\FleetController;
use App\Http\Controllers\Carelink\HomeController;
use App\Http\Controllers\Carelink\KmsController;
use App\Http\Controllers\Carelink\PrivacyController;
use App\Http\Controllers\Carelink\RobotsController;
use App\Http\Controllers\Carelink\ServicesController;
use App\Http\Controllers\Carelink\SitemapController;
use App\Http\Controllers\Carelink\TermsController;
use App\Http\Middleware\AddNoIndexHeader;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/terms', TermsController::class)->name('terms');
Route::get('/privacy', PrivacyController::class)->name('privacy');
Route::get('/services', [ServicesController::class, 'index'])->name('services');
Route::get('/fleet', [FleetController::class, 'index'])->name('fleet');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/faq', [FaqController::class, 'index'])->name('faq');
Route::get('/blog', [BlogController::class, 'index'])->name('blog');
Route::get('/blog/{post}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/careers', [CareersController::class, 'index'])->name('careers');
Route::get('/book', [BookController::class, 'index'])->name('book');
Route::post('/bookings', [BookController::class, 'store'])->name('bookings.store');
Route::get('/bookings/{booking}', [BookController::class, 'show'])
    ->middleware(AddNoIndexHeader::class)
    ->name('bookings.show');
Route::get('/bookings/{booking}/status', [BookController::class, 'status'])->name('bookings.status');
Route::post('/careers/apply', [CareersController::class, 'store'])->name('careers.apply');
Route::get('/for-businesses', [BusinessPartnerController::class, 'index'])->name('business');
Route::post('/business-partners', [BusinessPartnerController::class, 'store'])->name('business.store');

Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::redirect('/admin', '/login');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/kms', [KmsController::class, 'index'])->name('kms');

    Route::middleware('role:manager,admin')->group(function () {
        Route::get('/dashboard/analytics', [DashboardAnalyticsController::class, 'index'])->name('dashboard.analytics');
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
        Route::get('/dashboard/business-partners', [DashboardBusinessPartnerController::class, 'index'])->name('dashboard.business-partners');
        Route::post('/dashboard/business-partners/{businessRequest}/approve', [DashboardBusinessPartnerController::class, 'approve'])->name('dashboard.business-partners.approve');
        Route::post('/dashboard/business-partners/{businessRequest}/reject', [DashboardBusinessPartnerController::class, 'reject'])->name('dashboard.business-partners.reject');
    });

    Route::middleware('role:dispatcher,admin')->group(function () {
        Route::get('/dashboard/bookings', [DashboardBookingController::class, 'index'])->name('dashboard.bookings');
        Route::get('/dashboard/bookings/export', [DashboardBookingController::class, 'export'])->name('dashboard.bookings.export');
        Route::get('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'show'])->name('dashboard.bookings.show');
        Route::get('/dashboard/bookings/{booking}/export', [DashboardBookingController::class, 'showExport'])->name('dashboard.bookings.show-export');
        Route::put('/dashboard/bookings/{booking}', [DashboardBookingController::class, 'update'])->name('dashboard.bookings.update');
        Route::patch('/dashboard/bookings/{booking}/status', [DashboardBookingController::class, 'updateStatus'])->name('dashboard.bookings.update-status');
        Route::post('/dashboard/bookings/{booking}/cancel', [DashboardBookingController::class, 'cancel'])->name('dashboard.bookings.cancel');
        Route::get('/dashboard/blacklist', [DashboardBlacklistController::class, 'index'])->name('dashboard.blacklist');
        Route::post('/dashboard/blacklist', [DashboardBlacklistController::class, 'store'])->name('dashboard.blacklist.store');
        Route::delete('/dashboard/blacklist/{blacklist}', [DashboardBlacklistController::class, 'destroy'])->name('dashboard.blacklist.destroy');
    });

    Route::middleware('role:admin')->group(function () {
        Route::get('/dashboard/payments', [DashboardPaymentController::class, 'index'])->name('dashboard.payments');
        Route::get('/dashboard/users', [DashboardUserController::class, 'index'])->name('dashboard.users');
        Route::post('/dashboard/users', [DashboardUserController::class, 'store'])->name('dashboard.users.store');
        Route::patch('/dashboard/users/{user}/role', [DashboardUserController::class, 'updateRole'])->name('dashboard.users.update-role');
        Route::post('/dashboard/users/{user}/ban-toggle', [DashboardUserController::class, 'toggleBan'])->name('dashboard.users.ban-toggle');
    });

    Route::middleware('role:dispatcher,manager,admin')->group(function () {
        Route::get('/dashboard/contact-messages', [DashboardContactMessageController::class, 'index'])->name('dashboard.contact-messages');
        Route::post('/dashboard/contact-messages/{contactMessage}/read', [DashboardContactMessageController::class, 'markRead'])->name('dashboard.contact-messages.read');
        Route::delete('/dashboard/contact-messages/{contactMessage}', [DashboardContactMessageController::class, 'destroy'])->name('dashboard.contact-messages.destroy');
    });

    Route::middleware('role:admin')->prefix('cms')->name('cms.')->group(function () {
        Route::get('/', [CmsSectionController::class, 'index'])->name('index');
        Route::put('/sections/{section}', [CmsSectionController::class, 'update'])->name('sections.update');
        Route::post('/sections/{section}/restore', [CmsSectionController::class, 'restore'])->name('sections.restore');
        Route::post('/sections/restore-all', [CmsSectionController::class, 'restoreAll'])->name('sections.restore-all');
        Route::post('/images', [CmsImageController::class, 'store'])->name('images.store');
        Route::get('/services', [CmsServiceController::class, 'index'])->name('services.index');
        Route::post('/services', [CmsServiceController::class, 'store'])->name('services.store');
        Route::put('/services/{service}', [CmsServiceController::class, 'update'])->name('services.update');
        Route::delete('/services/{service}', [CmsServiceController::class, 'destroy'])->name('services.destroy');
        Route::post('/services/restore', [CmsServiceController::class, 'restore'])->name('services.restore');
        Route::get('/fleet', [CmsFleetVehicleController::class, 'index'])->name('fleet.index');
        Route::post('/fleet', [CmsFleetVehicleController::class, 'store'])->name('fleet.store');
        Route::put('/fleet/{vehicle}', [CmsFleetVehicleController::class, 'update'])->name('fleet.update');
        Route::delete('/fleet/{vehicle}', [CmsFleetVehicleController::class, 'destroy'])->name('fleet.destroy');
        Route::post('/fleet/restore', [CmsFleetVehicleController::class, 'restore'])->name('fleet.restore');
        Route::get('/team', [CmsTeamMemberController::class, 'index'])->name('team.index');
        Route::post('/team', [CmsTeamMemberController::class, 'store'])->name('team.store');
        Route::put('/team/{member}', [CmsTeamMemberController::class, 'update'])->name('team.update');
        Route::delete('/team/{member}', [CmsTeamMemberController::class, 'destroy'])->name('team.destroy');
        Route::post('/team/restore', [CmsTeamMemberController::class, 'restore'])->name('team.restore');
        Route::get('/faqs', [CmsFaqController::class, 'index'])->name('faqs.index');
        Route::post('/faqs', [CmsFaqController::class, 'store'])->name('faqs.store');
        Route::put('/faqs/{faq}', [CmsFaqController::class, 'update'])->name('faqs.update');
        Route::delete('/faqs/{faq}', [CmsFaqController::class, 'destroy'])->name('faqs.destroy');
        Route::post('/faqs/restore', [CmsFaqController::class, 'restore'])->name('faqs.restore');
        Route::get('/blog', [CmsBlogPostController::class, 'index'])->name('blog.index');
        Route::post('/blog', [CmsBlogPostController::class, 'store'])->name('blog.store');
        Route::put('/blog/{post}', [CmsBlogPostController::class, 'update'])->name('blog.update');
        Route::delete('/blog/{post}', [CmsBlogPostController::class, 'destroy'])->name('blog.destroy');
        Route::post('/blog/restore', [CmsBlogPostController::class, 'restore'])->name('blog.restore');
    });
});

require __DIR__.'/settings.php';
