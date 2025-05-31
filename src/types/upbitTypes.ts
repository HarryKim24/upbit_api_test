export interface MarketItem {
  market: string;
  korean_name: string;
  english_name: string;
  market_event?: {
    warning: boolean;
    caution: {
      PRICE_FLUCTUATIONS: boolean;
      TRADING_VOLUME_SOARING: boolean;
      DEPOSIT_AMOUNT_SOARING: boolean;
      GLOBAL_PRICE_DIFFERENCES: boolean;
      CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
    }
  }
}

export interface TickerItem {
  market: string;
  trade_price: number;
  change: "RISE" | "FALL" | "EVEN";
  change_rate: number;
}