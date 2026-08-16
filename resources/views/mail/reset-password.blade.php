@extends('mail.layout')

@section('title', 'CareLink Password Reset')

@section('subline', 'Reset your password')

@section('content')
    <p>Hello {{ $user->name }},</p>
    <p>
        We received a request to reset the password for your CareLink
        dashboard account. Click the button below to choose a new password.
        This link expires in 60 minutes.
    </p>
    <p>
        <a class="button" href="{{ $resetUrl }}">Reset Your Password</a>
    </p>
    <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
        If the button does not work, copy and paste this link into your
        browser:<br>
        <a href="{{ $resetUrl }}" style="color: #004B87; text-decoration: none; word-break: break-all;">{{ $resetUrl }}</a>
    </p>
    <p style="font-size: 13px; color: #64748b;">
        If you did not request this reset, no further action is needed and
        you can safely ignore this email.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
    <br><br>
    Questions? Call our dispatch team at (707) 854-9350.
@endsection