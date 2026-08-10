---
paths:
  - 'resources/js/components/carelink/**'
---

# Components Carelink

## Book form geocoding: Photon + react-leaflet, no API keys
Location search on the book form uses the free Photon geocoder (https://photon.komoot.io/api/) restricted to California via bbox=-124.482,32.528,-114.131,42.010 (results are filtered client-side too). Maps use react-leaflet v5 + CARTO light tiles (no API keys). Every location picker is debounced 350ms, min 3 chars, with AbortController. Coordinates are stored in trip_requests (pickup_/dropoff_ latitude/longitude) but are NOT part of the CSV contract.
