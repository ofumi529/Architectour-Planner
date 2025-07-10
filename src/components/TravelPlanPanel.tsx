import { useState, useEffect, useCallback } from 'react';
import Card from './ui/Card';
import { useSelection } from '../context/SelectionContext';
import { planRoute, haversine } from '../utils/routePlanner';
import { estimateDuration, estimateCost, TransportMode } from '../utils/transport';
import { Polyline } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import TravelNarrativeComponent from './TravelNarrative';
import { NarrativeRateLimiter } from '../utils/rateLimiter';
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

  // 安定した生成完了コールバック
  const handleNarrativeComplete = useCallback(() => {
    setNarrativeGenerated(true);
  }, []);

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
          onGenerationComplete={handleNarrativeComplete}
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
          <Card className="p-4 text-center bg-slate-50">
            <div className="text-sm font-bold uppercase tracking-wide text-slate-700">{t('Total Distance')}</div>
            <div className="text-2xl font-bold text-slate-800">{distanceKm} km</div>
          </Card>
        )}
        {durationH !== null && (
          <Card className="p-4 text-center bg-emerald-50">
            <div className="text-sm font-bold uppercase tracking-wide text-emerald-700">{t('Total Time')}</div>
            <div className="text-2xl font-bold text-emerald-800">{durationH} h</div>
          </Card>
        )}
        {costUsd !== null && (
          <Card className="p-4 text-center bg-amber-50">
            <div className="text-sm font-bold uppercase tracking-wide text-amber-700">{t('Total Cost')}</div>
            <div className="text-2xl font-bold text-amber-800">${costUsd}</div>
          </Card>
        )}
      </div>

      {segments.length > 0 && (
        <div className="flex gap-2 mt-2">
          
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
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
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-40 transition-colors"
            disabled={narrativeGenerated || !NarrativeRateLimiter.canGenerate()}
            onClick={() => {
              setShouldGenerateNarrative(true);
            }}
            title={!NarrativeRateLimiter.canGenerate() ? 
              `生成制限に達しました。リセットまで: ${NarrativeRateLimiter.getResetTimeFormatted()}` : ''}
          >
            {narrativeGenerated ? '生成済み' : 
             !NarrativeRateLimiter.canGenerate() ? '制限到達' :
             t('旅の気分を味わう')}
          </button>
          
          {/* レート制限情報の表示 */}
          <div className="text-xs text-gray-500 mt-1">
            残り{NarrativeRateLimiter.getRemainingCount()}回/日
          </div>
        </div>
      )}

      {segments.length > 0 && (<>
        <div className="overflow-x-auto max-w-full mt-4">
          <table className="text-sm lg:text-base w-full table-auto border-collapse bg-white rounded-lg shadow-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap font-bold text-gray-700">{t('Leg')}</th>
                <th className="px-4 py-3 text-center whitespace-nowrap font-bold text-gray-700">{t('Mode')}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap font-bold text-gray-700">{t('Distance')}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap font-bold text-gray-700">{t('Time')}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap font-bold text-gray-700">{t('Cost')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">

              {segments.map((s, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-left whitespace-nowrap max-w-[16rem] truncate font-medium" title={s.label}>{s.label}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <select
                      className="architectural-select text-sm min-w-[120px] py-2 px-3"
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
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-blue-700">{s.d} km</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-emerald-700">{Math.round(estimateDuration(s.d, s.mode))} h</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap font-semibold text-amber-700">${Math.round(estimateCost(s.d, s.mode))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      )}
      {routeNames.length > 0 && (
        <ol className="list-decimal ml-6 text-base space-y-2 mt-4">
          {routeNames.map((n, i) => (
            <li key={i} className="font-medium text-gray-700">{n}</li>
          ))}
        </ol>
      )}
    </div>
  );


}
