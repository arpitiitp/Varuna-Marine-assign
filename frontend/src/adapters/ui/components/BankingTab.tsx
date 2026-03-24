import React, { useState } from 'react';
import { useBankingTab } from '../../../core/application/useBankingTab';

export function BankingTab() {
  const { cbRecord, adjustedCb, bankEntries, loading, error, loadShipData, bankSurplus, applyBanked } = useBankingTab();

  const [shipId, setShipId] = useState('');
  const [year, setYear] = useState('');
  const [applyAmount, setApplyAmount] = useState('');

  const handleLoad = () => {
    if (shipId && year) loadShipData(shipId, parseInt(year));
  };

  const handleApply = () => {
    if (shipId && year && applyAmount) {
      applyBanked(shipId, parseInt(year), parseFloat(applyAmount));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-4">Banking Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Route / Ship ID</label>
            <input
              type="text"
              aria-label="Route or Ship ID"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              value={shipId} onChange={e => setShipId(e.target.value)}
              placeholder="e.g. R001"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Compliance Year</label>
            <input
              type="number"
              aria-label="Compliance year"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              value={year} onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2024"
            />
          </div>
          <button
            onClick={handleLoad}
            className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Load Data
          </button>
        </div>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-10 w-40" />
              <div className="skeleton h-4 w-48" />
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="skeleton h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && cbRecord && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Compliance Balance</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold tracking-tight ${cbRecord.cbGco2eq > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {cbRecord.cbGco2eq.toLocaleString()}
                </span>
                <span className="text-slate-500">gCO₂e</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Adjusted CB: <strong className="text-slate-900">{adjustedCb?.toLocaleString()}</strong>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={() => bankSurplus(shipId, parseInt(year))}
                disabled={cbRecord.cbGco2eq <= 0}
                className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Bank Full Surplus
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Apply Banked Surplus</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Apply (gCO₂e)</label>
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={applyAmount} onChange={e => setApplyAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleApply}
                disabled={cbRecord.cbGco2eq >= 0 || !applyAmount}
                className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Apply to Deficit
              </button>
            </div>
          </div>
        </div>
      )}

      {bankEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Bank Ledger Entries</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3 border-b border-slate-100">ID</th>
                <th className="px-6 py-3 border-b border-slate-100 text-right">Amount (gCO₂e)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bankEntries.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-slate-600 font-mono text-xs">{e.id}</td>
                  <td className={`px-6 py-3 text-right font-medium ${e.amountGco2eq > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {e.amountGco2eq > 0 ? '+' : ''}{e.amountGco2eq.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
