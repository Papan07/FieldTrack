"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatTime } from "@/lib/geofence";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-emerald-50/50 rounded-2xl border border-emerald-100">
      <div className="flex flex-col items-center gap-3 text-emerald-700 text-sm">
        <svg className="animate-spin h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Loading map layer...</span>
      </div>
    </div>
  ),
});

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [sites, setSites] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterSite, setFilterSite] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, present: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState("map");
  const [loading, setLoading] = useState(true);
  const [sseConnected, setSseConnected] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const authSession = sessionStorage.getItem("ap_forest_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim().toLowerCase() === "apgov@forest.com" && passwordInput === "Apforest") {
      sessionStorage.setItem("ap_forest_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Government Admin Credentials. Check Email and Password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ap_forest_admin_auth");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/sites").then(r => r.json()).then(d => setSites(Array.isArray(d) ? d : []));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/attendance").then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setAttendance(d);
        setStats({
          total: d.length,
          present: d.filter(r => r.status === "present").length,
          rejected: d.filter(r => r.status === "rejected").length,
        });
      }
      setLoading(false);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const es = new EventSource("/api/attendance/stream");
    es.onopen = () => setSseConnected(true);
    es.onerror = () => setSseConnected(false);

    es.onmessage = (e) => {
      try {
        const rec = JSON.parse(e.data);
        setAttendance(prev => {
          if (prev.some(r => r.id === rec.id)) return prev;
          const updated = [rec, ...prev];
          setStats({
            total: updated.length,
            present: updated.filter(r => r.status === "present").length,
            rejected: updated.filter(r => r.status === "rejected").length,
          });
          return updated;
        });
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    return () => es.close();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let list = [...attendance];
    if (filterSite !== "all") list = list.filter(r => r.siteId === filterSite);
    if (filterStatus !== "all") list = list.filter(r => r.status === filterStatus);
    setFiltered(list);
  }, [attendance, filterSite, filterStatus, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex flex-col bg-white items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Forest Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ap-forest-hero.png"
            alt="AP Forest Station Background"
            fill
            className="object-cover opacity-20 filter blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
        </div>

        {/* Login Modal Card */}
        <div className="max-w-md w-full bg-white/95 border border-emerald-100 rounded-3xl p-8 shadow-2xl backdrop-blur-md z-10">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-emerald-600/30 mb-3">
              🏛️
            </div>
            <h1 className="text-2xl font-black text-emerald-950 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              AP Forest Department HQ
            </h1>
            <p className="text-emerald-700 text-xs mt-1">
              Restricted Portal Access for Divisional Forest Officers
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                Official Email
              </label>
              <input
                type="email"
                required
                placeholder="apgov@forest.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 placeholder-emerald-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                Access Code / Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-emerald-950 placeholder-emerald-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold text-center">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              className="ui-button-primary w-full py-4 text-sm mt-2 font-extrabold shadow-lg shadow-emerald-600/20"
            >
              Authenticate & Enter HQ &rarr;
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-emerald-100 text-center">
            <Link href="/" className="text-emerald-700 hover:text-emerald-900 text-xs font-bold no-underline">
              ← Return to AP Forest Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-emerald-50/40 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="app-header flex-none px-6 py-3 border-b border-emerald-100 bg-white">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div className="font-extrabold text-lg text-emerald-950 leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Field<span className="text-emerald-600">Track</span> Range HQ
                </div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  AP Forest Department Portal
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
              <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              {sseConnected ? 'Real-Time Stream Active' : 'Connecting Stream...'}
            </div>
            <Link href="/admin/sites" className="ui-button-secondary text-xs py-2 px-3.5 no-underline border-emerald-200">
              Manage Sites
            </Link>
            <Link href="/admin/trainees" className="ui-button-primary text-xs py-2 px-3.5 no-underline">
              Manage Officers
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Fullscreen Workspace */}
      <main className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
        {/* Top Metric Cards Bar */}
        <div className="flex-none flex flex-wrap items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            {/* Total Card */}
            <div className="bg-white p-3.5 px-5 rounded-2xl border border-emerald-100/80 shadow-md shadow-emerald-900/5 flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div>
                <span className="block text-[11px] font-bold text-emerald-800/60 uppercase tracking-wider mb-0.5">Total Check-Ins</span>
                <span className="text-3xl font-black text-emerald-950 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{stats.total}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/80 border border-emerald-200/50 flex items-center justify-center text-emerald-700 text-lg shadow-inner group-hover:scale-105 transition-transform">
                📊
              </div>
            </div>

            {/* Present Card */}
            <div className="bg-white p-3.5 px-5 rounded-2xl border border-emerald-100/80 shadow-md shadow-emerald-900/5 flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div>
                <span className="block text-[11px] font-bold text-emerald-600/80 uppercase tracking-wider mb-0.5">Present</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{stats.present}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                ✓
              </div>
            </div>

            {/* Rejected Card */}
            <div className="bg-white p-3.5 px-5 rounded-2xl border border-rose-100/80 shadow-md shadow-rose-900/5 flex items-center justify-between group hover:border-rose-200 transition-all">
              <div>
                <span className="block text-[11px] font-bold text-rose-600/80 uppercase tracking-wider mb-0.5">Rejected</span>
                <span className="text-3xl font-black text-rose-600 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{stats.rejected}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                ✕
              </div>
            </div>

            {/* Active Sites Card */}
            <div className="bg-white p-3.5 px-5 rounded-2xl border border-teal-100/80 shadow-md shadow-teal-900/5 flex items-center justify-between group hover:border-teal-200 transition-all">
              <div>
                <span className="block text-[11px] font-bold text-teal-700/80 uppercase tracking-wider mb-0.5">Active Venues</span>
                <span className="text-3xl font-black text-teal-600 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{sites.length}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/80 border border-teal-200/50 flex items-center justify-center text-teal-700 text-lg shadow-inner group-hover:scale-105 transition-transform">
                📍
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-emerald-100 shadow-sm">
              <button
                onClick={() => setActiveTab("map")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "map" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-emerald-800/70 hover:text-emerald-950"
                  }`}
              >
                🗺️ Fullscreen Map
              </button>
              <button
                onClick={() => setActiveTab("records")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "records" ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-emerald-800/70 hover:text-emerald-950"
                  }`}
              >
                📋 Attendance Logs ({filtered.length})
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Fullscreen Tab Content */}
        {activeTab === "map" && (
          <div className="flex-1 w-full h-full min-h-0 rounded-2xl overflow-hidden shadow-lg border border-emerald-100 relative">
            <LiveMap sites={sites} attendance={attendance} />
          </div>
        )}

        {activeTab === "records" && (
          <div className="flex-1 bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 flex flex-col overflow-hidden">
            {/* Table Filters */}
            <div className="flex-none flex items-center justify-between gap-4 mb-3 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-950">Filter Attendance:</span>
                <select
                  className="p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={filterSite}
                  onChange={e => setFilterSite(e.target.value)}
                >
                  <option value="all">All Training Sites</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <select
                  className="p-2 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Verification Statuses</option>
                  <option value="present">Present (In Boundary)</option>
                  <option value="rejected">Rejected (Out of Boundary)</option>
                </select>
              </div>
            </div>

            {/* Scrollable Table Area */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="text-center py-12 text-emerald-700 text-sm">Loading attendance logs...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-emerald-700 text-sm">No matching attendance logs found.</div>
              ) : (
                <table className="data-table">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th>#</th>
                      <th>Trainee Officer</th>
                      <th>Batch</th>
                      <th>Site Venue</th>
                      <th>Distance</th>
                      <th>Accuracy</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((rec, i) => (
                      <tr key={rec.id}>
                        <td className="text-emerald-400 font-mono text-xs">{i + 1}</td>
                        <td className="font-bold text-emerald-950">{rec.traineeName}</td>
                        <td className="text-emerald-800/80">{rec.traineeBatch || "—"}</td>
                        <td className="text-emerald-900 font-medium">{rec.siteName}</td>
                        <td className="text-emerald-800">{rec.distanceMeters}m</td>
                        <td className="text-emerald-600 text-xs">±{rec.accuracy}m</td>
                        <td className="text-emerald-600 text-xs">{formatTime(rec.timestamp)}</td>
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${rec.status === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-700"
                            }`}>
                            {rec.status === "present" ? "✓ PRESENT" : "✕ REJECTED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
