import { ArchitecturalWork } from '../types/models';

export interface AIGeneratedNarrative {
  title: string;
  introduction: string;
  sections: AISection[];
  conclusion: string;
  isGenerating: boolean;
  error?: string;
}

export interface AISection {
  work: ArchitecturalWork;
  narrative: string;
  locationContext: string;
}

// フロントエンドアプリケーションではCORS制限によりClaude APIが使用できないため、
// 高品質なフォールバック生成のみを使用します
// AI文章生成用のプロンプト構築
function buildNarrativePrompt(works: ArchitecturalWork[], origin: string | null): string {
  const architects = [...new Set(works.map(w => w.architect))];
  const countries = [...new Set(works.map(w => w.location.country))];
  const cities = works.map(w => w.location.city);
  
  const worksDetails = works.map((work, index) => {
    return `${index + 1}. ${work.name} (${work.architect}, ${work.year}年)
   場所: ${work.location.city}, ${work.location.country}
   概要: ${work.overview}
   カテゴリー: ${work.category}
   見学時間: ${work.visitDuration}分`;
  }).join('\n\n');

  return `あなたは建築の専門家で、優れた紀行文作家です。以下の建築作品を巡る旅の紀行文を日本語で作成してください。

## 旅の基本情報
- 出発地: ${origin || '未指定'}
- 訪問作品数: ${works.length}作品
- 建築家: ${architects.join(', ')}
- 訪問国: ${countries.join(', ')}
- 訪問都市: ${cities.join(', ')}

## 訪問作品詳細
${worksDetails}

## 作成する紀行文の構成
1. **タイトル**: 魅力的で詩的な旅のタイトル（20-30文字）
2. **導入文**: 旅の魅力と意義を伝える導入（150-200文字）
3. **各作品の紀行文**: 各建築作品について、その場所の文脈と建築の魅力を描写（一つあたり120-180文字）
4. **結論**: 旅全体の感想と意義をまとめる締めくくり（150-200文字）

## 作成時のポイント
- 建築の専門的な魅力を一般の人にもわかりやすく伝える
- 各都市や国の文化的背景を織り込む
- 建築家の思想や歴史的意義を含める
- 旅行者の体験や感動を想像させる表現を使う
- 作品間の関連性や対比を意識する
- 詩的で美しい日本語を使用する

JSON形式で以下のように回答してください：
{
  "title": "旅のタイトル",
  "introduction": "導入文",
  "sections": [
    {
      "workId": "作品ID",
      "locationContext": "場所の文脈説明",
      "narrative": "作品の紀行文"
    }
  ],
  "conclusion": "結論"
}`;
}

// Anthropic Claude APIを使用して文章生成
export async function generateAINarrative(
  works: ArchitecturalWork[],
  origin: string | null
): Promise<AIGeneratedNarrative> {
  try {
    // Claude APIを使用して紀行文を生成
    const generatedContent = await generateWithClaudeAPI(works, origin);
    
    return {
      title: generatedContent.title,
      introduction: generatedContent.introduction,
      sections: generatedContent.sections,
      conclusion: generatedContent.conclusion,
      isGenerating: false
    };
  } catch (error) {
    console.error('Claude API生成に失敗しました:', error);
    
    // フォールバック: 高品質な疑似AI生成を使用
    try {
      const fallbackContent = await simulateAIGeneration(works, origin);
      return {
        title: fallbackContent.title,
        introduction: fallbackContent.introduction,
        sections: fallbackContent.sections,
        conclusion: fallbackContent.conclusion,
        isGenerating: false,
        error: 'Claude APIが利用できません。高品質フォールバック生成を使用しています。'
      };
    } catch (fallbackError) {
      console.error('フォールバック生成も失敗しました:', fallbackError);
      
      // 最終フォールバック
      return {
        title: '建築巡礼の旅',
        introduction: '素晴らしい建築作品を巡る旅が始まります...',
        sections: works.map(work => ({
          work,
          locationContext: `${work.location.city}の美しい街並みの中で`,
          narrative: `${work.architect}の「${work.name}」は、${work.year}年に完成した傑作です。${work.overview}`
        })),
        conclusion: '建築を通じて文化と歴史を学ぶ、かけがえのない旅の記憶となりました。',
        isGenerating: false,
        error: '紀行文生成に失敗しました。基本的な紀行文を表示しています。'
      };
    }
  }
}

// Anthropic Claude APIを使用して紀行文を生成
async function generateWithClaudeAPI(works: ArchitecturalWork[], origin: string | null) {
  const prompt = buildNarrativePrompt(works, origin);
  
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API キーが設定されていません。環境変数 VITE_ANTHROPIC_API_KEY を設定してください。');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'messages-2023-12-15',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Claude API エラー: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const generatedText = data.content[0].text;

  try {
    // JSON形式のレスポンスをパース
    const parsedResponse = JSON.parse(generatedText);
    
    // AIが生成したsectionsをAISection形式に変換
    const sections: AISection[] = parsedResponse.sections.map((section: any) => {
      const work = works.find(w => w.id === section.workId);
      if (!work) {
        throw new Error(`作品ID ${section.workId} が見つかりません`);
      }
      return {
        work,
        locationContext: section.locationContext,
        narrative: section.narrative
      };
    });

    return {
      title: parsedResponse.title,
      introduction: parsedResponse.introduction,
      sections,
      conclusion: parsedResponse.conclusion
    };
  } catch (parseError) {
    console.error('Claude APIレスポンスの解析に失敗しました:', parseError);
    console.error('生成されたテキスト:', generatedText);
    
    // パースに失敗した場合は、テキストから手動で抽出を試みる
    return extractNarrativeFromText(generatedText, works);
  }
}

// JSON解析に失敗した場合のフォールバック処理
function extractNarrativeFromText(text: string, works: ArchitecturalWork[]) {
  // 簡単なテキスト解析で紀行文を抽出
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    title: lines[0] || '建築巡礼の旅',
    introduction: lines[1] || 'Claude APIが生成した建築作品を巡る旅の物語です。',
    sections: works.map((work, index) => ({
      work,
      locationContext: `${work.location.city}の美しい街並みの中で`,
      narrative: lines[index + 2] || `${work.architect}の「${work.name}」は、${work.year}年に完成した傑作です。${work.overview}`
    })),
    conclusion: lines[lines.length - 1] || '建築を通じて文化と歴史を学ぶ、かけがえのない旅の記憶となりました。'
  };
}

// 高品質な紀行文生成（フォールバック用）
async function simulateAIGeneration(works: ArchitecturalWork[], origin: string | null) {
  // 実際の生成処理をシミュレート
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const architects = [...new Set(works.map(w => w.architect))];
  const countries = [...new Set(works.map(w => w.location.country))];
  
  // 動的にタイトルを生成
  const title = generateCreativeTitle(works, architects, countries);
  
  // 導入文を動的生成
  const introduction = generateCreativeIntroduction(works, origin, architects, countries);
  
  // 各作品の紀行文を生成
  const sections: AISection[] = works.map((work, index) => ({
    work,
    locationContext: generateCreativeLocationContext(work, index, works),
    narrative: generateCreativeNarrative(work, index, works)
  }));
  
  // 結論を生成
  const conclusion = generateCreativeConclusion(works, architects, countries);
  
  return {
    title,
    introduction,
    sections,
    conclusion
  };
}

function generateCreativeTitle(works: ArchitecturalWork[], architects: string[], countries: string[]): string {
  const titleVariations = [
    // ル・コルビュジエ専用タイトル
    ...(architects.length === 1 && architects[0] === 'Le Corbusier' ? [
      '光と影が織りなすル・コルビュジエの建築詩',
      '近代建築の巨匠が描いた空間の物語',
      'ル・コルビュジエと巡る建築革命の軌跡'
    ] : []),
    
    // 地域別タイトル
    ...(countries.length === 1 && countries[0] === 'France' ? [
      'フランスの大地に刻まれた建築の記憶',
      'セーヌ川から地中海へ - フランス建築紀行',
      'フランス建築の薫り高き芸術的遺産'
    ] : []),
    
    // 一般的なタイトル
    '建築巡礼 - 石に刻まれた人類の夢',
    '世界建築遺産への深い旅路',
    '建築家たちが遺した永遠の詩',
    '空間に宿る建築家の魂を求めて'
  ];
  
  return titleVariations[Math.floor(Math.random() * titleVariations.length)];
}

function generateCreativeIntroduction(works: ArchitecturalWork[], origin: string | null, architects: string[], countries: string[]): string {
  const originText = origin ? `${origin}を起点として、` : '';
  const architectText = architects.length === 1 ? architects[0] : `${architects.join('、')}ら`;
  const countryText = countries.join('、');
  
  const introductions = [
    `${originText}${countryText}に点在する${architectText}の建築作品を巡る、心揺さぶる建築巡礼の旅。${works.length}つの傑作が織りなす空間の詩に耳を傾けながら、建築が人間の精神に与える深い感動を体験する特別な旅程です。`,
    
    `${originText}建築史に名を刻む${architectText}の創造した空間を訪ね、${countryText}の風土と文化の中で育まれた建築の魅力を発見する旅。${works.length}つの建築作品が語る物語を通じて、建築家の思想と人間への深い洞察に触れることができます。`,
    
    `${originText}${countryText}の美しい景観の中に佇む${architectText}の建築群を巡り、時代を超えて愛され続ける建築の普遍的な価値を探求する知的な旅。${works.length}つの作品それぞれが持つ独特な魅力と歴史を体感できる貴重な機会です。`
  ];
  
  return introductions[Math.floor(Math.random() * introductions.length)];
}

function generateCreativeLocationContext(work: ArchitecturalWork, index: number, works: ArchitecturalWork[]): string {
  const { city, country } = work.location;
  
  const contexts = [
    `${city}の街並みに溶け込むように佇む`,
    `${country}の豊かな文化的土壌から生まれた`,
    `${city}の歴史ある街角で静かに時を刻む`,
    `${country}の美しい風景と調和する`,
    `${city}の都市生活の中に息づく`
  ];
  
  const baseContext = contexts[Math.floor(Math.random() * contexts.length)];
  
  if (index === 0) {
    return `${baseContext}この建築は、旅の始まりにふさわしい印象深い体験を提供してくれます。`;
  } else if (index === works.length - 1) {
    return `${baseContext}この建築は、建築巡礼の旅を美しく締めくくる象徴的な存在です。`;
  } else {
    return `${baseContext}この建築は、旅の中で特別な意味を持つ重要な空間体験となります。`;
  }
}

function generateCreativeNarrative(work: ArchitecturalWork, _index: number, _works: ArchitecturalWork[]): string {
  const { name, architect, year, overview, visitDuration } = work;
  
  const narratives = [
    `${architect}が${year}年に完成させた「${name}」は、${overview}約${visitDuration}分の見学を通じて、建築家の革新的な空間概念と美的感覚を深く理解することができる貴重な建築体験です。`,
    
    `${year}年、${architect}によって創造された「${name}」。${overview}${visitDuration}分という時間をかけて、建築家の思想が結晶化されたこの空間に身を委ねることで、建築の持つ精神的な力を実感できます。`,
    
    `「${name}」（${architect}、${year}年）は、${overview}訪問者は約${visitDuration}分間、建築家が織りなす光と影、空間と時間の絶妙な調和を全身で感じることができるでしょう。`
  ];
  
  return narratives[Math.floor(Math.random() * narratives.length)];
}

function generateCreativeConclusion(works: ArchitecturalWork[], architects: string[], countries: string[]): string {
  const totalDuration = works.reduce((sum, w) => sum + w.visitDuration, 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const timeText = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  
  const conclusions = [
    `${timeText}という時間をかけて巡る${architects.join('、')}の建築作品は、建築が人間の心に与える深い感動と、文化の継承における建築の重要性を教えてくれる忘れがたい旅となります。この体験を通じて得られる建築への理解と感動は、きっと日常の空間への見方を豊かに変えてくれることでしょう。`,
    
    `合計${timeText}をかけて体験するこの建築巡礼は、${countries.join('、')}の文化的遺産としての建築の価値を実感させてくれる貴重な機会です。建築家たちが遺した空間の詩は、時代を超えて私たちの心に響き続け、建築の普遍的な美しさを教えてくれます。`,
    
    `${timeText}という時間の中で出会う${works.length}つの建築作品は、それぞれが持つ独特な魅力と歴史的意義を通じて、建築芸術の深い世界へと私たちを誘います。この旅で得た感動と洞察は、建築への愛と理解をより深いものにしてくれるはずです。`
  ];
  
  return conclusions[Math.floor(Math.random() * conclusions.length)];
}