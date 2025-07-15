import { ArchitecturalWork } from '../types/models';
import { useSelection } from '../context/SelectionContext';

interface Props {
  works: ArchitecturalWork[];
}

export default function PhotoSelector({ works }: Props) {
  const { selected, toggleSelection } = useSelection();

  return (
    <div className="min-h-full p-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 bg-neutral-50">
      {works.map((w) => {
        const active = !!selected.find(s=>s.id===w.id);
        return (
          <figure
            key={w.id}
            onClick={() => toggleSelection(w)}
            className={`cursor-pointer rounded shadow-sm transition-all duration-200 border-4 ${active ? 'border-amber-600 scale-105' : 'border-transparent hover:border-amber-400 hover:scale-105'}`}
          >
            <img
              src={w.imageUrl}
              alt={w.name}
              className="w-full h-40 object-cover grayscale group-hover:grayscale-0 rounded-t"
            />
            <figcaption className="text-center text-xs mt-1 font-serif">{w.name}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
