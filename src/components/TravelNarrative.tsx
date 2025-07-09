import { ArchitecturalWork } from '../types/models';
import { generateTravelNarrative, TravelNarrative } from '../utils/travelNarrative';
import { useState } from 'react';

interface Props {
  works: ArchitecturalWork[];
  origin: string | null;
}

export default function TravelNarrativeComponent({ works, origin }: Props) {
  const [narrative] = useState<TravelNarrative>(() => 
    generateTravelNarrative(works, origin)
  );

  if (works.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-stone-800 font-display">
          📖 旅の紀行文
        </h2>
        <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded">
          {works.length}作品の旅
        </span>
      </div>

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
          {narrative.sections.map((section, index) => (
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
          ))}
        </div>

        {/* Conclusion */}
        <div className="bg-stone-50 border border-stone-200 p-4 rounded">
          <p className="text-sm text-stone-700 leading-relaxed italic">
            {narrative.conclusion}
          </p>
        </div>
      </div>
    </div>
  );
}