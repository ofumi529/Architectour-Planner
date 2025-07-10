interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: Props) {
  return (
    <div className={`glass-card rounded-xl p-6 architectural-transition construct-in relative overflow-hidden ${className}`}>
      {title && (
        <h3 className="font-bold mb-3 text-sm font-display tracking-wide text-slate-800 relative z-10">
          {title}
        </h3>
      )}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 建築的な装飾線 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
    </div>
  );
}
