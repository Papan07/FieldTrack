/**
 * Haversine formula — calculates great-circle distance between two GPS coords.
 * Returns distance in meters.
 */
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Checks if a trainee's GPS coordinates are within a site's geofence.
 */
export function isInsideGeofence(traineeLat, traineeLon, site) {
  const distance = getDistanceMeters(
    traineeLat,
    traineeLon,
    site.latitude,
    site.longitude
  );
  return {
    inside: distance <= site.radiusMeters,
    distance: Math.round(distance),
  };
}

/**
 * Formats a date string or Date object to a readable local string.
 */
export function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns CSS classes for a status badge.
 */
export function statusColor(status) {
  switch (status) {
    case "present":
      return "text-emerald-400 bg-emerald-400/10 border border-emerald-400/30";
    case "rejected":
      return "text-red-400 bg-red-400/10 border border-red-400/30";
    default:
      return "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30";
  }
}
