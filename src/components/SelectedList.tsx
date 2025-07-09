import { useSelection } from '../context/SelectionContext';
import { useTranslation } from 'react-i18next';

export default function SelectedList() {
  const { selected } = useSelection();
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="font-semibold mb-2 text-lg">{t('Selected Works')}</h2>
      {selected.length === 0 ? (
        <p className="text-sm text-gray-500">{t('No work selected')}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {selected.map((w) => (
            <li key={w.id}>{w.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
