import { ArchitecturalWork } from '../types/models';
import { generateAINarrative, AIGeneratedNarrative } from '../utils/aiNarrative';
import { useState, useEffect } from 'react';

interface Props {
  works: ArchitecturalWork[];
  origin: string | null;
  shouldGenerate: boolean;
  onGenerationComplete?: () => void;
}

export default function TravelNarrativeComponent({ works, origin, shouldGenerate, onGenerationComplete }: Props) {
  const [narrative, setNarrative] = useState<AIGeneratedNarrative>({
    title: '',
    introduction: '',
    sections: [],
    conclusion: '',
    isGenerating: true
  });

  useEffect(() => {
    if (works.length === 0) {
      setNarrative({
        title: '',
        introduction: '',
        sections: [],
        conclusion: '',
        isGenerating: false
      });
      return;
    }

    // shouldGenerateがtrueの時のみ生成を開始
    if (!shouldGenerate) {
      return;
    }

    // AI生成開始
    setNarrative(prev => ({ ...prev, isGenerating: true, error: undefined }));
    
    generateAINarrative(works, origin).then(generatedNarrative => {
      setNarrative(generatedNarrative);
      onGenerationComplete?.();
    }).catch(error => {
      console.error('AI紀行文生成に失敗しました:', error);
      setNarrative({
        title: 'AI生成エラー',
        introduction: '申し訳ございません。紀行文の生成に失敗しました。',
        sections: [],
        conclusion: '',
        isGenerating: false,
        error: 'AI生成に失敗しました'
      });
      onGenerationComplete?.();
    });
  }, [works, origin, shouldGenerate, onGenerationComplete]);

  if (works.length === 0 || (!shouldGenerate && narrative.sections.length === 0)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-stone-800 font-display">
          📖 旅の紀行文
        </h2>
        <div className="flex items-center gap-2">
          {narrative.isGenerating && (
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-amber-600"></div>
              生成中...
            </div>
          )}
          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
            {works.length}作品の旅
          </span>
        </div>
      </div>

      {narrative.isGenerating ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-6 bg-stone-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-stone-200 rounded w-5/6 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: works.length }).map((_, i) => (
                <div key={i} className="border-l-2 border-stone-200 pl-4">
                  <div className="h-4 bg-stone-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-stone-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-stone-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : narrative.error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <p className="text-sm text-red-700">{narrative.error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-stone-700 font-display">
              {narrative.title}
            </h3>
          </div>

          {/* Introduction */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
            <p className="text-sm text-stone-700 leading-relaxed">
              {narrative.introduction}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {narrative.sections.map((section, index) => {
              return (
                <div key={section.work.id} className="border-l-2 border-stone-200 pl-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-stone-700 text-white text-xs px-2 py-1 rounded-full font-mono">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-stone-800 text-sm">
                        {section.work.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {section.work.architect} ({section.work.year}) - {section.work.location.city}, {section.work.location.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-stone-600 mb-2 italic">
                    {section.locationContext}
                  </div>
                  
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {section.narrative}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Conclusion */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded">
            <p className="text-sm text-stone-700 leading-relaxed italic">
              {narrative.conclusion}
            </p>
          </div>

          {/* Generation Notice */}
          <div className="text-center">
            <p className="text-xs text-stone-400">
              ✨ この紀行文は選択された作品に基づいて動的に生成されました
            </p>
          </div>
        </div>
      )}
    </div>
  );
}