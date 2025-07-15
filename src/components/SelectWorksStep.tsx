import React, { useState } from 'react';
import { useSelection } from '../context/SelectionContext';
import MapView from './CleanMapView';
import PhotoSelector from './PhotoSelector';
import SelectedList from './SelectedList';
import Button from './ui/Button';
import { works } from '../data/works';

interface Props {
  onNext: () => void;
}

export default function SelectWorksStep({ onNext }: Props) {
  const { selected, clearSelection } = useSelection();
  const [mode, setMode] = useState<'map' | 'photo' | null>(null);

  /* ───────── 初期画面 ───────── */
  if (mode === null) {
    return (
      <div className="relative flex flex-col h-full items-center justify-center gap-14 p-8 text-stone-800 overflow-hidden">
        <h2 className="text-xl lg:text-2xl font-bold tracking-wide mb-4">
          作品を選ぶ方法を選択してください
        </h2>
        {/* six-tile architect collage background */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-10">
          <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 object-cover">
            {Array.from({ length: 6 }).map((_, i) => {
              const isGradient = i === 4;
              if (isGradient) {
                return (
                  <div key="grad" className="w-full h-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-amber-600 via-stone-600 to-amber-700" />
                );
              }
              const img = works[i % works.length]?.imageUrl ?? '';
              return (
                <img key={i} src={img} alt="architect" className="w-full h-full object-cover grayscale mix-blend-luminosity" />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-10 w-full max-w-5xl relative z-10">
          <button
            onClick={() => setMode('map')}
            className="group relative flex-1 h-64 rounded-[40px] overflow-hidden shadow-2xl focus:outline-none transition-transform hover:scale-105"
          >
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
              alt="map preview"
              className="absolute inset-0 w-full h-full object-cover duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 duration-300" />
            <span className="relative z-10 flex items-center justify-center h-full text-3xl lg:text-4xl text-white font-display font-extrabold tracking-wide drop-shadow-lg">地図で巡る</span>
          </button>
          <button
            onClick={() => setMode('photo')}
            className="group relative flex-1 h-64 rounded-[40px] overflow-hidden shadow-2xl focus:outline-none transition-transform hover:scale-105"
          >
            {/* dynamic collage */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
              {works.slice(0,6).map((w, idx) => (
                <img
                  key={w.id}
                  src={w.imageUrl}
                  alt={w.name}
                  className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transform ${idx%2===0?'rotate-1':'-rotate-1'} scale-105`}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 duration-300" />
            <span className="relative z-10 flex items-center justify-center h-full text-3xl lg:text-4xl text-white font-display font-extrabold tracking-wide drop-shadow-lg">写真で選ぶ</span>
          </button>
        </div>
      </div>
    );
  }

  /* ───────── 選択モード後の画面 ───────── */
  return (
    <div className="flex flex-col h-full relative">
      {/* セレクター領域 */}
      <div className={`flex-1 min-h-0 ${mode === 'photo' ? 'overflow-y-auto pb-32' : ''}`}>
        {mode === 'map' ? (
          <MapView route={[]} />
        ) : (
          <PhotoSelector works={works} />
        )}
      </div>

      {/* 選択済み一覧 */}
      <div className="border-t p-6 bg-stone-50 pb-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base lg:text-lg font-bold">
            選択済み作品 ({selected.length})
          </h3>
          
        </div>
        <div className="max-h-32 overflow-y-auto text-sm">
          <SelectedList />
        </div>
      </div>

      {/* 下部固定ボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t shadow-lg z-50">
        <div className="flex gap-3">
          {selected.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              🗑️ クリア
            </button>
          )}
          <Button
            variant="primary"
            size="lg"
            disabled={selected.length === 0}
            onClick={onNext}
            className="flex-1 text-lg"
          >
            ルートへ進む ({selected.length}件選択済み)
          </Button>
        </div>
      </div>
    </div>
  );
}