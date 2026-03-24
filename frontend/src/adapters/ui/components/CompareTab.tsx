import React from 'react';
import { useCompareTab } from '../../../core/application/useCompareTab';

export function CompareTab() {
  const { comparison, loading, error, fetchComparison } = useCompareTab();

  if (loading && !comparison) return <div className="p-4 text-center text-slate-500 animate-pulse">Loading comparison insights...</div>;
  if (error) return <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;
  if (!comparison) return <div className="p-4 text-center text-slate-500">No comparison data available. Is a baseline set?</div>;

  const baseline = comparison.baselineRoute;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">GHG Intensity Comparison</h2>
          <p className="text-sm text-slate-500 mt-1">Comparing performance against the baseline route ({baseline.routeId})</p>
        </div>
        <button 
          onClick={fetchComparison}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Baseline Card */}
        <div className="bg-gradient-to-br from-teal-600 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
          <p className="text-teal-100 font-medium text-sm mb-1 z-10 relative">BASELINE ({baseline.year})</p>
          <div className="flex items-baseline gap-2 z-10 relative">
            <h3 className="text-4xl font-bold tracking-tight">{baseline.ghgIntensity.toFixed(2)}</h3>
            <span className="text-teal-200">gCO₂e/MJ</span>
          </div>
          <div className="mt-6 pt-4 border-t border-teal-400/30 text-sm flex justify-between z-10 relative">
            <span className="text-teal-100">Vessel: {baseline.vesselType}</span>
            <span className="text-teal-100 font-semibold">{baseline.routeId}</span>
          </div>
        </div>

        {/* Target 2025 Info */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">FuelEU 2025 Target Requirement</h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            The reference value is 91.16 gCO₂e/MJ. For 2025, the regulation mandates a <strong className="text-emerald-600 bg-emerald-50 px-1 rounded">2% reduction</strong>, setting the target intensity to exactly <strong className="text-slate-800 border-b border-slate-300">89.3368 gCO₂e/MJ</strong>. Any vessel operating above this intensity requires banking or pooling to achieve compliance.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Comparison Route</th>
              <th className="px-6 py-4">GHG Intensity</th>
              <th className="px-6 py-4 text-right">vs. Baseline (%)</th>
              <th className="px-6 py-4 text-center">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparison.comparisonRoutes.map(({ route, percentDiff, isCompliant }) => (
              <tr key={route.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {route.routeId} <span className="text-slate-400 font-normal ml-2">({route.year})</span>
                </td>
                <td className="px-6 py-4 text-slate-800 font-medium">{route.ghgIntensity.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-medium ${percentDiff > 0 ? 'text-red-500' : 'text-emerald-500'}`} title={`Relative to the Baseline (${baseline.ghgIntensity.toFixed(2)})`}>
                    {percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {isCompliant ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm" title="Actual GHG Intensity is ≤ 89.3368">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Compliant (Surplus)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm" title="Actual GHG Intensity is > 89.3368">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Deficit Status
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GHG Intensity Comparison Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-8 relative">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">GHG Intensity Visualization (Target: 89.34)</h3>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-400"></div>
            <span>Base Allowance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-400"></div>
            <span>Surplus Gap (Compliant)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-rose-500"></div>
            <span>Deficit Margin (Penalty)</span>
          </div>
        </div>
        <div className="space-y-4 relative">
          {/* Baseline Bar */}
          <div className="relative">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-blue-700">{baseline.routeId} (Baseline)</span>
              <span className="text-slate-500">{baseline.ghgIntensity.toFixed(2)}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden flex">
               {baseline.ghgIntensity <= 89.3368 ? (
                 <>
                   <div className="bg-slate-400 h-full" style={{ width: `${(baseline.ghgIntensity / 100) * 100}%` }} title="Actual Intensity"></div>
                   <div className="bg-emerald-400 h-full" style={{ width: `${((89.3368 - baseline.ghgIntensity) / 100) * 100}%` }} title="Surplus Margin"></div>
                 </>
               ) : (
                 <>
                   <div className="bg-slate-400 h-full" style={{ width: `${(89.3368 / 100) * 100}%` }} title="Target Allowance"></div>
                   <div className="bg-rose-500 h-full" style={{ width: `${((baseline.ghgIntensity - 89.3368) / 100) * 100}%` }} title="Deficit Margin"></div>
                 </>
               )}
            </div>
          </div>
          
          {/* Comparison Routes Bars */}
          {comparison.comparisonRoutes.map(({ route, isCompliant }) => (
            <div key={`chart-${route.id}`} className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">{route.routeId}</span>
                <span className="text-slate-500">{route.ghgIntensity.toFixed(2)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden flex">
                 {route.ghgIntensity <= 89.3368 ? (
                   <>
                     <div className="bg-slate-400 h-full" style={{ width: `${(route.ghgIntensity / 100) * 100}%` }} title="Actual Intensity"></div>
                     <div className="bg-emerald-400 h-full" style={{ width: `${((89.3368 - route.ghgIntensity) / 100) * 100}%` }} title="Surplus Margin"></div>
                   </>
                 ) : (
                   <>
                     <div className="bg-slate-400 h-full" style={{ width: `${(89.3368 / 100) * 100}%` }} title="Target Allowance"></div>
                     <div className="bg-rose-500 h-full" style={{ width: `${((route.ghgIntensity - 89.3368) / 100) * 100}%` }} title="Deficit Margin"></div>
                   </>
                 )}
              </div>
            </div>
          ))}

          {/* Target line removed per user request */}
        </div>
      </div>
    </div>
  );
}
