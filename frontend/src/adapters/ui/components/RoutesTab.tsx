import React, { useState } from 'react';
import { useRoutesTab } from '../../../core/application/useRoutesTab';

export function RoutesTab() {
  const { routes, loading, error, setBaseline } = useRoutesTab();
  const [filterVessel, setFilterVessel] = useState('');
  const [filterFuel, setFilterFuel] = useState('');
  const [filterYear, setFilterYear] = useState('');

  if (loading) return <div className="p-4 text-center text-slate-500 animate-pulse">Loading routes data...</div>;
  if (error) return <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;

  const filteredRoutes = routes.filter(r => {
    return (filterVessel ? r.vesselType.toUpperCase().includes(filterVessel.toUpperCase()) : true) &&
      (filterFuel ? r.fuelType.toUpperCase().includes(filterFuel.toUpperCase()) : true) &&
      (filterYear ? r.year.toString().includes(filterYear) : true);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold tracking-tight text-slate-800">Route Registry</h2>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Filter by Vessel..."
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={filterVessel} onChange={(e) => setFilterVessel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Fuel..."
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={filterFuel} onChange={(e) => setFilterFuel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Year..."
            className="px-4 py-2 w-32 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Route ID</th>
                <th className="px-6 py-4">Vessel Type</th>
                <th className="px-6 py-4">Fuel Type</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">GHG Intensity</th>
                <th className="px-6 py-4 text-right">Fuel Cons. (t)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{route.routeId}</td>
                  <td className="px-6 py-4 text-slate-600">{route.vesselType}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-xs">{route.fuelType}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{route.year}</td>
                  <td className="px-6 py-4 text-slate-800 font-medium">{route.ghgIntensity.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-600 text-right">{route.fuelConsumption.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {route.isBaseline ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        Baseline
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!route.isBaseline && (
                      <button
                        onClick={() => setBaseline(route.id)}
                        className="text-sm px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm font-medium"
                      >
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">No routes found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
