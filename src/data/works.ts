import { csvParse, DSVRowString } from 'd3-dsv';
import { ArchitecturalWork } from '../types/models';
import worksCsv from './works.csv?raw';

// Eagerly import all images in this directory (jpg/png/webp) so Vite returns their resolved URLs
// The key is the relative path, e.g. '../data/images/villa_savoye.jpg'
// We convert it to the basename (without extension) to match the "id" field in CSV
const imageModules = import.meta.glob('../data/images/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }) as Record<string, string>;

const imageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(imageModules)) {
  const filename = path.split('/').pop()!;
  const id = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  imageMap[id] = url;
}

// --- CSV → ArchitecturalWork[] ------------------------------
const rows: DSVRowString[] = csvParse(worksCsv.trim());

export const works: ArchitecturalWork[] = rows.map(r => ({
  id: r.id!,
  name: r.name!,
  architect: r.architect!,
  year: Number(r.year),
  location: {
    lat: Number(r.lat),
    lng: Number(r.lng),
    address: r.address!,
    city: r.city!,
    country: r.country!,
  },
  description: r.description!,
  overview: r.overview!,
  imageUrl: imageMap[r.id as string] ?? '',
  visitDuration: Number(r.visitDuration),
  category: r.category!,
}));

export const worksMap: Record<string, ArchitecturalWork> = Object.fromEntries(
  works.map(w => [w.id, w]),
);