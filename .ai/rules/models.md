---
paths:
  - 'app/Models/**'
---

# Models

## Display formatting via Eloquent accessors
`RideBooking::rideDate()` serializes `ride_date` as `m/d/Y` and `BlogPost::publishedAt()` serializes `published_at` as `M j, Y` via Casts\Attribute. Controllers/frontend must not re-format; the accessors handle display.
