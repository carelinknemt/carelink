@extends('mail.layout')

@section('title', 'CareLink Email Verification')

@section('subline', 'Verify your email address')

@section('content')
    <p>Hello {{ $user->name }},</p>
    <p>
        Thanks for creating your CareLink dashboard account. Please confirm
        your email address by clicking the button below. This link expires
        in 60 minutes.
    </p>
    <p>
        <a class="button" href="{{ $verificationUrl }}">Verify My Email</a>
    </p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
        If the button does not work, copy and paste this link into your
        browser:<br>
        <a href="{{ $verificationUrl }}" style="color: #004B87; text-decoration: none; word-break: break-all;">{{ $verificationUrl }}</a>
    </p>
    <p style="font-size: 13px; color: #64748b;">
        If you did not create an account with CareLink, you can safely
        ignore this email.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
    <br><br>
    Questions? Call our dispatch team at (707) 854-9350.
@endsection