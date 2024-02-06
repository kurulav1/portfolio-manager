import  { useEffect } from 'react';
import { useDispatch, useSelector } from './store'; 
import { fetchPortfolio } from './slices/portfolioSlice';
import PortfolioView from './components/PortfolioView';
import HedgedPortfolioView from './components/HedgedPortfolioView';
import TickerSearchComponent from './components/StockOptionForm';
import LoginComponent from './components/LoginView';
import { validateToken, logoutUser } from './slices/userSlice';
import { setAuthToken } from './utils/axiosConfig';
import { PersistGate } from 'redux-persist/integration/react';
import  StatisticsView  from './components/StatisticsView'
import { persistor } from './store';
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
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem('token');
  setAuthToken(token);
  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);

  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      try {
        await dispatch(validateToken()).unwrap();
      } catch (error) {
        dispatch(logoutUser());
      }
    };
  
    if (token) {
      verifyTokenOnLoad();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isLoggedIn && user) {
      dispatch(fetchPortfolio(user.username));
    }
  }, [dispatch, isLoggedIn, user]); 

  return (
    <PersistGate loading={null} persistor={persistor}>
    <div className="container mt-4">
      <LoginComponent />
      {isLoggedIn && (
        <>
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
          <div>
            <StatisticsView />
          </div>
        </>
      )}
    </div>
    </PersistGate>
  );
}


export default App;