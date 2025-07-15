import { Suspense, useState, useEffect } from 'react';
import { useSelection } from './context/SelectionContext';
import { worksMap } from './data/works';
import './i18n';
import { SelectionProvider } from './context/SelectionContext';
import StepProgress from './components/StepProgress';
import OriginStep from './components/OriginStep';
import SelectWorksStep from './components/SelectWorksStep';
import PlanStep from './components/PlanStep';
import { countryCenters } from './data/countryCenters';
import { updateOGPFromURL } from './utils/ogp';

export default function App() {
  // Deep-link initializer
  function URLSync() {
    const { setSelection } = useSelection();
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const worksParam = params.get('works');
      const originParam = params.get('origin');
      if (worksParam) {
        const ids = worksParam.split(',');
        const selectedWorks = ids.map(id => worksMap[id]).filter(Boolean);
        if (selectedWorks.length >= 2) {
          setSelection(selectedWorks as any);
          if (originParam) setOrigin(originParam);
          setAutoMode(true);
          setStep('plan');
        }
      }
    }, []);
    return null;
  }

  const [step, setStep] = useState<'origin' | 'select' | 'plan'>('origin');
  const [origin, setOrigin] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);

  // URLパラメータからOGPを更新
  useEffect(() => {
    updateOGPFromURL();
  }, []);

  return (
    <Suspense fallback={
      <div className="concrete-texture h-screen flex items-center justify-center">
        <div className="glass-card p-8 construct-in">
          <div className="steel-gradient rounded-lg p-4 text-white font-display text-xl">
            Loading...
          </div>
        </div>
      </div>
    }>
      <SelectionProvider>
        <div className="h-screen flex flex-col concrete-texture architectural-light">
          <URLSync />
          <StepProgress current={step} />
          <div className="flex-1 min-h-0 relative">
            {step === 'origin' && (
              <OriginStep
                origin={origin}
                setOrigin={setOrigin}
                onNext={() => setStep('select')}
              />
            )}
            {step === 'select' && (
              <SelectWorksStep
                onNext={() => setStep('plan')}
              />
            )}
            {step === 'plan' && (
              <PlanStep
                origin={origin}
                originCoords={origin ? countryCenters[origin] : null}
                onRestart={() => setStep('select')}
                 autoGenerate={autoMode}
                 autoNarrative={autoMode}
              />
            )}
          </div>
        </div>
      
        </SelectionProvider>
    </Suspense>
  );
}
