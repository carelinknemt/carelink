@extends('mail.layout')

@section('title', 'CareLink Knowledge Base')

@section('subline', 'Learn how to use the CareLink dashboard')

@section('content')
    <p>Hello {{ $user->name }},</p>
    <p>
        Welcome to CareLink. The Knowledge Base is a step-by-step guide to
        every page in the dashboard: managing trips and bookings, payments,
        recruitment, business partners, users, and website content.
    </p>
    <p>
        <a class="button" href="{{ $kmsUrl }}">Explore the Knowledge Base</a>
    </p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
        If the button does not work, copy and paste this link into your
        browser:<br>
        <a href="{{ $kmsUrl }}" style="color: #004B87; text-decoration: none; word-break: break-all;">{{ $kmsUrl }}</a>
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
    <br><br>
    Questions? Call our dispatch team at (707) 854-9350.
@endsection
