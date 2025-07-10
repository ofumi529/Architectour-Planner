interface RateLimitData {
  count: number;
  resetTime: number;
}

const STORAGE_KEY = 'narrative_generation_limit';
const MAX_GENERATIONS_PER_DAY = 5; // 1日5回まで
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24時間

export class NarrativeRateLimiter {
  private static getData(): RateLimitData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { count: 0, resetTime: Date.now() + RESET_INTERVAL };
      }
      
      const data: RateLimitData = JSON.parse(stored);
      
      // 時間がリセットされていればカウンターをリセット
      if (Date.now() > data.resetTime) {
        return { count: 0, resetTime: Date.now() + RESET_INTERVAL };
      }
      
      return data;
    } catch (error) {
      console.error('Rate limiter storage error:', error);
      return { count: 0, resetTime: Date.now() + RESET_INTERVAL };
    }
  }

  private static setData(data: RateLimitData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Rate limiter storage error:', error);
    }
  }

  /**
   * 紀行文生成が可能かチェック
   */
  static canGenerate(): boolean {
    const data = this.getData();
    return data.count < MAX_GENERATIONS_PER_DAY;
  }

  /**
   * 紀行文生成回数をインクリメント
   */
  static incrementUsage(): void {
    const data = this.getData();
    data.count += 1;
    this.setData(data);
  }

  /**
   * 残り生成可能回数を取得
   */
  static getRemainingCount(): number {
    const data = this.getData();
    return Math.max(0, MAX_GENERATIONS_PER_DAY - data.count);
  }

  /**
   * リセット時間までの残り時間（ミリ秒）
   */
  static getTimeUntilReset(): number {
    const data = this.getData();
    return Math.max(0, data.resetTime - Date.now());
  }

  /**
   * リセット時間を人間が読める形式で取得
   */
  static getResetTimeFormatted(): string {
    const resetTime = this.getTimeUntilReset();
    const hours = Math.floor(resetTime / (1000 * 60 * 60));
    const minutes = Math.floor((resetTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}時間${minutes}分後`;
    } else {
      return `${minutes}分後`;
    }
  }

  /**
   * 使用状況の概要を取得
   */
  static getUsageStatus(): {
    canGenerate: boolean;
    remaining: number;
    used: number;
    resetTime: string;
  } {
    return {
      canGenerate: this.canGenerate(),
      remaining: this.getRemainingCount(),
      used: this.getData().count,
      resetTime: this.getResetTimeFormatted()
    };
  }
}