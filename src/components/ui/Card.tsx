interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'steel' | 'concrete' | 'wood' | 'glass';
  elevation?: 'low' | 'medium' | 'high';
}

export default function Card({ 
  title, 
  children, 
  className = '', 
  variant = 'default',
  elevation = 'medium'
}: Props) {
  const variantStyles = {
    default: 'glass-card',
    steel: 'steel-gradient border-2 border-slate-600',
    concrete: 'concrete-texture border-4 border-slate-700',
    wood: 'wood-warm border-2 border-amber-700',
    glass: 'glass-panel backdrop-blur-lg'
  };

  const elevationStyles = {
    low: 'shadow-lg',
    medium: 'dramatic-shadow',
    high: 'deep-shadow'
  };

  return (
    <div className={`
      ${variantStyles[variant]} 
      ${elevationStyles[elevation]}
      rounded-2xl p-8 architectural-transition construct-in 
      relative overflow-hidden border-l-4 border-l-amber-500/60
      ${className}
    `}>
      {/* 建築的なヘッダー */}
      {title && (
        <div className="relative z-10 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></div>
            <h3 className="font-bold text-lg font-display tracking-wide text-slate-800 uppercase">
              {title}
            </h3>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-amber-500/50 via-transparent to-transparent"></div>
        </div>
      )}
      
      {/* コンテンツエリア */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 建築的な構造要素 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 外枠の構造線 */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-black/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
        
        {/* 内部の構造格子 - ミース風 */}
        <div className="absolute top-1/4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-3/4 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* 角の建築的ディテール */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-[1px] border-l-[1px] border-white/40"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-[1px] border-r-[1px] border-white/40"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-[1px] border-l-[1px] border-white/40"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-[1px] border-r-[1px] border-white/40"></div>
        
        {/* 材質感を表現するテクスチャー */}
        {variant === 'concrete' && (
          <div className="absolute inset-4 opacity-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_20%_50%,_rgba(0,0,0,0.2)_1px,_transparent_1px),radial-gradient(circle_at_80%_50%,_rgba(0,0,0,0.15)_1px,_transparent_1px)]" 
                 style={{ backgroundSize: '15px 15px, 25px 25px' }}></div>
          </div>
        )}
        
        {variant === 'steel' && (
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,_transparent,_transparent_2px,_rgba(255,255,255,0.1)_2px,_rgba(255,255,255,0.1)_4px)]"></div>
          </div>
        )}
        
        {/* 光の反射効果 */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>
      </div>
      
      {/* ホバー時の建築的フィードバック */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 transition-opacity duration-300 rounded-2xl group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
}
