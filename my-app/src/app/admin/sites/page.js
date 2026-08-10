"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SitePickerMap = dynamic(() => import("@/components/SitePickerMap"), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-emerald-50/50 rounded-xl flex items-center justify-center text-emerald-700 text-xs">Loading map picker...</div>,
});

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [pickedCoords, setPickedCoords] = useState(null);
  const [form, setForm] = useState({ name: "", latitude: "", longitude: "", radiusMeters: "100", description: "" });
  const [formError, setFormError] = useState("");

  const fetchSites = () => {
    fetch("/api/sites")
      .then((r) => r.json())
      .then((data) => { setSites(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchSites(); }, []);

  useEffect(() => {
    if (pickedCoords) {
      setForm((f) => ({ ...f, latitude: pickedCoords.lat.toFixed(6), longitude: pickedCoords.lng.toFixed(6) }));
    }
  }, [pickedCoords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const lat = parseFloat(form.latitude);
    const lon = parseFloat(form.longitude);
    const radius = parseInt(form.radiusMeters);

    if (!form.name.trim()) return setFormError("Site name is required.");
    if (isNaN(lat) || lat < -90 || lat > 90) return setFormError("Enter a valid latitude.");
    if (isNaN(lon) || lon < -180 || lon > 180) return setFormError("Enter a valid longitude.");

    setSaving(true);
    const res = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name.trim(), description: form.description.trim(), latitude: lat, longitude: lon, radiusMeters: radius }),
    });

    if (res.ok) {
      setForm({ name: "", latitude: "", longitude: "", radiusMeters: "100", description: "" });
      setPickedCoords(null);
      setShowForm(false);
      fetchSites();
    } else {
      const err = await res.json();
      setFormError(err.error || "Failed to save site.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/sites/${id}`, { method: "DELETE" });
    fetchSites();
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-emerald-50/40 overflow-hidden">
      <header className="app-header flex-none px-6 py-3 border-b border-emerald-100">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-emerald-950" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Field<span className="text-emerald-600">Track</span> Sites
            </span>
          </Link>
          <Link href="/admin" className="text-emerald-800 hover:text-emerald-600 font-semibold text-xs transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex-none flex items-center justify-between bg-white p-3 rounded-2xl border border-emerald-100 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-emerald-950 leading-none">Geofence Site Settings</h1>
            <p className="text-emerald-700 text-xs mt-1">Configure active training boundaries & radii</p>
          </div>
          <button className="ui-button-primary text-xs py-2 px-3.5" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add New Site"}
          </button>
        </div>

        {showForm && (
          <div className="flex-none ui-card p-4 border-emerald-100 overflow-y-auto max-h-[60vh]">
            <h2 className="text-base font-bold text-emerald-950 mb-2">Create Geofence Boundary</h2>
            <div className="mb-3">
              <p className="text-[11px] text-emerald-700 mb-1">Click map to set center latitude & longitude:</p>
              <SitePickerMap onLocationPick={setPickedCoords} pickedCoords={pickedCoords} radius={parseInt(form.radiusMeters) || 100} />
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-emerald-900 mb-1">Site Venue Name *</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="e.g. Headquarters Ground Alpha" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Latitude *</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="20.593684" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Longitude *</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="78.962880" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Radius (meters) *</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" type="number" value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Description</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="Optional details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              {formError && <div className="md:col-span-2 text-rose-600 font-semibold">{formError}</div>}

              <div className="md:col-span-2 flex gap-3 mt-1">
                <button type="submit" className="ui-button-primary text-xs py-2 px-4" disabled={saving}>
                  {saving ? "Saving..." : "Save Geofence Site"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-1 ui-card p-4 border-emerald-100 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-emerald-700 text-xs">Loading active sites...</div>
          ) : sites.length === 0 ? (
            <div className="text-center py-8 text-emerald-700 text-xs">No sites created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sites.map((site) => (
                <div key={site.id} className="ui-card-hover p-4 flex flex-col justify-between border-emerald-100">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-emerald-950 mb-1">{site.name}</h3>
                      <button onClick={() => handleDelete(site.id)} className="text-[10px] text-rose-600 hover:text-rose-800 font-bold px-2 py-0.5 bg-rose-50 rounded">
                        Delete
                      </button>
                    </div>
                    {site.description && <p className="text-emerald-800/70 text-xs mb-2">{site.description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-emerald-800 pt-2 border-t border-emerald-100">
                    <span className="bg-emerald-100/60 px-2 py-0.5 rounded">Radius: {site.radiusMeters}m</span>
                    <span className="bg-emerald-100/60 px-2 py-0.5 rounded">Lat: {site.latitude?.toFixed(4)}</span>
                    <span className="bg-emerald-100/60 px-2 py-0.5 rounded">Lng: {site.longitude?.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
