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

  constructor(
    stockOption: string, 
    quantity: number, 
    position: PositionType, 
    optionType: OptionType, 
    strikePrice: number, 
    expirationDate: string, 
    marketPrice: number,
    delta?: number 
  ) {
    this.stockOption = stockOption;
    this.quantity = quantity;
    this.position = position;
    this.optionType = optionType;
    this.strikePrice = strikePrice;
    this.expirationDate = expirationDate;
    this.marketPrice = marketPrice;
    if (delta !== undefined) {
    this.delta = delta; 
    }
  }

  displayInfo(): string {
    const deltaDisplay = this.delta !== undefined ? `Delta: ${this.delta.toFixed(2)}` : 'Delta: N/A';
    return `${this.quantity} contracts of ${this.stockOption}, Position: ${this.position}, Type: ${this.optionType}, ` +
           `Strike Price: $${this.strikePrice}, Expiration Date: ${this.expirationDate}, ` +
           `Market Price: $${this.marketPrice}, ${deltaDisplay}`;
  }
}

export default StockOption;
