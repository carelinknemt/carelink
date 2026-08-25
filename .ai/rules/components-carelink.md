---
paths:
  - 'resources/js/components/carelink/**'
---

# Components Carelink

## Book form geocoding: Photon + react-leaflet, no API keys
Location search on the book form uses the free Photon geocoder (https://photon.komoot.io/api/) restricted to California via bbox=-124.482,32.528,-114.131,42.010 (results are filtered client-side too). Maps use react-leaflet v5 + CARTO light tiles (no API keys). Every location picker is debounced 350ms, min 3 chars, with AbortController. Coordinates are stored in trip_requests (pickup_/dropoff_ latitude/longitude) but are NOT part of the CSV contract.

## Leaflet map needs a z-0 stacking context
Leaflet's internal panes/popups use z-index up to 1000+, which paint over the sticky header (z-40) and shadcn dialogs (z-50). Keep the leaflet container inside a self-contained stacking context: wrap MapPreview in a `relative z-0` div and set MapContainer className="relative z-0". Never render a react-leaflet map bare next to modals/navbars.

## Book form geocoding: Photon first, Mapbox fallback, Leaflet render
Location search on the book form (location-picker.tsx) tries Photon (https://photon.komoot.io/api/) first, then falls back to the Mapbox Places geocoder (https://api.mapbox.com/geocoding/v5/mapbox.places) when Photon returns no results or errors. The Mapbox token comes from VITE_MAPBOX_TOKEN in .env; the feature normalizes Mapbox responses into the same GeocodingFeature shape. Rendering stays on react-leaflet v5 + CARTO tiles; do not switch rendering to Mapbox GL. Both searches are restricted to California via bbox=-124.482,32.528,-114.131,42.010, debounced 350ms, min 3 chars, with AbortController.

## LocationPicker geocoding is Google Places only; OSRM stays key-free
location-picker.tsx uses Google Places API (New) Text Search (places:searchText) as the sole geocoder — Photon/Mapbox were removed Aug 2026 by client request. Key lives in VITE_GOOGLE_MAPS_API_KEY (client-side, so restrict it in Google Cloud Console to Places API + production referrers). California-only is enforced server-side via locationRestriction rectangle (32.528,-124.482 to 42.010,-114.131) — do not re-add client bbox filters. The old "no map API keys" rule applies to route drawing only: MapPreview must keep using free OSRM for driving routes; do not add Directions API there.
