import { useState, useEffect } from 'react';
import Card from './ui/Card';
import { useSelection } from '../context/SelectionContext';
import { planRoute, haversine } from '../utils/routePlanner';
import { estimateDuration, estimateCost, TransportMode } from '../utils/transport';
import { Polyline } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import TravelNarrativeComponent from './TravelNarrative';
import { ArchitecturalWork } from '../types/models';

interface Props {
  onRouteReady: (coords: [number, number][]) => void;
  origin: string | null;
  originCoords: [number, number] | null;
}
export default function TravelPlanPanel({ onRouteReady, origin, originCoords }: Props) {
  const { selected } = useSelection();
  const { t } = useTranslation();
  const [routeNames, setRouteNames] = useState<string[]>([]);
  const [orderedWorks, setOrderedWorks] = useState<ArchitecturalWork[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shouldGenerateNarrative, setShouldGenerateNarrative] = useState(false);
  const [narrativeGenerated, setNarrativeGenerated] = useState(false);

  interface Segment { label: string; d: number; mode: TransportMode }
  const [segments, setSegments] = useState<Segment[]>([]);
  const [durationH, setDurationH] = useState<number | null>(null);
  const [costUsd, setCostUsd] = useState<number | null>(null);

  const generate = () => {
    if (!originCoords) return;
    const ordered = planRoute(selected, originCoords);
    setRouteNames(ordered.map((w) => w.name));
    setOrderedWorks(ordered);
    setShouldGenerateNarrative(false);
    setNarrativeGenerated(false);
    const coords: [number, number][] = [originCoords, ...ordered.map((w) => [w.location.lat, w.location.lng]), originCoords] as [number, number][];
    // compute distance
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += haversine(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1]);
    }
    setDistanceKm(Math.round(total));

    // build segments details
    const segs: Segment[] = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const d = haversine(coords[i][0], coords[i][1], coords[i + 1][0], coords[i + 1][1]);
      const fromLabel = i === 0 ? origin ?? 'Origin' : ordered[i - 1].name;
      const toLabel = i < ordered.length ? ordered[i].name : origin ?? 'Origin';
      segs.push({ label: `${fromLabel} → ${toLabel}`, d: Math.round(d), mode: 'flight' });
    }
    setSegments(segs);

    // compute totals directly
    const totalH = segs.reduce((acc, s) => acc + estimateDuration(s.d, s.mode), 0);
    const totalC = segs.reduce((acc, s) => acc + estimateCost(s.d, s.mode), 0);
    setDurationH(Math.round(totalH));
    setCostUsd(Math.round(totalC));

    onRouteReady(coords);
  };

  return (
    <div>
      {/* Travel Narrative - Show after route generation */}
      {orderedWorks.length > 0 && (
        <TravelNarrativeComponent 
          works={orderedWorks} 
          origin={origin} 
          shouldGenerate={shouldGenerateNarrative}
          onGenerationComplete={() => setNarrativeGenerated(true)}
        />
      )}
      
      <h2 className="font-semibold mb-2">{t('Travel Plan')}</h2>
      <div className="space-y-2">
        <div className="text-sm">{t('Origin')}: {origin ?? t('None')}</div>
        <button
          className="mb-2 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-sm rounded disabled:opacity-40"
          disabled={selected.length < 2 || !originCoords}
          onClick={generate}
        >
          {t('Generate Route')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
        {distanceKm !== null && (
          <Card className="p-2 text-center bg-slate-50">
            <div className="text-[10px] font-medium uppercase tracking-wide">{t('Total Distance')}</div>
            <div className="text-lg font-semibold">{distanceKm} km</div>
          </Card>
        )}
        {durationH !== null && (
          <Card className="p-2 text-center bg-emerald-50">
            <div className="text-[10px] font-medium uppercase tracking-wide">{t('Total Time')}</div>
            <div className="text-lg font-semibold">{durationH} h</div>
          </Card>
        )}
        {costUsd !== null && (
          <Card className="p-2 text-center bg-amber-50">
            <div className="text-[10px] font-medium uppercase tracking-wide">{t('Total Cost')}</div>
            <div className="text-lg font-semibold">${costUsd}</div>
          </Card>
        )}
      </div>

      {segments.length > 0 && (
        <div className="flex gap-2 mt-2">
          
          <button
            className="px-2 py-1 bg-purple-600 text-white rounded text-xs"
            onClick={() => {
              import('../utils/share').then(({ generateShareUrl }) => {
                const url = generateShareUrl({ origin: origin ?? '', selectedIds: selected.map(w => w.id), segments: segments.map(s => ({ mode: s.mode })) });
                navigator.clipboard.writeText(url);
                alert(t('Share URL copied'));
              });
            }}
          >
            {t('Copy Share URL')}
          </button>

          <button
            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs disabled:opacity-40"
            disabled={narrativeGenerated}
            onClick={() => {
              setShouldGenerateNarrative(true);
            }}
          >
            {narrativeGenerated ? '生成済み' : t('旅の気分を味わう')}
          </button>
        </div>
      )}

      {segments.length > 0 && (<>
        <div className="overflow-x-auto max-w-full mt-2">
          <table className="text-xs w-full table-auto border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-2 py-1 text-left whitespace-nowrap">{t('Leg')}</th>
                <th className="px-2 py-1 text-center whitespace-nowrap">{t('Mode')}</th>
                <th className="px-2 py-1 text-right whitespace-nowrap">{t('Distance')}</th>
                <th className="px-2 py-1 text-right whitespace-nowrap">{t('Time')}</th>
                <th className="px-2 py-1 text-right whitespace-nowrap">{t('Cost')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {segments.map((s, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1 text-left whitespace-nowrap max-w-[12rem] truncate" title={s.label}>{s.label}</td>
                  <td className="px-2 py-1 text-center whitespace-nowrap">
                    <select
                      className="border rounded px-1 py-0.5 text-xs"
                      value={s.mode}
                      onChange={(e) => {
                        const newMode = e.target.value as TransportMode;
                        setSegments(prev => prev.map((seg, i) => i === idx ? { ...seg, mode: newMode } : seg));
                      }}
                    >
                      <option value="flight">{t('Flight')}</option>
                      <option value="train">{t('Train')}</option>
                      <option value="bus">{t('Bus')}</option>
                      <option value="car">{t('Car')}</option>
                    </select>
                  </td>
                  <td className="px-2 py-1 text-right whitespace-nowrap">{s.d} km</td>
                  <td className="px-2 py-1 text-right whitespace-nowrap">{Math.round(estimateDuration(s.d, s.mode))} h</td>
                  <td className="px-2 py-1 text-right whitespace-nowrap">${Math.round(estimateCost(s.d, s.mode))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      )}
      {routeNames.length > 0 && (
        <ol className="list-decimal ml-4 text-sm space-y-1">
          {routeNames.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ol>
      )}
    </div>
  );


}
