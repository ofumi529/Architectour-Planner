import OriginSelector from './OriginSelector';
import Button from './ui/Button';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

interface Props {
  origin: string | null;
  setOrigin: (s: string | null) => void;
  onNext: () => void;
}

// import architect portraits dynamically
const portraits: string[] = Object.values(
  import.meta.glob('../data/architects/*.{jpg,png,jpeg}', { eager: true, as: 'url' })
) as string[];

export default function OriginStep({ origin, setOrigin, onNext }: Props) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Define swipe directions and delays for each portrait
  const swipeConfigs = [
    { direction: 'translate-x-[-100%]', delay: 'delay-0' },
    { direction: 'translate-y-[-100%]', delay: 'delay-150' },
    { direction: 'translate-x-[100%]', delay: 'delay-300' },
    { direction: 'translate-x-[-100%]', delay: 'delay-450' },
    { direction: 'translate-y-[100%]', delay: 'delay-600' }, // gradient
    { direction: 'translate-x-[100%]', delay: 'delay-750' },
  ];

  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-6 p-6 text-center overflow-hidden">
      {/* background collage */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10">
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 object-cover">
          {Array.from({ length: 6 }).map((_, i) => {
            const config = swipeConfigs[i];
            if (i === 4) {
              return (
                <div
                  key="abstract"
                  className={`w-full h-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-amber-600 via-stone-600 to-amber-700 
                    transform transition-all duration-1000 ease-out ${config.delay}
                    ${isLoaded ? 'translate-x-0 translate-y-0' : config.direction}`}
                />
              );
            }
            const imgIdx = i < 4 ? i : i - 1; // skip slot 4
            const src = portraits[imgIdx % portraits.length];
            return (
              <img
                key={i}
                src={src}
                className={`w-full h-full object-cover grayscale mix-blend-luminosity 
                  transform transition-all duration-1000 ease-out ${config.delay}
                  ${isLoaded ? 'translate-x-0 translate-y-0' : config.direction}`}
                alt="architect"
              />
            );
          })}
        </div>
      </div>
      <div className={`transform transition-all duration-1000 ease-out delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h2 className="text-3xl font-display text-stone-800">
          {t('いざ、巨匠建築を巡る旅へ')}
        </h2>
        <p className="text-sm font-body text-stone-600 max-w-md mt-4">
          {t('まずは出発国を選択してください。そこから巨匠建築巡礼がはじまります！')}
        </p>
        <div className="mt-6">
          <OriginSelector value={origin} onChange={setOrigin} />
        </div>
        <Button
          variant="primary"
          disabled={!origin}
          onClick={onNext}
          className="mt-4 px-6 py-2"
        >
          {t('次へ')}
        </Button>
      </div>
    </div>
  );
}
