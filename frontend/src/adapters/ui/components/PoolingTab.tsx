import React, { useState } from 'react';
import { usePoolingTab } from '../../../core/application/usePoolingTab';

export function PoolingTab() {
  const { pools, loading, error, successMsg, poolPreview, verifyPool, createPool } = usePoolingTab();
  const [year, setYear] = useState('');
  const [members, setMembers] = useState('');

  const handleVerify = () => {
    if (year && members) {
      const shipIds = members.split(',').map(s => s.trim()).filter(Boolean);
      verifyPool(parseInt(year), shipIds);
    }
  };

  const handleCreate = () => {
    if (year && members && poolPreview?.isValid) {
      const shipIds = members.split(',').map(s => s.trim()).filter(Boolean);
      createPool(parseInt(year), shipIds);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-2xl shadow-lg border border-blue-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2 relative z-10">Pooling Simulator</h2>
        <p className="text-blue-200 mb-6 max-w-2xl relative z-10 text-sm leading-relaxed">
          Create a pool to offset deficits. The system will ensure that the sum of the adjusted Compliance Balances is positive, and enforce that no deficit ship exits worse, while no surplus ship exits negative.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Compliance Year</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-blue-950/50 border border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white placeholder-blue-700"
              value={year} onChange={e => setYear(e.target.value)}
            />
          </div>
          <div className="flex-[2]">
            <label className="block text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Member Ships (Comma Separated)</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-blue-950/50 border border-blue-700/50 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-white placeholder-blue-700"
              value={members} onChange={e => setMembers(e.target.value)}
              placeholder="e.g. R001, R002, R003"
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            Verify Members
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !poolPreview?.isValid}
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-blue-900 font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Simulating...' : 'Create Pool'}
          </button>
        </div>

        {poolPreview && !error && (
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 relative z-10">
            <div>
              <span className="block text-xs uppercase tracking-wider text-blue-300 font-semibold mb-1">Projected Pool Sum</span>
              <span className={`text-2xl font-bold ${poolPreview.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {poolPreview.sum > 0 ? '+' : ''}{poolPreview.sum.toLocaleString()} gCO₂e
              </span>
            </div>
            <div>
              {poolPreview.isValid ? (
                <span className="flex items-center gap-2 text-emerald-400 text-sm font-medium">Valid Pool ✓</span>
              ) : (
                <span className="flex items-center gap-2 text-rose-400 text-sm font-medium">Invalid Sum ✗</span>
              )}
            </div>
          </div>
        )}

        {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-sm relative z-10">{error}</div>}
        {successMsg && <div className="mt-4 p-3 bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 rounded-lg text-sm relative z-10">{successMsg}</div>}
      </div>

      {pools.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 px-1">Active Pools</h3>
          {pools.map((pool, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="font-mono text-sm font-semibold text-slate-700">Pool ID: {pool.id.substring(0, 8)}...</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">Year: {pool.year}</span>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-100">Ship ID</th>
                    <th className="px-6 py-3 border-b border-slate-100 text-right">CB Before (gCO₂e)</th>
                    <th className="px-6 py-3 border-b border-slate-100 text-right">CB After (gCO₂e)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pool.members?.map((m, j) => (
                    <tr key={j} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-semibold text-slate-700">{m.shipId}</td>
                      <td className={`px-6 py-3 text-right font-medium ${m.cbBefore > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {m.cbBefore.toLocaleString()}
                      </td>
                      <td className={`px-6 py-3 text-right font-bold text-slate-900`}>
                        {m.cbAfter.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
