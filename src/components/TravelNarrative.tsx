import { ArchitecturalWork } from '../types/models';
import { generateAINarrative, AIGeneratedNarrative } from '../utils/aiNarrative';
import { useState, useEffect, useCallback, useRef } from 'react';

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
  
  const isGeneratingRef = useRef(false);
  const hasGeneratedRef = useRef(false);
  const lastGenerationKeyRef = useRef<string | null>(null);

  // 安定した生成完了コールバック
  const handleGenerationComplete = useCallback(() => {
    onGenerationComplete?.();
  }, [onGenerationComplete]);

  useEffect(() => {
    if (works.length === 0) {
      setNarrative({
        title: '',
        introduction: '',
        sections: [],
        conclusion: '',
        isGenerating: false
      });
      hasGeneratedRef.current = false;
      lastGenerationKeyRef.current = null;
      return;
    }

    // shouldGenerateがtrueの時のみ生成を開始
    if (!shouldGenerate) {
      return;
    }

    // 重複実行を防ぐ - より厳密なチェック
    if (isGeneratingRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('AI生成中のため、重複実行をスキップします');
      }
      return;
    }

    // 同じ条件での再生成を防ぐ
    const generationKey = `${works.map(w => w.id).sort().join('-')}-${origin}`;
    if (hasGeneratedRef.current && lastGenerationKeyRef.current === generationKey) {
      if (process.env.NODE_ENV === 'development') {
        console.log('同じ条件での再生成をスキップします:', generationKey);
      }
      return;
    }

    // AI生成開始
    if (process.env.NODE_ENV === 'development') {
      console.log('AI紀行文生成を開始します:', generationKey);
    }
    isGeneratingRef.current = true;
    hasGeneratedRef.current = true;
    lastGenerationKeyRef.current = generationKey;
    setNarrative(prev => ({ ...prev, isGenerating: true, error: undefined }));
    
    generateAINarrative(works, origin).then(generatedNarrative => {
      if (process.env.NODE_ENV === 'development') {
        console.log('AI紀行文生成が完了しました');
      }
      setNarrative(generatedNarrative);
      isGeneratingRef.current = false;
      handleGenerationComplete();
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
      isGeneratingRef.current = false;
      handleGenerationComplete();
    });
  }, [works, origin, shouldGenerate, handleGenerationComplete]);

  // shouldGenerateがfalseになった時にリセット
  useEffect(() => {
    if (!shouldGenerate) {
      isGeneratingRef.current = false;
      hasGeneratedRef.current = false;
      lastGenerationKeyRef.current = null;
    }
  }, [shouldGenerate]);

  if (works.length === 0 || (!shouldGenerate && narrative.sections.length === 0)) {
    return null;
  }

  return (
    <div className="glass-card border-none deep-shadow p-8 mb-8 light-ray">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold font-display tracking-wide text-slate-800 drop-shadow-sm">
          📖 旅の紀行文
        </h2>
        <div className="flex items-center gap-3 relative z-10">
          {narrative.isGenerating && (
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-700"></div>
              生成中...
            </div>
          )}
          <span className="text-base font-semibold text-slate-700 glass-panel px-4 py-3 rounded-lg">
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
            <h3 className="text-2xl lg:text-3xl font-bold text-stone-700 font-display tracking-wide">
              {narrative.title}
            </h3>
          </div>

          {/* Introduction */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r">
            <p className="text-base lg:text-lg text-stone-700 leading-relaxed">
              {narrative.introduction}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {narrative.sections.map((section, index) => {
              return (
                <div key={section.work.id} className="border-l-2 border-stone-200 pl-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-stone-700 text-white text-sm px-3 py-2 rounded-full font-mono font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-800 text-lg lg:text-xl">
                        {section.work.name}
                      </h4>
                      <p className="text-sm text-stone-500 mt-1">
                        {section.work.architect} ({section.work.year}) - {section.work.location.city}, {section.work.location.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-stone-600 mb-4 italic font-medium">
                    {section.locationContext}
                  </div>
                  
                  {/* Text and Image Layout */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1 order-2 sm:order-1">
                      <p className="text-base lg:text-lg text-stone-700 leading-relaxed">
                        {section.narrative}
                      </p>
                    </div>
                    
                    {section.work.imageUrl && (
                      <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-24 order-1 sm:order-2">
                        <img
                          src={section.work.imageUrl}
                          alt={section.work.name}
                          className="w-full h-full object-cover rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conclusion */}
          <div className="bg-stone-50 border border-stone-200 p-6 rounded">
            <p className="text-base lg:text-lg text-stone-700 leading-relaxed italic font-medium">
              {narrative.conclusion}
            </p>
          </div>

          {/* Generation Notice */}
          <div className="text-center">
            <p className="text-sm text-stone-400">
              ✨ この紀行文は選択された作品に基づいて動的に生成されました
            </p>
          </div>
        </div>
      )}
    </div>
  );
}