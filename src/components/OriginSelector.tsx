import { useTranslation } from 'react-i18next';
import { countryCenters } from '../data/countryCenters';

interface Props {
  value: string | null;
  onChange: (country: string | null) => void;
}

export default function OriginSelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="architectural-select-frame">
      <select
        className="architectural-select min-w-[180px]"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{t('Select Origin')}</option>
        {Object.keys(countryCenters).map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      
      {/* 建築的装飾要素 */}
      <div className="absolute inset-0 pointer-events-none rounded-xl">
        {/* 角の装飾 */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-white/20"></div>
        <div className="absolute top-1 right-8 w-3 h-3 border-t border-r border-white/20"></div>
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-white/20"></div>
        <div className="absolute bottom-1 right-8 w-3 h-3 border-b border-r border-white/20"></div>
      </div>
    </div>
  );
}
