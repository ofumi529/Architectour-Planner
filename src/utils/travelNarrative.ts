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
  
  const title = generateDynamicTitle(works, architects, countries);
  const introduction = generateDynamicIntroduction(works, origin, architects, countries);
  const sections = works.map((work, index) => generateDynamicSection(work, index, works));
  const conclusion = generateDynamicConclusion(works, architects, countries);

  return {
    title,
    introduction,
    sections,
    conclusion
  };
}

function generateDynamicTitle(works: ArchitecturalWork[], architects: string[], countries: string[]): string {
  // ル・コルビュジエ専用の旅程
  if (architects.length === 1 && architects[0] === 'Le Corbusier') {
    if (countries.includes('France') && countries.includes('India')) {
      return '東西を結ぶル・コルビュジエの建築思想';
    } else if (countries.length === 1 && countries[0] === 'France') {
      return 'フランスに花開いたル・コルビュジエの革新';
    } else {
      return 'ル・コルビュジエが描いた新しい建築言語';
    }
  }

  // 複数建築家の組み合わせ
  if (architects.includes('Le Corbusier') && architects.includes('Ludwig Mies van der Rohe')) {
    return 'モダニズムの巨匠たちが築いた建築革命';
  }

  // 地域別の特色
  if (countries.length === 1) {
    const countryTitles: Record<string, string> = {
      'France': 'フランス建築の至宝を辿る旅',
      'USA': 'アメリカに根付いた建築の革新',
      'Germany': 'ドイツが生んだ建築の精神',
      'Japan': '日本の現代建築を巡る探求'
    };
    return countryTitles[countries[0]] || `${countries[0]}建築巡礼`;
  }

  // 作品の特徴による分類
  const hasReligious = works.some(w => w.category === 'Religious');
  const hasResidential = works.some(w => w.category === 'Residential');
  
  if (hasReligious && hasResidential) {
    return '聖なる空間から生活空間へ - 建築の多様性を巡る旅';
  } else if (hasReligious) {
    return '建築に宿る神聖な光と影';
  }

  return '世界建築遺産への巡礼';
}

function generateDynamicIntroduction(
  works: ArchitecturalWork[],
  origin: string | null,
  architects: string[],
  countries: string[]
): string {
  const originText = origin ? `${origin}を起点として、` : '';
  
  // ル・コルビュジエ単独の場合
  if (architects.length === 1 && architects[0] === 'Le Corbusier') {
    const religiousWorks = works.filter(w => w.category === 'Religious');
    const residentialWorks = works.filter(w => w.category === 'Residential');
    
    if (religiousWorks.length > 0 && residentialWorks.length > 0) {
      return `${originText}20世紀建築の巨匠ル・コルビュジエが残した${works.length}つの傑作を巡る特別な旅程です。` +
             `祈りの空間から日常の住まいまで、建築家の探求心が生み出した多様な空間体験を通じて、` +
             `モダニズム建築の真髄と、人間の暮らしに対する深い洞察を感じ取ることができるでしょう。`;
    }
    
    return `${originText}近代建築の父と呼ばれるル・コルビュジエの建築哲学を、` +
           `${countries.join('、')}に点在する${works.length}つの作品を通じて体験する知的な旅です。` +
           `「建築は住むための機械である」という革新的な思想から生まれた空間の数々が、` +
           `私たちの建築に対する理解を根底から変えてくれることでしょう。`;
  }

  // 複数建築家の場合
  if (architects.length > 1) {
    const worksDescription = works.length <= 3 ? '厳選された傑作' : '多彩な建築群';
    return `${originText}建築史に名を刻む${architects.join('、')}の${worksDescription}を巡る、` +
           `${countries.join('、')}に広がる建築巡礼の旅。それぞれの建築家が追求した美学と技術革新が、` +
           `時代と地域を超えて私たちに語りかける物語を、実際の空間体験を通じて紐解いていきます。`;
  }

  // 地域集中型の場合
  if (countries.length === 1) {
    const countryDescriptions: Record<string, string> = {
      'France': 'フランス建築の洗練された美意識と革新精神',
      'USA': 'アメリカの大地に根ざした建築の力強さ',
      'Germany': 'ドイツの論理的思考が生んだ建築の純粋性',
      'Japan': '日本の繊細な美意識と現代技術の融合'
    };
    
    const countryDesc = countryDescriptions[countries[0]] || `${countries[0]}独自の建築文化`;
    return `${originText}${countryDesc}を体現する${works.length}つの建築作品を巡る深い探求の旅。` +
           `各建築が持つ独自の空間言語と文化的背景を理解することで、` +
           `建築が社会や人間の生活に与える影響の大きさを実感していただけるでしょう。`;
  }

  return `${originText}世界各地に散らばる建築の宝石を巡る、知的好奇心を満たす特別な旅程です。`;
}

function generateDynamicSection(work: ArchitecturalWork, index: number, allWorks: ArchitecturalWork[]): TravelSection {
  const isFirst = index === 0;
  const isLast = index === allWorks.length - 1;
  const previousWork = index > 0 ? allWorks[index - 1] : null;
  const nextWork = index < allWorks.length - 1 ? allWorks[index + 1] : null;

  const locationContext = generateContextualLocation(work, previousWork, nextWork);
  const narrative = generateContextualNarrative(work, index, allWorks, isFirst, isLast);

  return {
    work,
    narrative,
    locationContext
  };
}

function generateContextualLocation(
  work: ArchitecturalWork,
  previousWork: ArchitecturalWork | null,
  nextWork: ArchitecturalWork | null
): string {
  const { city, country } = work.location;
  
  // 都市の詳細な文脈情報
  const cityContexts: Record<string, string> = {
    'Paris': 'セーヌ川の流れる芸術の都パリ。歴史と現代が調和する街角で',
    'Poissy': 'パリ郊外の緑豊かな住宅地ポワシー。都市の喧騒から離れた静寂の中で',
    'Marseille': '地中海の青い海を望む港湾都市マルセイユ。南仏の強い陽光の下で',
    'Ronchamp': 'フランス東部の丘陵地帯ロンシャン。深い森に囲まれた小さな村で',
    'Chandigarh': 'インド北部の計画都市チャンディーガル。新しい国家の理想が込められた街で',
    'Cambridge': 'アメリカ東海岸の学術都市ケンブリッジ。知性と伝統が息づくハーバード大学で',
    'Firminy': 'フランス中部の工業都市フィルミニー。労働者の街に建つ象徴的な建築として',
    'La Plata': 'ブエノスアイレス近郊の学術都市ラ・プラタ。南米の風土に根ざした建築として'
  };

  const baseContext = cityContexts[city] || `${city}の街に位置する`;
  
  // 前後の作品との関連性
  if (previousWork && previousWork.location.country !== country) {
    return `${baseContext}、前の訪問地とは異なる文化圏で新たな建築体験が始まります。`;
  } else if (nextWork && nextWork.location.country !== country) {
    return `${baseContext}、この地域での最後の建築探訪となります。`;
  }
  
  return `${baseContext}、この建築が周囲の環境と織りなす独特な関係を体感することができます。`;
}

function generateContextualNarrative(
  work: ArchitecturalWork,
  index: number,
  allWorks: ArchitecturalWork[],
  isFirst: boolean,
  isLast: boolean
): string {
  const { name, architect, year, overview, category, visitDuration } = work;
  
  let narrativeStart = '';
  
  if (isFirst) {
    narrativeStart = `旅の始まりを飾るのは、${architect}の「${name}」（${year}年）です。`;
  } else if (isLast) {
    narrativeStart = `この建築巡礼の旅を締めくくるのは、${architect}の「${name}」（${year}年）。`;
  } else {
    const previousWork = allWorks[index - 1];
    if (previousWork.architect === architect) {
      narrativeStart = `同じ${architect}の手による「${name}」（${year}年）では、`;
    } else {
      narrativeStart = `続いて訪れる${architect}の「${name}」（${year}年）は、`;
    }
  }

  // 作品の特徴に応じた記述
  let workDescription = '';
  if (category === 'Religious') {
    workDescription = `${overview}この聖なる空間では、建築が人間の精神性といかに深く結びついているかを実感できます。`;
  } else if (category === 'Residential') {
    workDescription = `${overview}住まいという最も身近な建築を通じて、建築家の人間への深い眼差しを感じ取ることができます。`;
  } else if (category === 'Educational') {
    workDescription = `${overview}学びの場として設計されたこの建築は、知識の創造と伝承における空間の役割を教えてくれます。`;
  } else {
    workDescription = `${overview}この建築が持つ独特な空間性が、私たちの建築に対する理解を一層深めてくれるでしょう。`;
  }

  const visitTimeContext = visitDuration >= 60 
    ? `じっくりと時間をかけて（約${visitDuration}分）、` 
    : `短時間の見学（約${visitDuration}分）でも、`;

  return `${narrativeStart}${workDescription}${visitTimeContext}建築家の創造した空間言語を全身で体験することができます。`;
}

function generateDynamicConclusion(
  works: ArchitecturalWork[],
  architects: string[],
  countries: string[]
): string {
  const totalDuration = works.reduce((sum, w) => sum + w.visitDuration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const timeText = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  
  // ル・コルビュジエ専用の結論
  if (architects.length === 1 && architects[0] === 'Le Corbusier') {
    return `合計${timeText}をかけて巡るル・コルビュジエの${works.length}つの建築作品は、` +
           `20世紀建築革命の軌跡を物語る貴重な体験となります。` +
           `「光と影」「空間と時間」「人間と建築」の関係を探求し続けた建築家の精神が、` +
           `現代を生きる私たちに建築の本質的な価値を教えてくれるでしょう。` +
           `この旅で得た感動と洞察は、きっと日常の空間への見方を豊かに変えてくれるはずです。`;
  }

  // 複数建築家の場合
  if (architects.length > 1) {
    return `${timeText}という時間をかけて巡る${architects.join('、')}の建築群は、` +
           `それぞれの建築家が追求した美学と哲学の多様性を物語る知的な旅となります。` +
           `異なる時代、異なる文化背景から生まれた建築作品が織りなす対話を通じて、` +
           `建築の普遍的な価値と時代性の両方を深く理解することができるでしょう。`;
  }

  // 地域集中型の場合
  if (countries.length === 1) {
    const countryConclusions: Record<string, string> = {
      'France': 'フランス建築の洗練された美意識と革新精神の継承',
      'USA': 'アメリカの大地に根ざした建築文化の独自性',
      'Germany': 'ドイツの論理的思考が生んだ建築の純粋性',
      'Japan': '日本の繊細な美意識と現代技術の見事な融合'
    };
    
    const countrySpirit = countryConclusions[countries[0]] || `${countries[0]}建築文化の深さ`;
    return `${timeText}をかけて体験する${countries[0]}の建築巡礼は、${countrySpirit}を実感する貴重な機会となります。` +
           `建築を通じて文化の本質に触れることで、私たちの世界観がより豊かになることでしょう。`;
  }

  return `${timeText}という時間をかけて巡る世界の建築遺産は、人類の創造力の偉大さを実感させてくれる特別な体験となります。` +
         `建築を通じて文化と歴史を学び、未来への想像力を育む、かけがえのない旅の記憶として心に刻まれることでしょう。`;
}