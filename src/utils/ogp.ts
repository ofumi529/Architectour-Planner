import { ArchitecturalWork } from '../types/models';

interface OGPData {
  title: string;
  description: string;
  image?: string;
}

export function updateOGP(data: OGPData): void {
  // Update title
  document.title = data.title;
  
  // Update or create meta tags
  updateMetaTag('description', data.description);
  updateMetaTag('og:title', data.title, 'property');
  updateMetaTag('og:description', data.description, 'property');
  updateMetaTag('twitter:title', data.title, 'property');
  updateMetaTag('twitter:description', data.description, 'property');
  
  if (data.image) {
    updateMetaTag('og:image', data.image, 'property');
    updateMetaTag('twitter:image', data.image, 'property');
  }
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

export function generateRouteOGP(works: ArchitecturalWork[], origin?: string): OGPData {
  const workNames = works.slice(0, 3).map(w => w.name);
  const remainingCount = Math.max(0, works.length - 3);
  
  let title = 'Architectour Planner';
  let description = '建築巨匠の傑作を巡る旅をプランニング';
  
  if (works.length > 0) {
    title = `${workNames.join('・')}${remainingCount > 0 ? `他${remainingCount}作品` : ''}を巡る建築ツアー | Architectour Planner`;
    
    const architects = [...new Set(works.map(w => w.architect))].slice(0, 3);
    const countries = [...new Set(works.map(w => w.location.country))].slice(0, 3);
    
    description = [
      `${workNames.join('、')}${remainingCount > 0 ? `など${works.length}作品` : ''}を効率的に巡る建築ツアープラン。`,
      architects.length > 0 ? `${architects.join('、')}の名作建築を訪問。` : '',
      countries.length > 0 ? `${countries.join('・')}での建築巡礼。` : '',
      origin ? `${origin}発の最適ルートで、AI生成の旅行紀行文付き。` : 'AI生成の旅行紀行文付き。'
    ].filter(Boolean).join('');
  }
  
  return { title, description };
}

export function generateNarrativeOGP(title: string, introduction: string): OGPData {
  return {
    title: `${title} | Architectour Planner`,
    description: introduction.slice(0, 150) + (introduction.length > 150 ? '...' : '')
  };
}

// URL パラメータから共有データを読み取り、OGPを更新
export function updateOGPFromURL(): void {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    
    if (sharedData) {
      const decoded = JSON.parse(atob(sharedData));
      
      if (decoded.selectedIds && decoded.selectedIds.length > 0) {
        // 共有されたルートのOGPを設定
        // 注: 実際の作品データは別途取得が必要
        const ogpData = {
          title: `建築ツアープラン（${decoded.selectedIds.length}作品）| Architectour Planner`,
          description: `${decoded.selectedIds.length}つの名建築を巡る効率的な旅行プランをチェック。${decoded.origin ? `${decoded.origin}発の` : ''}最適ルートで建築巡礼を体験。`
        };
        
        updateOGP(ogpData);
      }
    }
  } catch (error) {
    console.error('Failed to update OGP from URL:', error);
  }
}