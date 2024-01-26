import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import { RootState } from '../store';
import { fetchHedgedPortfolio } from '../slices/hedgedPortfolioSlice';
import StockOption from '../types/StockOption';
import 'bootstrap/dist/css/bootstrap.min.css';

const HedgedPortfolioView = () => {
  const dispatch = useDispatch();
  const hedgedPortfolio = useSelector((state: RootState) => state.hedgedPortfolio.hedgedPortfolio as StockOption[]);

  useEffect(() => {
    dispatch(fetchHedgedPortfolio('test')); 
  }, [dispatch]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">My Hedged Portfolio</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Stock Option</th>
            <th>Quantity</th>
            <th>Position</th>
            <th>Type</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
            <th>Market Price</th>
          </tr>
        </thead>
        <tbody>
          {hedgedPortfolio.map(item => (
            <tr key={item.stockOption}>
              <td>{item.stockOption}</td>
              <td>{item.quantity}</td>
              <td>{item.position}</td>
              <td>{item.optionType}</td>
              <td>${item.strikePrice}</td>
              <td>{item.expirationDate}</td>
              <td>${item.marketPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HedgedPortfolioView;
