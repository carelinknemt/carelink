@extends('mail.layout')

@section('title', 'Your CareLink Application Has Been Accepted')

@section('subline', 'Great news!')

@section('content')
    <p>Hello {{ $name }},</p>
    <p>
        Thank you for applying for
        @if ($position)
            the <strong>{{ $position }}</strong> position
        @else
            a position
        @endif
        at CareLink Medical
        Transportation. We are pleased to let you know that your
        application has been accepted.
    </p>
    <div class="notice notice-green">
        Our team will be in touch with details on next steps, including
        onboarding and training.
    </div>
    <p>
        Questions in the meantime? Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection