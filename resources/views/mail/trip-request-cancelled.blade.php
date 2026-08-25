@extends('mail.layout')

@section('title', 'CareLink Trip Request Cancelled')

@section('subline')
    Trip request {{ $tripRequest->booking_number }} - cancelled & refunded
@endsection

@push('styles')
    .header p { color: #fecdd3; }
@endpush

@section('content')
    <p>Hello {{ $tripRequest->passenger_first_name }} {{ $tripRequest->passenger_last_name }},</p>
    <p>
        Your trip request
        <strong>{{ $tripRequest->booking_number }}</strong> has been
        cancelled. We're sorry for any inconvenience this may cause.
    </p>
    <div class="notice notice-rose">
        Your <strong>$30.00 booking fee has been refunded</strong> to
        your original payment method. Refunds typically appear within
        5–10 business days, depending on your bank or card issuer.
    </div>
    <table class="details">
        <tr>
            <td>Trip Date</td>
            <td>{{ $tripRequest->trip_date?->toDateString() ?: 'N/A' }}</td>
        </tr>
        <tr>
            <td>Pickup</td>
            <td>{{ $tripRequest->pickup_address ?: 'N/A' }}</td>
        </tr>
        <tr>
            <td>Dropoff</td>
            <td>{{ $tripRequest->dropoff_address ?: 'N/A' }}</td>
        </tr>
    </table>
    <p>
        If you'd like to rebook or have any questions about this
        cancellation, our dispatch team is happy to help. Call us at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
    <br><br>
    Questions? Call our dispatch team and we'll take care of you.
@endsection
