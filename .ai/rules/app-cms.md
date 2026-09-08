---
paths:
  - app/Cms/FareEstimate.php
---

# App Cms

## Fare estimates come from Service rates, saved as estimated_price
The fare estimate is computed from Service base_rate + mileage_rate (services CMS collection) via FareEstimate::amountInCents($transportType, $miles) - base covers the first 5 miles, then mileage_rate per mile after. Ambulatory maps to ambulatory-sedan; every wheelchair-style vehicle maps to wheelchair-transport. BookController::store stores estimated_price + distance_miles on the booking (NOT part of the CSV contract), surfaced on admin bookings list + detail. Keep the rates in sync if services rates change.
