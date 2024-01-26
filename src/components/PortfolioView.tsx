import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 
import StockOption from '../types/StockOption'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

const PortfolioView = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio.portfolio as StockOption[]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">My Portfolio</h2>
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
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(item => (
            <tr key={item.stockOption}>
              <td>{item.stockOption}</td>
              <td>{item.quantity}</td>
              <td>{item.position}</td>
              <td>{item.optionType}</td>
              <td>${item.strikePrice}</td>
              <td>{item.expirationDate}</td>
              <td>${item.marketPrice}</td>
              <td>{item.delta !== undefined ? item.delta.toFixed(2) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioView;
