"use client";
import { useEffect, useRef } from "react";

export default function LiveMap({ sites = [], attendanceRecords = [], onSiteClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const circlesRef = useRef({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Inject Leaflet CSS dynamically
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        attributionControl: true,
      });

      // 🗺️ OpenStreetMap standard tiles (vibrant, high-contrast, colorful map)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update site geofence circles
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      Object.values(circlesRef.current).forEach((c) => {
        if (c.circle) c.circle.remove();
        if (c.marker) c.marker.remove();
      });
      circlesRef.current = {};

      const siteColors = [
        { main: "#6366f1", bg: "linear-gradient(135deg, #6366f1, #4f46e5)" },
        { main: "#06b6d4", bg: "linear-gradient(135deg, #06b6d4, #0891b2)" },
        { main: "#ec4899", bg: "linear-gradient(135deg, #ec4899, #db2777)" },
        { main: "#8b5cf6", bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
        { main: "#f59e0b", bg: "linear-gradient(135deg, #f59e0b, #d97706)" },
      ];

      sites.forEach((site, idx) => {
        const colorTheme = siteColors[idx % siteColors.length];

        // Geofence ring
        const circle = L.circle([site.latitude, site.longitude], {
          radius: site.radiusMeters,
          color: colorTheme.main,
          fillColor: colorTheme.main,
          fillOpacity: 0.15,
          weight: 3,
          dashArray: "6 4",
        }).addTo(map);

        // Custom colorful site pin
        const siteIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:42px;height:42px;border-radius:50%;
            background:${colorTheme.bg};
            border:3px solid #ffffff;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 6px 16px rgba(0,0,0,0.3);
            font-size:18px;
            cursor:pointer;
          ">📍</div>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

        const marker = L.marker([site.latitude, site.longitude], { icon: siteIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px;padding:2px">
              <p style="font-weight:700;font-size:15px;color:${colorTheme.main};margin:0 0 6px">${site.name}</p>
              <p style="font-size:12px;color:#4b5563;margin:3px 0">📏 Radius: <strong style="color:#111827">${site.radiusMeters} m</strong></p>
              <p style="font-size:11px;color:#9ca3af;margin:3px 0;font-family:monospace">${site.latitude.toFixed(5)}, ${site.longitude.toFixed(5)}</p>
            </div>
          `);

        if (onSiteClick) marker.on("click", () => onSiteClick(site));
        circlesRef.current[site.id] = { circle, marker };
      });

      if (sites.length > 0) {
        const bounds = L.latLngBounds(sites.map((s) => [s.latitude, s.longitude]));
        map.fitBounds(bounds.pad(0.4), { maxZoom: 14 });
      }
    });
  }, [sites]);

  // Update check-in markers
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return;
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      attendanceRecords.forEach((rec) => {
        if (!rec.latitude || !rec.longitude) return;
        const isPresent = rec.status === "present";
        const color = isPresent ? "#10b981" : "#ef4444";
        const bg = isPresent ? "#10b981" : "#ef4444";
        const emoji = isPresent ? "✓" : "✗";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:32px;height:32px;border-radius:50%;
            background:${bg};
            border:2.5px solid #ffffff;
            display:flex;align-items:center;justify-content:center;
            font-size:14px;font-weight:900;color:#ffffff;
            box-shadow:0 4px 12px ${color}60;
          ">${emoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const ts = rec.timestamp
          ? new Date(rec.timestamp).toLocaleString("en-IN", {
            hour12: true,
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
          : "—";

        const marker = L.marker([rec.latitude, rec.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif;min-width:180px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${color}"></span>
                <strong style="font-size:13px;color:${color}">${isPresent ? "Present" : "Rejected"}</strong>
              </div>
              <p style="font-weight:700;font-size:14px;color:#111827;margin:0 0 3px">${rec.traineeName || "Unknown"}</p>
              <p style="font-size:12px;color:#4b5563;margin:2px 0">📍 ${rec.siteName || ""}</p>
              <p style="font-size:11px;color:#6b7280;margin:3px 0">🕐 ${ts}</p>
              <p style="font-size:11px;color:#9ca3af;margin:2px 0">📡 ±${rec.accuracy || "?"} m GPS</p>
            </div>
          `);

        markersRef.current[rec.id] = marker;
      });
    });
  }, [attendanceRecords]);

  return (
    <div
      ref={mapRef}
      id="live-map"
      style={{ width: "100%", height: "100%", minHeight: 420, borderRadius: 14, overflow: "hidden" }}
    />
  );
}
