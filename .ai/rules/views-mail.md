---
paths:
  - 'resources/views/mail/**'
---

# Views Mail

## Never pass Blade {{ }} inside inline @section value arguments
@section('subline', "... {{ $var }} ...") compiles {{ }} into a nested literal <?php echo ?> inside the string that never executes and leaks verbatim into the email header. This shipped live in trip-request-payment-confirmed/cancelled subjects ("Trip request <?php echo e(CL-NEMT-...). Use block form instead: @section('subline') ... {{ $var }} ... @endsection. Regression guards: assertSeeInHtml('...booking_number...', false) + assertDontSeeInHtml('<?php', false) in TripRequestBillingTest and DashboardBookingsTest. Note: static template text like '&' is NOT html-escaped by Blade (only interpolated values are), so raw-string assertions need escape=false.
