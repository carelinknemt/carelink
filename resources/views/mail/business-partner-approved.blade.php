<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CareLink Partnership Approved</title>
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

        .notice {
            margin: 24px 0;
            padding: 16px 20px;
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            font-size: 14px;
            color: #065f46;
        }

        .footer {
            padding: 20px 32px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>CareLink Medical Transportation</h1>
                <p>Your partnership inquiry has been approved</p>
            </div>
            <div class="content">
                <p>Hello {{ $contactName }},</p>
                <p>
                    Great news! CareLink has approved
                    <strong>{{ $companyName }}</strong> as a transportation
                    partner. We're excited to start working with you.
                </p>
                <div class="notice">
                    Our team will contact you shortly to set up your account,
                    discuss scheduling, and arrange billing details.
                </div>
                <p>
                    Questions in the meantime? Call our dispatch team at
                    <a href="tel:17078549350" style="color: #004B87; text-decoration: none; font-weight: 700;">(707) 854-9350</a>.
                </p>
            </div>
            <div class="footer">
                CareLink Medical Transportation · Eureka, CA · (707) 854-9350
            </div>
        </div>
    </div>
</body>
</html>