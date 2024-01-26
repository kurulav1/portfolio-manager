import React, { useEffect, useState, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from './store'; 
import { fetchPortfolio } from './slices/portfolioSlice';
import PortfolioView from './components/PortfolioView';
import HedgedPortfolioView from './components/HedgedPortfolioView';
import TickerSearchComponent from './components/StockOptionForm';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          <TickerSearchComponent />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <PortfolioView />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          <HedgedPortfolioView />
        </div>
      </div>

    </div>
  );
}


export default App;