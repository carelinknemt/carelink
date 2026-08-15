<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareLink Trip Request Cancelled</title>
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
            color: #fecdd3;
            font-size: 14px;
        }

        .content {
            padding: 32px;
        }

        .content p {
            font-size: 15px;
            line-height: 1.6;
        }

        .refund-notice {
            margin: 24px 0;
            padding: 16px 20px;
            background-color: #fff1f2;
            border: 1px solid #fecdd3;
            border-radius: 8px;
            font-size: 14px;
            color: #881337;
        }

        .refund-notice strong {
            color: #9f1239;
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
                <p>Trip request {{ $tripRequest->booking_number }} - cancelled &amp; refunded</p>
            </div>
            <div class="content">
                <p>Hello {{ $tripRequest->passenger_first_name }} {{ $tripRequest->passenger_last_name }},</p>
                <p>
                    Your trip request
                    <strong>{{ $tripRequest->booking_number }}</strong> has been
                    cancelled. We're sorry for any inconvenience this may cause.
                </p>
                <div class="refund-notice">
                    Your <strong>$30.00 booking fee has been refunded</strong> to
                    your original payment method. Refunds typically appear within
                    5–10 business days, depending on your bank or card issuer.
                </div>
                <table class="details">
                    <tr>
                        <td>Trip Date</td>
                        <td>{{ $tripRequest->trip_date?->toDateString() ?: 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>Pickup</td>
                        <td>{{ $tripRequest->pickup_address ?: 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>Dropoff</td>
                        <td>{{ $tripRequest->dropoff_address ?: 'N/A' }}</td>
                    </tr>
                </table>
                <p>
                    If you'd like to rebook or have any questions about this
                    cancellation, our dispatch team is happy to help. Call us at
                    <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
                </p>
            </div>
            <div class="footer">
                CareLink Medical Transportation · Eureka, CA · (707) 854-9350
                <br><br>
                Questions? Call our dispatch team and we'll take care of you.
            </div>
        </div>
    </div>
</body>
</html>