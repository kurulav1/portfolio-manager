import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import { RootState } from '../store';
import { calculateDelta } from '../slices/deltaSlice';
import StockOption from '../types/StockOption';

interface DeltaCalculationComponentProps {
  stockOption?: StockOption;
}

const DeltaCalculationComponent: React.FC<DeltaCalculationComponentProps> = ({ stockOption }) => {
  const dispatch = useDispatch();
  const { deltaValue, loading, error } = useSelector((state: RootState) => state.delta);

  useEffect(() => {
    if (stockOption) {
      
      const impliedVolatility = stockOption.impliedVolatility?.toString();

      if (impliedVolatility !== undefined) {
        
        const deltaParams = {
          S: stockOption.marketPrice.toString(),
          K: stockOption.strikePrice.toString(),
          T: calculateTimeToExpiration(stockOption.expirationDate).toString(),
          r: '0.05', 
          v: impliedVolatility, 
          type: stockOption.optionType
        };

        
        dispatch(calculateDelta(deltaParams));
      }
    }
  }, [dispatch, stockOption]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {deltaValue !== null && <p>Delta: {deltaValue}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

function calculateTimeToExpiration(expirationDate: string): number {
  const expiration = new Date(expirationDate);
  const now = new Date();
  const millisecondsPerYear = 31557600000;

  
  return (expiration.getTime() - now.getTime()) / millisecondsPerYear;
}

export default DeltaCalculationComponent;