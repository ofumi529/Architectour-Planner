import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'steel' | 'concrete' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  architectural?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  architectural = true,
  className,
  children,
  ...rest
}: Props) {
  const variantClasses: Record<string, string> = {
    primary: 'wood-accent text-white font-semibold tracking-wide glass-reflection border border-amber-600',
    secondary: 'steel-button border border-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-700',
    steel: 'steel-gradient text-white border-2 border-slate-600',
    concrete: 'concrete-heavy text-white border-4 border-slate-700',
    glass: 'glass-panel text-slate-800 border border-white/30'
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-3 text-xs min-h-[36px]',
    md: 'px-6 py-3.5 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]',
    xl: 'px-10 py-5 text-lg min-h-[60px]'
  };

  return (
    <button
      {...rest}
      className={clsx(
        'rounded-xl font-bold architectural-transition construct-in relative overflow-hidden',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
        architectural && 'shadow-lg hover:shadow-xl',
        variantClasses[variant], 
        sizeClasses[size], 
        className
      )}
    >
      {/* 建築的な内部構造 */}
      {architectural && (
        <div className="absolute inset-0 pointer-events-none">
          {/* 上部のハイライト */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-t-xl"></div>
          
          {/* 下部の影 */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/30 to-transparent rounded-b-xl"></div>
          
          {/* 側面の構造線 */}
          <div className="absolute top-2 bottom-2 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
          <div className="absolute top-2 bottom-2 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
          
          {/* 中央の装飾線 - 建築的ディテール */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-y-1/2"></div>
          
          {/* 角の建築的ディテール */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-white/30 rounded-tl-lg"></div>
          <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-white/30 rounded-tr-lg"></div>
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-white/30 rounded-bl-lg"></div>
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-white/30 rounded-br-lg"></div>
        </div>
      )}

      {/* テキストコンテンツ */}
      <span className="relative z-10 flex items-center justify-center gap-2 tracking-wider uppercase">
        {children}
      </span>

      {/* ホバー時の建築的エフェクト */}
      {architectural && (
        <>
          {/* 光の反射エフェクト */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
          
          {/* プレス時の深度エフェクト */}
          <div className="absolute inset-0 bg-black/10 opacity-0 active:opacity-100 transition-opacity duration-75 rounded-xl pointer-events-none"></div>
        </>
      )}

      {/* 材質別の特殊エフェクト */}
      {variant === 'steel' && architectural && (
        <div className="absolute inset-1 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[repeating-linear-gradient(45deg,_transparent,_transparent_1px,_rgba(255,255,255,0.1)_1px,_rgba(255,255,255,0.1)_2px)] rounded-lg"></div>
        </div>
      )}

      {variant === 'concrete' && architectural && (
        <div className="absolute inset-2 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_30%_40%,_rgba(0,0,0,0.2)_1px,_transparent_1px)] rounded-md" 
               style={{ backgroundSize: '8px 8px' }}></div>
        </div>
      )}
    </button>
  );
}
