import { ArchitecturalWork } from '../types/models';

export interface TravelNarrative {
  title: string;
  introduction: string;
  sections: TravelSection[];
  conclusion: string;
}

export interface TravelSection {
  work: ArchitecturalWork;
  narrative: string;
  locationContext: string;
}

export function generateTravelNarrative(
  works: ArchitecturalWork[],
  origin: string | null
): TravelNarrative {
  if (works.length === 0) {
    return {
      title: '建築巡礼への旅',
      introduction: '素晴らしい建築作品を巡る旅が始まります。',
      sections: [],
      conclusion: '建築との出会いは、新たな発見への扉を開きます。'
    };
  }

  const architects = [...new Set(works.map(w => w.architect))];
  const countries = [...new Set(works.map(w => w.location.country))];
  const totalDuration = works.reduce((sum, w) => sum + w.visitDuration, 0);

  const title = generateTitle(architects, countries);
  const introduction = generateIntroduction(works, origin, architects, countries);
  const sections = works.map(generateSection);
  const conclusion = generateConclusion(works, totalDuration, architects);

  return {
    title,
    introduction,
    sections,
    conclusion
  };
}

function generateTitle(architects: string[], countries: string[]): string {
  if (architects.length === 1) {
    return `${architects[0]}の建築世界を巡る旅`;
  } else if (countries.length === 1) {
    return `${countries[0]}の巨匠建築巡礼`;
  } else {
    return `世界の巨匠建築を巡る旅`;
  }
}

function generateIntroduction(
  works: ArchitecturalWork[],
  origin: string | null,
  architects: string[],
  countries: string[]
): string {
  const originText = origin ? `${origin}を出発点として、` : '';
  const architectText = architects.length === 1 
    ? `${architects[0]}の傑作` 
    : `${architects.join('、')}らの名建築`;
  const countryText = countries.length === 1 
    ? `${countries[0]}` 
    : `${countries.join('、')}`;

  return `${originText}${countryText}に点在する${architectText}を巡る建築巡礼の旅。` +
         `現代建築の巨匠たちが残した${works.length}つの傑作を通じて、` +
         `建築の本質と空間の魅力を体感する特別な旅程をご案内します。`;
}

function generateSection(work: ArchitecturalWork): TravelSection {
  const locationContext = generateLocationContext(work);
  const narrative = generateWorkNarrative(work);

  return {
    work,
    narrative,
    locationContext
  };
}

function generateLocationContext(work: ArchitecturalWork): string {
  const { city, country } = work.location;
  
  // 都市別の文脈情報を生成
  const cityContexts: Record<string, string> = {
    'Paris': 'パリの洗練された街並みの中に佇む',
    'Poissy': 'パリ郊外の静かな住宅地に位置する',
    'Marseille': '地中海を望む南仏の港湾都市に建つ',
    'Ronchamp': 'フランス東部の丘陵地帯に聳える',
    'Chandigarh': 'インド北部の計画都市の中心に位置する',
    'Cambridge': 'ハーバード大学のキャンパス内に建つ',
    'Firminy': 'フランス中部の工業都市に完成した',
    'La Plata': 'ブエノスアイレス近郊の学術都市に建つ'
  };

  const defaultContext = `${city}の街に建つ`;
  const context = cityContexts[city] || defaultContext;
  
  return `${context}この建築は、${country}の建築文化における重要な位置を占めています。`;
}

function generateWorkNarrative(work: ArchitecturalWork): string {
  const { name, architect, year, overview, category, visitDuration } = work;
  
  const categoryDescriptions: Record<string, string> = {
    'Residential': '住宅建築として',
    'Religious': '宗教建築として',
    'Educational': '教育施設として',
    'Government': '政府施設として'
  };

  const categoryText = categoryDescriptions[category] || '';
  const visitText = `約${visitDuration}分の見学時間で`;

  return `${architect}が${year}年に完成させた「${name}」は、${categoryText}建築史に燦然と輝く傑作です。` +
         `${overview} ` +
         `${visitText}、建築家の空間哲学と技術革新の結晶を体験することができます。`;
}

function generateConclusion(
  works: ArchitecturalWork[],
  totalDuration: number,
  architects: string[]
): string {
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const timeText = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  
  const architectText = architects.length === 1 
    ? `${architects[0]}の建築世界` 
    : '巨匠たちの創造';

  return `この建築巡礼の旅は、合計${timeText}をかけて${works.length}つの傑作を巡る特別な体験となります。` +
         `${architectText}に触れることで、建築が持つ普遍的な美と、` +
         `空間が人間に与える感動の深さを再発見していただけることでしょう。` +
         `各建築との出会いが、あなたの建築への理解をより豊かなものにしてくれるはずです。`;
}