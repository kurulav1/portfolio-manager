type PositionType = 'long' | 'short'; 
type OptionType = 'call' | 'put'; 

class StockOption {
  stockOption: string;
  quantity: number;
  position: PositionType;
  optionType: OptionType;
  strikePrice: number;
  expirationDate: string; 
  marketPrice: number;
  delta?: number; 
  impliedVolatility?: number; 

  constructor(
    stockOption: string, 
    quantity: number, 
    position: PositionType, 
    optionType: OptionType, 
    strikePrice: number, 
    expirationDate: string, 
    marketPrice: number,
    delta?: number, 
    impliedVolatility?: number 
  ) {
    this.stockOption = stockOption;
    this.quantity = quantity;
    this.position = position;
    this.optionType = optionType;
    this.strikePrice = strikePrice;
    this.expirationDate = expirationDate;
    this.marketPrice = marketPrice;
    this.delta = delta; 
    this.impliedVolatility = impliedVolatility; 
  }

  displayInfo(): string {
    const deltaDisplay = this.delta !== undefined ? `Delta: ${this.delta.toFixed(2)}` : 'Delta: N/A';
    const volatilityDisplay = this.impliedVolatility !== undefined ? `Implied Volatility: ${this.impliedVolatility.toFixed(2)}` : 'Implied Volatility: N/A';
    return `${this.quantity} contracts of ${this.stockOption}, Position: ${this.position}, Type: ${this.optionType}, ` +
           `Strike Price: $${this.strikePrice}, Expiration Date: ${this.expirationDate}, ` +
           `Market Price: $${this.marketPrice}, ${deltaDisplay}, ${volatilityDisplay}`;
  }
}

export default StockOption;
