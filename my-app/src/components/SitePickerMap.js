"use client";
import { useEffect, useRef } from "react";

/**
 * Interactive map for picking a site's centre location.
 * Click anywhere on the map to drop a pin and update coordinates.
 */
export default function SitePickerMap({ onLocationPick, pickedCoords, radius = 100 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    // Inject Leaflet CSS dynamically to avoid PostCSS conflict
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Guard against React StrictMode double-invoke
      if (mapRef.current._leaflet_id) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
      });

      // 🗺️ OpenStreetMap standard tiles (vibrant, colorful)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e) => {
        onLocationPick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker + circle when picked coords or radius change
  useEffect(() => {
    if (!mapInstanceRef.current || !pickedCoords || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;

      if (markerRef.current) markerRef.current.remove();
      if (circleRef.current) circleRef.current.remove();

      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:28px;height:28px;border-radius:50%;
          background:linear-gradient(135deg,#63d2c4,#4f8ef7);
          border:2px solid rgba(255,255,255,0.3);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 16px rgba(99,210,196,0.5);
          font-size:13px;
        ">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      markerRef.current = L.marker([pickedCoords.lat, pickedCoords.lng], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`<span style="font-family:monospace;font-size:12px;color:#63d2c4">
          ${pickedCoords.lat.toFixed(6)}, ${pickedCoords.lng.toFixed(6)}
        </span>`)
        .openPopup();

      circleRef.current = L.circle([pickedCoords.lat, pickedCoords.lng], {
        radius,
        color: "#63d2c4",
        fillColor: "#63d2c4",
        fillOpacity: 0.08,
        weight: 2,
        dashArray: "5 4",
      }).addTo(map);

      map.setView([pickedCoords.lat, pickedCoords.lng], Math.max(map.getZoom(), 15));
    });
  }, [pickedCoords, radius]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "crosshair",
      }}
    />
  );
}
