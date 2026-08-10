"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TraineesPage() {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", batch: "", traineeId: "", role: "" });
  const [formError, setFormError] = useState("");

  const fetchTrainees = () => {
    fetch("/api/trainees")
      .then((r) => r.json())
      .then((data) => { setTrainees(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchTrainees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("Trainee name is required.");

    setSaving(true);
    const res = await fetch("/api/trainees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", batch: "", traineeId: "", role: "" });
      setShowForm(false);
      fetchTrainees();
    } else {
      const err = await res.json();
      setFormError(err.error || "Failed to save trainee.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/trainees/${id}`, { method: "DELETE" });
    fetchTrainees();
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
              Field<span className="text-emerald-600">Track</span> Directory
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
            <h1 className="text-lg font-bold text-emerald-950 leading-none">Trainee Officers Directory</h1>
            <p className="text-emerald-700 text-xs mt-1">Manage registered officers allowed to check in</p>
          </div>
          <button className="ui-button-primary text-xs py-2 px-3.5" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Register Trainee"}
          </button>
        </div>

        {showForm && (
          <div className="flex-none ui-card p-4 border-emerald-100">
            <h2 className="text-sm font-bold text-emerald-950 mb-3">Register Trainee Officer</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Full Name *</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="Officer Vikram Singh" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Batch / Cohort</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="Batch 2024-B" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Official ID</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="TRN-9021" value={form.traineeId} onChange={(e) => setForm({ ...form, traineeId: e.target.value })} />
              </div>
              <div>
                <label className="block font-semibold text-emerald-900 mb-1">Designation</label>
                <input className="input-field py-2 text-xs bg-emerald-50/50 border-emerald-200" placeholder="Cadet Officer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>

              {formError && <div className="md:col-span-2 text-rose-600 font-semibold">{formError}</div>}

              <div className="md:col-span-2 flex gap-3 mt-1">
                <button type="submit" className="ui-button-primary text-xs py-2 px-4" disabled={saving}>
                  {saving ? "Saving..." : "Save Officer"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex-1 ui-card p-4 border-emerald-100 overflow-auto">
          {loading ? (
            <div className="text-center py-8 text-emerald-700 text-xs">Loading registered officers...</div>
          ) : trainees.length === 0 ? (
            <div className="text-center py-8 text-emerald-700 text-xs">No trainees registered yet.</div>
          ) : (
            <table className="data-table">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Batch / Cohort</th>
                  <th>Official ID</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trainees.map((t, i) => (
                  <tr key={t.id}>
                    <td className="text-emerald-400 font-mono text-xs">{i + 1}</td>
                    <td className="font-bold text-emerald-950">{t.name}</td>
                    <td className="text-emerald-800/80">{t.batch || "—"}</td>
                    <td className="text-emerald-600 font-mono text-xs">{t.traineeId || "—"}</td>
                    <td className="text-emerald-800/80">{t.role || "—"}</td>
                    <td>
                      <button onClick={() => handleDelete(t.id)} className="text-xs text-rose-600 hover:text-rose-800 font-semibold">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
