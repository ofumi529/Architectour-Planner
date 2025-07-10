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
    <header className="concrete-heavy architectural-light stone-border flex items-center justify-between px-8 py-6 border-b-4 dramatic-shadow relative overflow-hidden min-h-[80px]">
      {/* 左側セクション - 黄金比（1:1.618）を意識 */}
      <div className="flex items-center gap-6 z-10 flex-1 max-w-[38.2%]">
        <Button variant="secondary" size="sm" className="lg:hidden steel-button industrial-border p-3" onClick={onOpenLeft}>
          <Bars3Icon className="w-6 h-6" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold font-display text-white drop-shadow-lg whitespace-nowrap tracking-wider leading-tight">
            {t('Architectour Planner')}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* 中央セクション - 建築的な間隔 */}
      <div className="flex-1 flex justify-center z-10">
        <div className="steel-gradient rounded-xl p-1 min-w-[200px]">
          <div className="bg-black/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-white/90 text-sm font-medium tracking-wide">
              建築巨匠の旅
            </span>
          </div>
        </div>
      </div>
      
      {/* 右側セクション - コントロール群 */}
      <div className="flex items-center gap-4 z-10 flex-1 max-w-[38.2%] justify-end">
        <div className="glass-panel rounded-xl p-3 industrial-border">
          <OriginSelector value={origin} onChange={setOrigin} />
        </div>
        <div className="glass-panel rounded-xl p-3 industrial-border">
          <LanguageToggle />
        </div>
        <Button variant="secondary" size="sm" className="lg:hidden steel-button industrial-border p-3" onClick={onOpenRight}>
          <Bars3Icon className="w-6 h-6" />
        </Button>
      </div>
      
      {/* 建築的な構造線 - ル・コルビュジエのモジュロール風 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 水平構造線 */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
        
        {/* 垂直構造線 - 黄金比の分割 */}
        <div className="absolute top-0 left-[38.2%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
        <div className="absolute top-0 right-[38.2%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
        
        {/* 角の装飾 - 建築的ディテール */}
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/30"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/30"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/30"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/30"></div>
        
        {/* 中央の建築的モチーフ */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      </div>
    </header>
  );
}
