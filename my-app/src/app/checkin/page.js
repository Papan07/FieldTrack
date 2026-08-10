"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { isInsideGeofence } from "@/lib/geofence";

const STEPS = { FORM: "form", LOCATING: "locating", VALIDATING: "validating", SUCCESS: "success", REJECTED: "rejected" };

export default function CheckinPage() {
  const [step, setStep] = useState(STEPS.FORM);
  const [sites, setSites] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedTrainee, setSelectedTrainee] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/sites").then(r => r.json()), fetch("/api/trainees").then(r => r.json())])
      .then(([s, t]) => { setSites(Array.isArray(s) ? s : []); setTrainees(Array.isArray(t) ? t : []); })
      .catch(() => setError("Failed to load site or trainee data from database."))
      .finally(() => setLoadingData(false));
  }, []);

  const handleCheckin = async () => {
    if (!selectedSite || !selectedTrainee) { setError("Please select both a site and your name to proceed."); return; }
    setError("");
    setStep(STEPS.LOCATING);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setStep(STEPS.VALIDATING);
        const { latitude, longitude, accuracy } = pos.coords;
        const site = sites.find(s => s.id === selectedSite);
        const trainee = trainees.find(t => t.id === selectedTrainee);
        const { inside, distance } = isInsideGeofence(latitude, longitude, site);
        const status = inside ? "present" : "rejected";

        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            traineeId: trainee.id,
            traineeName: trainee.name,
            traineeBatch: trainee.batch || "",
            siteId: site.id,
            siteName: site.name,
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            distanceMeters: distance,
            status
          }),
        });

        setResult({ inside, distance, accuracy: Math.round(accuracy), site, trainee, status });
        setStep(inside ? STEPS.SUCCESS : STEPS.REJECTED);
      },
      (err) => {
        setError(err.code === 1 ? "GPS location permission denied. Enable browser location access." : "Unable to acquire GPS coordinates.");
        setStep(STEPS.FORM);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const reset = () => { setStep(STEPS.FORM); setResult(null); setError(""); };

  return (
    <div className="h-screen w-full flex flex-col bg-emerald-50/40 overflow-hidden">
      {/* Header */}
      <header className="app-header flex-none px-8 py-4">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-emerald-950" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Field<span className="text-emerald-600">Track</span>
            </span>
          </Link>
          <Link href="/admin" className="text-emerald-800 hover:text-emerald-600 font-semibold text-sm transition-colors">
            Admin Portal &rarr;
          </Link>
        </div>
      </header>

      {/* Main Fullscreen Check-In View */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/40 to-green-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-emerald-950 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Trainee Check-In
            </h1>
            <p className="text-emerald-800/70 text-sm">
              GPS location will be verified against venue limits.
            </p>
          </div>

          <div className="ui-card p-8 shadow-2xl bg-white/95 backdrop-blur-md border-emerald-100">
            {step === STEPS.FORM && (
              <div className="flex flex-col gap-5">
                {loadingData ? (
                  <div className="flex items-center justify-center py-10 gap-3 text-emerald-700 text-sm">
                    <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Loading active venues & trainees...
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Select Venue</label>
                      <select
                        className="w-full p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                        value={selectedSite}
                        onChange={e => setSelectedSite(e.target.value)}
                      >
                        <option value="">-- Choose active venue --</option>
                        {sites.map(s => (
                          <option key={s.id} value={s.id}>{s.name} (Radius: {s.radiusMeters}m)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Select Officer</label>
                      <select
                        className="w-full p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                        value={selectedTrainee}
                        onChange={e => setSelectedTrainee(e.target.value)}
                      >
                        <option value="">-- Choose your name --</option>
                        {trainees.map(t => (
                          <option key={t.id} value={t.id}>{t.name} {t.batch ? `(${t.batch})` : ""}</option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                        <span>⚠️</span> {error}
                      </div>
                    )}

                    <button
                      onClick={handleCheckin}
                      disabled={loadingData || sites.length === 0}
                      className="ui-button-primary w-full py-4 text-base mt-2 flex items-center justify-center gap-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      Verify GPS & Check In
                    </button>
                  </>
                )}
              </div>
            )}

            {step === STEPS.LOCATING && (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center animate-bounce">
                  <span className="text-2xl">📡</span>
                </div>
                <h3 className="font-bold text-emerald-950 text-lg">Acquiring GPS Signal</h3>
                <p className="text-emerald-700 text-xs">Allow location permission in browser.</p>
              </div>
            )}

            {step === STEPS.VALIDATING && (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin flex items-center justify-center" />
                <h3 className="font-bold text-emerald-950 text-lg">Validating Boundary</h3>
                <p className="text-emerald-700 text-xs">Calculating Haversine distance...</p>
              </div>
            )}

            {step === STEPS.SUCCESS && result && (
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-extrabold shadow-inner">
                  ✓
                </div>
                <div>
                  <h2 className="text-2xl font-black text-emerald-950 mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Attendance Verified!
                  </h2>
                  <p className="text-emerald-700 text-xs">Recorded for <span className="font-bold text-emerald-900">{result.site.name}</span></p>
                </div>
                <div className="w-full bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs flex flex-col gap-2">
                  <div className="flex justify-between text-emerald-800"><span>Officer:</span><strong className="text-emerald-950">{result.trainee.name}</strong></div>
                  <div className="flex justify-between text-emerald-800"><span>Distance:</span><strong className="text-emerald-950">{result.distance}m from center</strong></div>
                  <div className="flex justify-between text-emerald-800"><span>Status:</span><span className="text-emerald-600 font-bold">PRESENT</span></div>
                </div>
                <button onClick={reset} className="ui-button-secondary w-full text-xs border-emerald-200">Done / Check In Another</button>
              </div>
            )}

            {step === STEPS.REJECTED && result && (
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl font-extrabold shadow-inner">
                  ✕
                </div>
                <div>
                  <h2 className="text-2xl font-black text-rose-600 mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Check-In Rejected
                  </h2>
                  <p className="text-emerald-700 text-xs">Outside the geofence perimeter.</p>
                </div>
                <div className="w-full bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-xs flex flex-col gap-2">
                  <div className="flex justify-between text-emerald-800"><span>Officer:</span><strong className="text-emerald-950">{result.trainee.name}</strong></div>
                  <div className="flex justify-between text-emerald-800"><span>Distance:</span><strong className="text-rose-600 font-bold">{result.distance}m from center</strong></div>
                </div>
                <button onClick={reset} className="ui-button-primary w-full text-xs">Try Check-In Again</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
