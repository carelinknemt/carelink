@extends('mail.layout')

@section('title', 'Update on Your CareLink Application')

@section('subline', 'An update on your application')

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
        Transportation. After careful review, we are unable to move
        forward with your application at this time.
    </p>
    <div class="notice notice-rose">
        We appreciate your interest in joining our team and invite you
        to apply for future openings as they are posted.
    </div>
    <p>
        <a href="{{ route('careers') }}" class="button">View open positions</a>
    </p>
    <p>
        Questions? Call our dispatch team at
        <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
    </p>
@endsection

@section('footer')
    CareLink Medical Transportation · Eureka, CA · (707) 854-9350
@endsection