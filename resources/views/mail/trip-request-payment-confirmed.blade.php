@extends('mail.layout')

@section('title', 'CareLink Trip Request Confirmed')

@section('subline')
    Trip request {{ $tripRequest->booking_number }} - payment confirmed
@endsection

@section('content')
    <p>Hello {{ $tripRequest->passenger_first_name }} {{ $tripRequest->passenger_last_name }},</p>
    <p>
        Your booking request has been received. Your confirmation number is
        <strong>{{ $tripRequest->booking_number }}</strong>. Our dispatch team
        will review and confirm your request. Thank you!
    </p>
    <table class="details">
        <tr>
            <td>Trip Date</td>
            <td>{{ $tripRequest->trip_date->toDateString() }}</td>
        </tr>
        <tr>
            <td>Pickup</td>
            <td>{{ $tripRequest->pickup_address }}</td>
        </tr>
        <tr>
            <td>Dropoff</td>
            <td>{{ $tripRequest->dropoff_address }}</td>
        </tr>
    </table>
    <p>
        <a class="button" href="{{ route('bookings.show', ['booking' => $tripRequest->booking_number]) }}">
            Track Your Booking
        </a>
    </p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
        Keep this link to check your trip status at any time. Questions?
        Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    <a href="{{ route('bookings.show', ['booking' => $tripRequest->booking_number]) }}">
        {{ route('bookings.show', ['booking' => $tripRequest->booking_number]) }}
    </a>
    <br><br>
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection
