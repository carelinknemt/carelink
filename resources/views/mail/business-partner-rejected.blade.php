@extends('mail.layout')

@section('title', 'CareLink Partnership Inquiry Status')

@section('subline', 'Update on your partnership inquiry')

@push('styles')
    .header p { color: #fecdd3; }
@endpush

@section('content')
    <p>Hello {{ $contactName }},</p>
    <p>
        Thank you for your interest in partnering with CareLink.
        After careful review, we are unable to approve
        <strong>{{ $companyName }}</strong> as a transportation
        partner at this time.
    </p>
    <div class="notice notice-rose">
        <strong>Reason:</strong> {{ $reason }}
    </div>
    <p>
        We appreciate your interest and hope to work together in
        the future. Questions? Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection
