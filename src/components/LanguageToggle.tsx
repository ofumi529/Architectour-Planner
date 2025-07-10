import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const toggle = () => {
    const newLng = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLng);
  };

  return (
    <button
      onClick={toggle}
      className="architectural-transition steel-button px-4 py-3 text-sm font-bold tracking-wider uppercase relative overflow-hidden rounded-xl border border-slate-500 min-w-[140px]"
    >
      {/* 建築的な内部構造 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 上部のハイライト */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* 下部の影 */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
        
        {/* 角の装飾 */}
        <div className="absolute top-0.5 left-0.5 w-2 h-2 border-t border-l border-white/25"></div>
        <div className="absolute top-0.5 right-0.5 w-2 h-2 border-t border-r border-white/25"></div>
        <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-b border-l border-white/25"></div>
        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-b border-r border-white/25"></div>
      </div>
      
      {/* テキストコンテンツ */}
      <span className="relative z-10 flex items-center justify-center gap-1">
        <span className="text-amber-400">◆</span>
        {i18n.language === 'ja' ? 'EN' : 'JA'}
      </span>
      
      {/* ホバー時のエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
    </button>
  );
}
