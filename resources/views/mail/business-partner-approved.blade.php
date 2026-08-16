@extends('mail.layout')

@section('title', 'CareLink Partnership Approved')

@section('subline', 'Your partnership inquiry has been approved')

@section('content')
    <p>Hello {{ $contactName }},</p>
    <p>
        Great news! CareLink has approved
        <strong>{{ $companyName }}</strong> as a transportation
        partner. We're excited to start working with you.
    </p>
    <div class="notice notice-green">
        Our team will contact you shortly to set up your account,
        discuss scheduling, and arrange billing details.
    </div>
    <p>
        Questions in the meantime? Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection
