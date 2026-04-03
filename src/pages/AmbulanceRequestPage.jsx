import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';

const POTHERI_SRM_DESTINATION = {
  lat: 12.8230,
  lng: 80.0444,
  label: 'Potheri, SRM University, Chennai 603203',
};

const hospitalCoordinates = {
  'hosp-1': { lat: 12.9137, lng: 80.1260 },
  'hosp-2': { lat: 12.7963, lng: 80.2206 },
  'hosp-3': { lat: 12.6928, lng: 79.9771 },
};

function computeDistance(a, b) {
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

const ambulanceIcon = L.divIcon({
  html: '<div style="font-size: 22px;">🚑</div>',
  className: 'ambulance-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function FitToRoute({ routePoints, hospitalPoint, patientPoint }) {
  const map = useMap();

  useEffect(() => {
    if (!hospitalPoint || !patientPoint) return;

    let bounds;
    if (routePoints.length) {
      bounds = L.latLngBounds(routePoints.map((point) => [point.lat, point.lng]));
    } else {
      bounds = L.latLngBounds(
        [hospitalPoint.lat, hospitalPoint.lng],
        [patientPoint.lat, patientPoint.lng]
      );
    }

    map.fitBounds(bounds.pad(0.35));
  }, [map, routePoints, hospitalPoint, patientPoint]);

  return null;
}

function AmbulanceRequestPage() {
  const { hospitals } = useApp();
  const [address, setAddress] = useState('');
  const [requested, setRequested] = useState(false);
  const [patientPoint, setPatientPoint] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [etaMins, setEtaMins] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [routePoints, setRoutePoints] = useState([]);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [routeIndex, setRouteIndex] = useState(0);

  const nearestHospitalPoint = nearestHospital ? hospitalCoordinates[nearestHospital.id] : null;

  const ambulancePoint = useMemo(() => {
    if (routePoints.length) {
      return routePoints[Math.min(routeIndex, routePoints.length - 1)] || null;
    }
    if (!nearestHospitalPoint || !patientPoint) return null;
    return interpolate(nearestHospitalPoint, patientPoint, progress);
  }, [routePoints, routeIndex, nearestHospitalPoint, patientPoint, progress]);

  useEffect(() => {
    if (!requested || !routePoints.length) return undefined;

    const timer = setInterval(() => {
      setRouteIndex((prev) => {
        const total = routePoints.length - 1;
        if (total <= 0) return prev;

        const pointsPerTick = Math.max(1, Math.ceil(routePoints.length / 120));
        const nextIndex = Math.min(prev + pointsPerTick, total);
        const nextProgress = nextIndex / total;
        const mins = Math.max(1, Math.ceil((1 - nextProgress) * (etaMins || 1)));

        setProgress(nextProgress);

        if (nextProgress >= 1) {
          setStatusText('Ambulance has arrived at Potheri SRM University. Please stay reachable by phone.');
        } else if (nextProgress > 0.7) {
          setStatusText(`Ambulance is nearby. Estimated arrival in ~${mins} min.`);
        } else if (nextProgress > 0.35) {
          setStatusText(`Ambulance is following the road route. ETA ~${mins} min.`);
        } else {
          setStatusText(`Dispatch confirmed from ${nearestHospital?.name}. ETA ~${mins} min.`);
        }

        return nextIndex;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [requested, routePoints, etaMins, nearestHospital?.name]);

  const handleRequestAmbulance = async () => {
    const normalizedAddress = address.trim();
    if (!normalizedAddress) return;

    setAddressError('Destination is fixed for simulation: Potheri, SRM University, Chennai 603203.');
    setIsResolvingAddress(true);

    const point = POTHERI_SRM_DESTINATION;

    const ranked = hospitals
      .map((hospital) => {
        const coord = hospitalCoordinates[hospital.id] || { lat: 12.9, lng: 80.12 };
        return {
          hospital,
          distance: computeDistance(coord, point),
        };
      })
      .sort((a, b) => a.distance - b.distance);

    const nearest = ranked[0];
    const startPoint = hospitalCoordinates[nearest.hospital.id] || { lat: 12.9, lng: 80.12 };

    let nextRoutePoints = [startPoint, point];
    let simulatedEta = Math.max(4, Math.min(25, Math.round(nearest.distance / 1.2 + 3)));
    let simulatedDistance = Number(nearest.distance.toFixed(1));

    try {
      const route = await fetchRoadRoute(startPoint, point);
      nextRoutePoints = route.points;
      simulatedEta = route.durationMinutes;
      simulatedDistance = route.distanceKm;
    } catch {
      // keep fallback straight-line simulation
    }

    setIsResolvingAddress(false);

    setPatientPoint(point);
    setNearestHospital(nearest.hospital);
    setEtaMins(simulatedEta);
    setRouteDistanceKm(simulatedDistance);
    setRoutePoints(nextRoutePoints);
    setRouteIndex(0);
    setProgress(0);
    setRequested(true);
    setStatusText(`Dispatch confirmed from ${nearest.hospital.name}. Following road route to Potheri. ETA ~${simulatedEta} min.`);
  };

  const resetSimulation = () => {
    setRequested(false);
    setPatientPoint(null);
    setNearestHospital(null);
    setEtaMins(null);
    setRouteDistanceKm(null);
    setProgress(0);
    setRoutePoints([]);
    setRouteIndex(0);
    setStatusText('');
    setAddressError('');
  };

  return (
    <div className="page-shell space-y-4 pb-24">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">Emergency Support</p>
        <h2 className="mt-1 text-2xl font-bold">Request Ambulance</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter any location text to start simulation. Ambulance destination is fixed to Potheri, SRM University, Chennai 603203.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Pickup Address
          <textarea
            className="input mt-2 min-h-[92px]"
            placeholder="Enter any location text to start simulation"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
        {addressError ? <p className="mt-2 text-xs text-amber-700">{addressError}</p> : null}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={handleRequestAmbulance}
            disabled={!address.trim() || isResolvingAddress}
          >
            {isResolvingAddress ? 'Building Road Route...' : 'Request Ambulance'}
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
          {requested && nearestHospital && routeDistanceKm !== null ? (
            <p className="text-sm text-slate-600">Nearest Hospital: <span className="font-semibold text-med-700">{nearestHospital.name}</span></p>
          ) : null}
        </div>

        {requested && routeDistanceKm !== null ? (
          <p className="mt-2 text-xs text-slate-500">Route distance: ~{routeDistanceKm} km • Destination: {POTHERI_SRM_DESTINATION.label}</p>
        ) : null}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <MapContainer center={[12.88, 80.08]} zoom={11} className="h-[380px] rounded-xl border border-slate-200">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hospitals.map((hospital) => {
              const point = hospitalCoordinates[hospital.id] || { lat: 28.61, lng: 77.21 };
              return (
                <CircleMarker
                  key={hospital.id}
                  center={[point.lat, point.lng]}
                  radius={8}
                  pathOptions={{ color: '#0f766e', fillColor: '#14b8a6', fillOpacity: 0.9 }}
                >
                  <Popup>🏥 {hospital.name}</Popup>
                </CircleMarker>
              );
            })}

            {patientPoint ? (
              <CircleMarker
                center={[patientPoint.lat, patientPoint.lng]}
                radius={8}
                pathOptions={{ color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.9 }}
              >
                <Popup>📍 Destination: Potheri SRM University</Popup>
              </CircleMarker>
            ) : null}

            {routePoints.length ? (
              <Polyline
                positions={routePoints.map((point) => [point.lat, point.lng])}
                pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.8 }}
              />
            ) : null}

            {ambulancePoint ? (
              <Marker position={[ambulancePoint.lat, ambulancePoint.lng]} icon={ambulanceIcon}>
                <Popup>🚑 Ambulance (Live Simulation)</Popup>
              </Marker>
            ) : null}

            <FitToRoute routePoints={routePoints} hospitalPoint={nearestHospitalPoint} patientPoint={patientPoint} />
          </MapContainer>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {requested ? (
            <>
              <p className="text-sm font-medium text-slate-700">{statusText}</p>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Tracking progress: {Math.round(progress * 100)}%</p>
              <p className="mt-2 text-xs text-slate-500">
                Uber-style road tracking simulation: ambulance follows mapped roads toward Potheri destination.
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-600">Enter your address and tap Request Ambulance to start live tracking.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default AmbulanceRequestPage;