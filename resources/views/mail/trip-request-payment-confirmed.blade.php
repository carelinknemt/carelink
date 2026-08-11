<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareLink Trip Request Confirmed</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
        }

        .wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 32px 16px;
        }

        .card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
        }

        .header {
            background-color: #004B87;
            padding: 24px 32px;
        }

        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 20px;
            font-weight: 800;
        }

        .header p {
            margin: 4px 0 0;
            color: #a5d8ff;
            font-size: 14px;
        }

        .content {
            padding: 32px;
        }

        .content p {
            font-size: 15px;
            line-height: 1.6;
        }

        .details {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
        }

        .details td {
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }

        .details td:first-child {
            color: #64748b;
        }

        .details td:last-child {
            font-weight: 700;
            text-align: right;
            color: #0f172a;
        }

        .button {
            display: inline-block;
            margin: 8px 0 0;
            padding: 12px 24px;
            background-color: #E64A19;
            color: #ffffff !important;
            border-radius: 8px;
            font-weight: 700;
            font-size: 14px;
            text-decoration: none;
        }

        .footer {
            padding: 20px 32px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }

        .footer a {
            color: #004B87;
            text-decoration: none;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>CareLink Medical Transportation</h1>
                <p>Trip request {{ $tripRequest->booking_number }} — payment confirmed</p>
            </div>
            <div class="content">
                <p>Hello {{ $tripRequest->passenger_first_name }} {{ $tripRequest->passenger_last_name }},</p>
                <p>
                    Thank you for choosing CareLink. We received your
                    <strong>$30.00 booking fee</strong> and your trip request has been
                    confirmed. Our dispatch team will be in touch shortly to arrange
                    your ride.
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
                    Keep this link to check your trip status at any time:
                </p>
            </div>
            <div class="footer">
                <a href="{{ route('bookings.show', ['booking' => $tripRequest->booking_number]) }}">
                    {{ route('bookings.show', ['booking' => $tripRequest->booking_number]) }}
                </a>
                <br><br>
                CareLink Medical Transportation · Eureka, CA
            </div>
        </div>
    </div>
</body>
</html>
