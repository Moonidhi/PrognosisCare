import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

const MAPBOX_GEOCODE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const OPENCAGE_GEOCODE_URL = 'https://api.opencagedata.com/geocode/v1/json';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const MAPBOX_TILE_URL = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`
  : null;
const MAPBOX_ATTRIBUTION = '© Mapbox © OpenStreetMap';
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '© OpenStreetMap contributors';

const HOSPITAL_SEARCH_RADII = [5000, 10000, 20000, 40000];
const GEOCODE_TIMEOUT_MS = 4500;
const HOSPITAL_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const AMBULANCE_SPAWN_OFFSET = 0.01;

const STATIC_HOSPITALS = [
  { id: 'static-aiims-delhi', name: 'AIIMS New Delhi', lat: 28.5672, lng: 77.2100 },
  { id: 'static-apollo-chennai', name: 'Apollo Hospital Chennai', lat: 13.0615, lng: 80.2513 },
  { id: 'static-nimhans', name: 'NIMHANS Bengaluru', lat: 12.9433, lng: 77.5963 },
  { id: 'static-tata-mumbai', name: 'Tata Memorial Hospital Mumbai', lat: 19.0047, lng: 72.8425 },
  { id: 'static-civil-ahmedabad', name: 'Civil Hospital Ahmedabad', lat: 23.0479, lng: 72.6034 },
  { id: 'static-aig-hyderabad', name: 'AIG Hospitals Hyderabad', lat: 17.4381, lng: 78.4106 },
  { id: 'static-amri-kolkata', name: 'AMRI Hospital Kolkata', lat: 22.5726, lng: 88.3639 },
  { id: 'static-sgp-lucknow', name: 'SGPGI Lucknow', lat: 26.7569, lng: 80.9462 },
];

function computeDistanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

function interpolate(start, end, progress) {
  return {
    lat: start.lat + (end.lat - start.lat) * progress,
    lng: start.lng + (end.lng - start.lng) * progress,
  };
}

function buildFallbackRoute(start, end, steps = 40) {
  if (steps < 2) return [start, end];
  return Array.from({ length: steps }, (_, index) => interpolate(start, end, index / (steps - 1)));
}

function buildOverpassQuery(lat, lng, radius) {
  return `[out:json];node["amenity"="hospital"](around:${radius},${lat},${lng});out;`;
}

async function withRetry(action, retries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function mapboxGeocode(query) {
  if (!MAPBOX_TOKEN) {
    throw new Error('Mapbox token missing.');
  }

  const url = `${MAPBOX_GEOCODE_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=IN`;
  const data = await fetchJsonWithTimeout(url, { headers: { 'Accept-Language': 'en' } }, GEOCODE_TIMEOUT_MS);
  const feature = data.features?.[0];

  if (!feature?.center?.length) {
    throw new Error('No Mapbox results.');
  }

  return {
    lat: feature.center[1],
    lng: feature.center[0],
    label: feature.place_name || query,
    source: 'mapbox',
  };
}

async function openCageGeocode(query) {
  if (!OPENCAGE_API_KEY) {
    throw new Error('OpenCage key missing.');
  }

  const url = `${OPENCAGE_GEOCODE_URL}?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&limit=1&countrycode=IN&no_annotations=1`;
  const data = await fetchJsonWithTimeout(url, { headers: { 'Accept-Language': 'en' } }, GEOCODE_TIMEOUT_MS);
  const result = data.results?.[0];

  if (!result?.geometry) {
    throw new Error('No OpenCage results.');
  }

  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    label: result.formatted || query,
    source: 'opencage',
  };
}

async function nominatimGeocode(query) {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('countrycodes', 'in');

  const results = await fetchJsonWithTimeout(url.toString(), { headers: { 'Accept-Language': 'en' } }, GEOCODE_TIMEOUT_MS);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('No Nominatim results.');
  }

  const best = results[0];
  return {
    lat: Number(best.lat),
    lng: Number(best.lon),
    label: best.display_name || query,
    source: 'nominatim',
  };
}

async function geocodeLocation(query, cacheRef) {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error('Please enter a pickup location.');
  }

  if (cacheRef?.current?.has(trimmed)) {
    return cacheRef.current.get(trimmed);
  }

  let lastError;
  const providers = [mapboxGeocode, openCageGeocode, nominatimGeocode];

  for (const provider of providers) {
    try {
      const result = await withRetry(() => provider(trimmed));
      cacheRef?.current?.set(trimmed, result);
      return result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to resolve pickup location.');
}

function readCachedHospitals(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.hospitals || !Array.isArray(parsed.hospitals)) return null;
    if (parsed.timestamp && Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      return null;
    }
    return parsed.hospitals;
  } catch {
    return null;
  }
}

function cacheHospitals(cacheKey, hospitals) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ hospitals, timestamp: Date.now() }));
  } catch {
    // ignore cache failures
  }
}

function hospitalCacheKey(lat, lng, radius) {
  return `pc_hospitals_${lat.toFixed(2)}_${lng.toFixed(2)}_${radius}`;
}

async function fetchGoogleHospitals(lat, lng, radius) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places key missing.');
  }

  const url = `${GOOGLE_PLACES_URL}?location=${lat},${lng}&radius=${radius}&type=hospital&key=${GOOGLE_PLACES_API_KEY}`;
  const data = await fetchJsonWithTimeout(url, {}, HOSPITAL_TIMEOUT_MS);

  if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places error: ${data.status}`);
  }

  return (data.results || [])
    .map((result) => ({
      id: result.place_id,
      name: result.name || 'Nearby Hospital',
      lat: result.geometry?.location?.lat,
      lng: result.geometry?.location?.lng,
      source: 'google',
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
}

async function fetchOverpassHospitals(lat, lng, radius) {
  const response = await fetchJsonWithTimeout(
    OVERPASS_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(buildOverpassQuery(lat, lng, radius))}`,
    },
    HOSPITAL_TIMEOUT_MS
  );

  return (response.elements || [])
    .map((element) => ({
      id: element.id,
      name: element.tags?.name || 'Nearby Hospital',
      lat: element.lat,
      lng: element.lon,
      source: 'overpass',
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
}

function fetchStaticHospitals(pickupPoint, radius) {
  const sorted = STATIC_HOSPITALS
    .map((hospital) => ({
      ...hospital,
      distanceKm: Number(computeDistanceKm(pickupPoint, hospital).toFixed(2)),
      source: 'static',
    }))
    .sort((first, second) => first.distanceKm - second.distanceKm);

  if (!radius) return sorted;
  const within = sorted.filter((hospital) => hospital.distanceKm * 1000 <= radius);
  return within.length ? within : sorted;
}

async function fetchHospitalsWithFallback(pickupPoint, cacheRef) {
  for (const radius of HOSPITAL_SEARCH_RADII) {
    const cacheKey = hospitalCacheKey(pickupPoint.lat, pickupPoint.lng, radius);
    const inMemory = cacheRef?.current?.get(cacheKey);
    if (inMemory?.length) {
      return { hospitals: inMemory, source: 'cache' };
    }

    const cached = readCachedHospitals(cacheKey);
    if (cached?.length) {
      cacheRef?.current?.set(cacheKey, cached);
      return { hospitals: cached, source: 'cache' };
    }

    try {
      const googleHospitals = await withRetry(() => fetchGoogleHospitals(pickupPoint.lat, pickupPoint.lng, radius));
      if (googleHospitals.length) {
        cacheRef?.current?.set(cacheKey, googleHospitals);
        cacheHospitals(cacheKey, googleHospitals);
        return { hospitals: googleHospitals, source: 'google' };
      }
    } catch {
      // fallback to next provider
    }

    try {
      const overpassHospitals = await withRetry(() => fetchOverpassHospitals(pickupPoint.lat, pickupPoint.lng, radius));
      if (overpassHospitals.length) {
        cacheRef?.current?.set(cacheKey, overpassHospitals);
        cacheHospitals(cacheKey, overpassHospitals);
        return { hospitals: overpassHospitals, source: 'overpass' };
      }
    } catch {
      // continue to next radius
    }
  }

  return { hospitals: fetchStaticHospitals(pickupPoint), source: 'static' };
}

function createFallbackHospital(pickupPoint) {
  const fallbackPoint = getRandomNearby(pickupPoint.lat, pickupPoint.lng, AMBULANCE_SPAWN_OFFSET * 2);
  return {
    id: 'fallback-hospital',
    name: 'Nearest Available Hospital',
    lat: fallbackPoint.lat,
    lng: fallbackPoint.lng,
    distanceKm: Number(computeDistanceKm(pickupPoint, fallbackPoint).toFixed(2)),
    source: 'fallback',
  };
}

async function findNearestHospital(pickupPoint, cacheRef) {
  const { hospitals, source } = await fetchHospitalsWithFallback(pickupPoint, cacheRef);
  if (!hospitals.length) {
    return createFallbackHospital(pickupPoint);
  }

  const nearest = hospitals
    .map((hospital) => ({
      ...hospital,
      distanceKm: Number(computeDistanceKm(pickupPoint, hospital).toFixed(2)),
    }))
    .sort((first, second) => first.distanceKm - second.distanceKm)[0];

  return { ...nearest, source: nearest.source || source };
}

async function fetchRoadRoute(start, end) {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to fetch road route.');
  }

  const payload = await response.json();
  const route = payload?.routes?.[0];
  if (!route?.geometry?.coordinates?.length) {
    throw new Error('No route geometry received.');
  }

  const points = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
  return {
    points,
    durationMinutes: Math.max(3, Math.round((route.duration || 0) / 60)),
    distanceKm: Number(((route.distance || 0) / 1000).toFixed(1)),
  };
}

async function fetchRouteWithFallback(start, end) {
  try {
    return await fetchRoadRoute(start, end);
  } catch {
    const distanceKm = Number(computeDistanceKm(start, end).toFixed(1));
    const durationMinutes = Math.max(4, Math.round(distanceKm * 2));
    return {
      points: buildFallbackRoute(start, end, 48),
      durationMinutes,
      distanceKm,
    };
  }
}


function getRandomNearby(lat, lng, offset = AMBULANCE_SPAWN_OFFSET) {
  return {
    lat: lat + (Math.random() - 0.5) * offset,
    lng: lng + (Math.random() - 0.5) * offset,
  };
}

const ambulanceIcon = L.divIcon({
  html: '<div style="font-size: 22px;">🚑</div>',
  className: 'ambulance-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function FitToRoute({ routePoints, hospitalPoint, patientPoint, ambulancePoint }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...(routePoints || []),
      ...(patientPoint ? [patientPoint] : []),
      ...(hospitalPoint ? [hospitalPoint] : []),
      ...(ambulancePoint ? [ambulancePoint] : []),
    ];

    if (!points.length) return;

    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds.pad(0.35));
  }, [map, routePoints, hospitalPoint, patientPoint, ambulancePoint]);

  return null;
}

function AmbulanceRequestPage() {
  const [pickupQuery, setPickupQuery] = useState('');
  const [debouncedPickupQuery, setDebouncedPickupQuery] = useState('');
  const [requested, setRequested] = useState(false);
  const [patientPoint, setPatientPoint] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [ambulanceStart, setAmbulanceStart] = useState(null);
  const [routeToPickup, setRouteToPickup] = useState([]);
  const [routeToHospital, setRouteToHospital] = useState([]);
  const [routeMeta, setRouteMeta] = useState({ toPickup: null, toHospital: null });
  const [routeIndex, setRouteIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [etaMins, setEtaMins] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  const geocodeCacheRef = useRef(new Map());
  const hospitalCacheRef = useRef(new Map());
  const lastKnownPickupRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPickupQuery(pickupQuery.trim());
    }, 450);

    return () => clearTimeout(timer);
  }, [pickupQuery]);

  const activeRoutePoints = useMemo(() => {
    if (phase === 'to_pickup') return routeToPickup;
    if (phase === 'to_hospital' || phase === 'arrived') return routeToHospital;
    return [];
  }, [phase, routeToPickup, routeToHospital]);

  const ambulancePoint = useMemo(() => {
    if (activeRoutePoints.length) {
      return activeRoutePoints[Math.min(routeIndex, activeRoutePoints.length - 1)] || null;
    }
    return ambulanceStart;
  }, [activeRoutePoints, routeIndex, ambulanceStart]);

  const combinedRoutePoints = useMemo(
    () => [...routeToPickup, ...routeToHospital],
    [routeToPickup, routeToHospital]
  );

  useEffect(() => {
    if (!requested) return undefined;
    if (phase !== 'to_pickup' && phase !== 'to_hospital') return undefined;
    if (!activeRoutePoints.length) return undefined;

    const total = activeRoutePoints.length - 1;
    const pointsPerTick = Math.max(1, Math.ceil(activeRoutePoints.length / 160));

    const timer = setInterval(() => {
      setRouteIndex((prev) => {
        if (total <= 0) return prev;

        const nextIndex = Math.min(prev + pointsPerTick, total);
        const nextProgress = nextIndex / total;
        setProgress(nextProgress);

        const duration =
          phase === 'to_pickup'
            ? routeMeta.toPickup?.durationMinutes
            : routeMeta.toHospital?.durationMinutes;
        const mins = Math.max(1, Math.ceil((1 - nextProgress) * (duration || 1)));
        setEtaMins(mins);

        if (phase === 'to_pickup') {
          setStatusText(`Ambulance en route to pickup. ETA ~${mins} min.`);
        } else {
          setStatusText(`Heading to ${nearestHospital?.name || 'nearest hospital'}. ETA ~${mins} min.`);
        }

        if (nextIndex >= total) {
          if (phase === 'to_pickup') {
            setPhase('to_hospital');
            setStatusText(`Heading to ${nearestHospital?.name || 'nearest hospital'}...`);
            setEtaMins(routeMeta.toHospital?.durationMinutes ?? null);
            setProgress(0);
            return 0;
          }
          setPhase('arrived');
          setStatusText(`Arrived at ${nearestHospital?.name || 'the hospital'}.`);
          setEtaMins(0);
          return total;
        }

        return nextIndex;
      });
    }, 750);

    return () => clearInterval(timer);
  }, [
    requested,
    phase,
    activeRoutePoints,
    nearestHospital?.name,
    routeMeta.toPickup?.durationMinutes,
    routeMeta.toHospital?.durationMinutes,
  ]);

  const handleRequestAmbulance = async () => {
    const query = debouncedPickupQuery || pickupQuery.trim();
    if (!query) return;

    setAddressError('');
    setIsResolvingAddress(true);
    setStatusText('Resolving pickup location...');
    setRequested(true);
    setPhase('idle');

    try {
      let pickup;
      try {
        pickup = await geocodeLocation(query, geocodeCacheRef);
        lastKnownPickupRef.current = pickup;
      } catch (error) {
        console.warn('Geocoding failed. Falling back to approximate pickup.', error);
        pickup = lastKnownPickupRef.current
          ? { ...lastKnownPickupRef.current, label: `${lastKnownPickupRef.current.label} (approximate)` }
          : { ...INDIA_CENTER, label: 'Approximate location (India)', source: 'approximate' };
        setAddressError('Using approximate location for faster response.');
      }

      setPatientPoint(pickup);
      setStatusText('Finding nearest hospital...');

      let nearest;
      try {
        nearest = await findNearestHospital(pickup, hospitalCacheRef);
      } catch (error) {
        console.warn('Hospital lookup failed. Falling back to approximate hospital.', error);
        nearest = createFallbackHospital(pickup);
        setAddressError('Using approximate hospital location for faster response.');
      }

      setNearestHospital(nearest);

      const ambulanceSpawn = getRandomNearby(pickup.lat, pickup.lng);
      setAmbulanceStart(ambulanceSpawn);

      setStatusText('Ambulance dispatched. Routing to pickup...');

      const [routeToUser, routeToHospitalResult] = await Promise.all([
        fetchRouteWithFallback(ambulanceSpawn, pickup),
        fetchRouteWithFallback(pickup, nearest),
      ]);

      setRouteToPickup(routeToUser.points);
      setRouteToHospital(routeToHospitalResult.points);
      setRouteMeta({
        toPickup: routeToUser,
        toHospital: routeToHospitalResult,
      });
      setRouteIndex(0);
      setProgress(0);
      setEtaMins(routeToUser.durationMinutes);
      setPhase('to_pickup');
    } catch (error) {
      console.error('Ambulance dispatch error:', error);
      setAddressError(error?.message || 'Unable to dispatch ambulance. Please try again.');
      setRequested(false);
      setPhase('idle');
      setRouteToPickup([]);
      setRouteToHospital([]);
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const resetSimulation = () => {
    setRequested(false);
    setPatientPoint(null);
    setNearestHospital(null);
    setAmbulanceStart(null);
    setEtaMins(null);
    setProgress(0);
    setRouteToPickup([]);
    setRouteToHospital([]);
    setRouteMeta({ toPickup: null, toHospital: null });
    setRouteIndex(0);
    setStatusText('');
    setAddressError('');
    setPhase('idle');
  };

  const mapCenter = patientPoint ? [patientPoint.lat, patientPoint.lng] : [INDIA_CENTER.lat, INDIA_CENTER.lng];
  const isTraveling = phase === 'to_pickup' || phase === 'to_hospital';
  const progressPercent = Math.round(progress * 100);
  const tileUrl = MAPBOX_TILE_URL || OSM_TILE_URL;
  const tileAttribution = MAPBOX_TILE_URL ? MAPBOX_ATTRIBUTION : OSM_ATTRIBUTION;

  return (
    <div className="page-shell space-y-4 pb-24">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Emergency Support</p>
        <h2 className="mt-1 text-2xl font-bold">Request Ambulance</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter a pickup location in India. We will dispatch the nearest hospital ambulance to you and route it to the hospital.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Enter Pickup Location
          <input
            className="input mt-2"
            placeholder="e.g. T Nagar, Chennai"
            value={pickupQuery}
            onChange={(event) => setPickupQuery(event.target.value)}
          />
        </label>
        {addressError ? <p className="mt-2 text-xs text-amber-700">{addressError}</p> : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleRequestAmbulance}
            disabled={!pickupQuery.trim() || isResolvingAddress}
          >
            {isResolvingAddress ? 'Finding Nearest Hospital...' : 'Request Ambulance'}
          </button>
          {requested ? (
            <button type="button" className="btn-secondary" onClick={resetSimulation}>
              Reset Simulation
            </button>
          ) : null}
        </div>
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-semibold">Live Ambulance Tracking</h3>
          {requested && nearestHospital ? (
            <p className="text-sm text-slate-600">
              Nearest Hospital:{' '}
              <span className="font-semibold text-med-700">{nearestHospital.name}</span>
            </p>
          ) : null}
        </div>

        {requested && nearestHospital ? (
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <p>Pickup: {patientPoint?.label || 'Resolving pickup address...'}</p>
            <p>Nearest hospital distance: ~{nearestHospital.distanceKm} km</p>
            {routeMeta.toPickup ? <p>Ambulance to pickup: ~{routeMeta.toPickup.distanceKm} km</p> : null}
            {routeMeta.toHospital ? <p>Pickup to hospital: ~{routeMeta.toHospital.distanceKm} km</p> : null}
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <MapContainer center={mapCenter} zoom={patientPoint ? 13 : 5} className="h-[380px] rounded-xl border border-slate-200">
            <TileLayer attribution={tileAttribution} url={tileUrl} />

            {patientPoint ? (
              <CircleMarker
                center={[patientPoint.lat, patientPoint.lng]}
                radius={8}
                pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.9 }}
              >
                <Popup>📍 Pickup: {patientPoint.label}</Popup>
              </CircleMarker>
            ) : null}

            {nearestHospital ? (
              <CircleMarker
                center={[nearestHospital.lat, nearestHospital.lng]}
                radius={8}
                pathOptions={{ color: '#065f46', fillColor: '#34d399', fillOpacity: 0.9 }}
              >
                <Popup>🏥 {nearestHospital.name}</Popup>
              </CircleMarker>
            ) : null}

            {routeToPickup.length ? (
              <Polyline
                positions={routeToPickup.map((point) => [point.lat, point.lng])}
                pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }}
              />
            ) : null}

            {routeToHospital.length ? (
              <Polyline
                positions={routeToHospital.map((point) => [point.lat, point.lng])}
                pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85 }}
              />
            ) : null}

            {ambulancePoint ? (
              <Marker position={[ambulancePoint.lat, ambulancePoint.lng]} icon={ambulanceIcon}>
                <Popup>🚑 Ambulance (Live Simulation)</Popup>
              </Marker>
            ) : null}

            <FitToRoute
              routePoints={combinedRoutePoints}
              hospitalPoint={nearestHospital}
              patientPoint={patientPoint}
              ambulancePoint={ambulancePoint}
            />
          </MapContainer>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {requested ? (
            <>
              <p className="text-sm font-medium text-slate-700">{statusText || 'Dispatch in progress...'}</p>
              {isTraveling ? (
                <>
                  <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Tracking progress: {progressPercent}%</p>
                  {etaMins !== null ? (
                    <p className="mt-1 text-xs text-slate-500">Estimated arrival: ~{etaMins} min</p>
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-slate-600">Enter your pickup location and tap Request Ambulance to start live tracking.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AmbulanceRequestPage;