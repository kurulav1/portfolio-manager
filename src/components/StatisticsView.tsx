import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store'; 
import { fetchDeltaExposure, fetchPerformanceComparison, fetchPortfolioValue } from '../slices/statisticsSlice';

import 'bootstrap/dist/css/bootstrap.min.css'; 

const StatisticsView = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { deltaExposure, performanceComparison, portfolioValue } = useSelector((state: RootState) => state.portfolioStats);
  
    useEffect(() => {
      if (user && user.username) {
        dispatch(fetchDeltaExposure(user.username));
        dispatch(fetchPerformanceComparison(user.username));
        dispatch(fetchPortfolioValue(user.username));
      }
    }, [dispatch, user]);

    
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Portfolio Statistics</h2>

      <div className="statistics">
        {deltaExposure !== null && (
          <div className="mb-3">
            <label className="font-semibold">Delta Exposure:</label>
            <span> {deltaExposure.toFixed(2)}</span>
          </div>
        )}

        {performanceComparison && (
          <div className="mb-3">
            <label className="font-semibold">Performance Comparison:</label>
            <div>Unhedged Portfolio Value: ${performanceComparison.portfolioValue?.toFixed(2)}</div>
            <div>Hedged Portfolio Value: ${performanceComparison.hedgedPortfolioValue?.toFixed(2)}</div>
            <div>Performance Difference: ${performanceComparison.performanceDifference?.toFixed(2)}</div>
          </div>
        )}

        {portfolioValue !== null && (
          <div className="mb-3">
            <label className="font-semibold">Total Portfolio Value:</label>
            <span> ${portfolioValue.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsView;
