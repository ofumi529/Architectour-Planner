import { useSelection } from '../context/SelectionContext';
import MapView from './CleanMapView';
import PhotoSelector from './PhotoSelector';
import SelectedList from './SelectedList';
import Button from './ui/Button';
import { works } from '../data/works';
import { useState } from 'react';

interface Props {
  onNext: () => void;
}

export default function SelectWorksStep({ onNext }: Props) {
  const { selected } = useSelection();
  const [mode, setMode] = useState<'map' | 'photo'>('map');

  return (
    <div className="flex flex-col h-full relative">
      {/* mode toggle */}
      <div className="flex justify-center gap-4 py-4 bg-gradient-to-r from-slate-800 via-stone-800 to-amber-900 text-base lg:text-lg uppercase tracking-wide text-amber-50 shadow-inner">
        <button
          className={`px-6 py-3 rounded-full font-bold transition-all duration-300 text-sm lg:text-base ${
            mode === 'map' 
              ? 'bg-slate-600 text-white shadow-lg scale-105 border-2 border-slate-400' 
              : 'hover:bg-slate-700/50 hover:scale-102 border-2 border-transparent'
          }`}
          onClick={() => setMode('map')}
        >
          🗺️ 地図で巡る — Masterpiece Atlas
        </button>
        <button
          className={`px-6 py-3 rounded-full font-bold transition-all duration-300 text-sm lg:text-base ${
            mode === 'photo' 
              ? 'bg-amber-700 text-white shadow-lg scale-105 border-2 border-amber-500' 
              : 'hover:bg-amber-800/50 hover:scale-102 border-2 border-transparent'
          }`}
          onClick={() => setMode('photo')}
        >
          📸 写真で選ぶ — Visual Gallery
        </button>
      </div>

      {/* selector area */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-32">
        {mode === 'map' ? <MapView route={[]} /> : <PhotoSelector works={works} />}
      </div>

      {/* selected summary */}
      <div className="border-t p-6 bg-stone-50 pb-20">
        <h3 className="text-base lg:text-lg font-bold mb-2">選択済み作品 ({selected.length})</h3>
        <div className="max-h-32 overflow-y-auto text-sm">
          <SelectedList />
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t shadow-lg z-50">
        <Button variant="primary" size="lg" disabled={selected.length === 0} onClick={onNext} className="w-full text-lg">
          ルートへ進む ({selected.length}件選択済み)
        </Button>
      </div>
    </div>
  );
}
