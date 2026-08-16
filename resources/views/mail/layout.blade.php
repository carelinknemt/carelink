<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>
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

        .notice {
            margin: 24px 0;
            padding: 16px 20px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            color: #475569;
        }

        .notice-green {
            background-color: #ecfdf5;
            border-color: #a7f3d0;
            color: #065f46;
        }

        .notice-green strong {
            color: #047857;
        }

        .notice-rose {
            background-color: #fff1f2;
            border-color: #fecdd3;
            color: #881337;
        }

        .notice-rose strong {
            color: #9f1239;
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

        @stack('styles')
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>CareLink Medical Transportation</h1>
                <p>@yield('subline')</p>
            </div>
            <div class="content">
                @yield('content')
            </div>
            <div class="footer">
                @yield('footer')
            </div>
        </div>
    </div>
</body>
</html>
