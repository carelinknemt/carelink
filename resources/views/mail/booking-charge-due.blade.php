@extends('mail.layout')

@section('title', 'CareLink Payment Due')

@section('subline')
    Trip request {{ $charge->tripRequest->booking_number }} - balance due
@endsection

@section('content')
    <p>Hello {{ $charge->tripRequest->passenger_first_name }} {{ $charge->tripRequest->passenger_last_name }},</p>
    <p>
        A payment of <strong>${{ $charge->amountInDollars() }}</strong> is due for your trip request
        <strong>{{ $charge->tripRequest->booking_number }}</strong>. Please complete the payment to
        keep your account in good standing. The payment link stays valid for 7 days.
    </p>
    @if ($charge->note)
        <div class="notice">
            {{ $charge->note }}
        </div>
    @endif
    <table class="details">
        <tr>
            <td>Booking Number</td>
            <td>{{ $charge->tripRequest->booking_number }}</td>
        </tr>
        <tr>
            <td>Amount Due</td>
            <td>${{ $charge->amountInDollars() }}</td>
        </tr>
        <tr>
            <td>Valid For</td>
            <td>7 days</td>
        </tr>
    </table>
    <p>
        <a class="button" href="{{ route('charges.pay', $charge) }}">
            Pay Now
        </a>
    </p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
        Questions? Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    <a href="{{ route('charges.pay', $charge) }}">
        {{ route('charges.pay', $charge) }}
    </a>
    <br><br>
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection