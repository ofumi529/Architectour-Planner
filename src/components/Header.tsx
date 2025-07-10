import { Bars3Icon } from '@heroicons/react/24/outline';
import Button from './ui/Button';
import LanguageToggle from './LanguageToggle';
import OriginSelector from './OriginSelector';
import { useTranslation } from 'react-i18next';

interface Props {
  onOpenLeft: () => void;
  onOpenRight: () => void;
  origin: string | null;
  setOrigin: (s: string | null) => void;
}

export default function Header({ onOpenLeft, onOpenRight, origin, setOrigin }: Props) {
  const { t } = useTranslation();
  return (
    <header className="concrete-heavy architectural-light stone-border flex items-center justify-between p-4 border-b dramatic-shadow relative overflow-hidden">
      <div className="flex items-center gap-3 z-10">
        <Button variant="secondary" size="sm" className="lg:hidden steel-button" onClick={onOpenLeft}>
          <Bars3Icon className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold font-display text-white drop-shadow-lg whitespace-nowrap tracking-wide">
          {t('Architectour Planner')}
        </h1>
      </div>
      <div className="flex items-center gap-3 z-10">
        <div className="glass-panel rounded-lg p-2">
          <OriginSelector value={origin} onChange={setOrigin} />
        </div>
        <div className="glass-panel rounded-lg p-2">
          <LanguageToggle />
        </div>
        <Button variant="secondary" size="sm" className="lg:hidden steel-button" onClick={onOpenRight}>
          <Bars3Icon className="w-5 h-5" />
        </Button>
      </div>
      
      {/* 建築的な装飾要素 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      </div>
    </header>
  );
}
