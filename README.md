# Portfolio Manager
This app allows for creating a simulated portfolio of stock options, as well as applying hedging strategies to the portfolio.

### Current Features:
Access to Yahoo Finance for updated stock option data.
Allows searching for tickers and associated options of varying maturities and strike prices.
Allows for portfolio rebalancing using delta hedging.
User Interface for said actions.
Database for persistence.
### Planned Features:
More forms of analytics and hedging strategies, such as delta-vega hedging, risk-modelling, statistical summaries.
Improved UI.
Proper authentication and personal accounts.
Multiple portfolios.
# Architecture
### Frontend and UI
The app uses the React framework with TypeScript for implementation of the web-based user interface. The UI is 
styled with Boostrap and features Redux state management. The frontend is deployed using the Azure Static Web App service and features continuous integration utilizing a GitHub repository.
### Backend
For backend, the Node.js Express framework is used, along with Redis caching. The backend is hosted as an Azure standard Web App.

The backend code is available at:
https://github.com/kurulav1/portfolio-manager-backend

### Database
The database used is PostgresSQL hosted using Azure databases. 
### Data Microservice
A data microservice, mainly for interacting with Yahoo! Finance, in order to get up-to-date data about stock options and treasury yields. The app is written with Python and uses Flask for handling requests. Deployment is done using a Docker container along with Azure Container Instances and GitHub continuous integration (CI).

The service code is available at:

https://github.com/kurulav1/portfolio-data-service

### Analytics Microservice
Microservice for enabling specific calculations, currently the Black-Scholes Delta. Like the data microservice, this is also a Python app using Flask, Docker and Azure Container Instances. 

The service code is available at:

https://github.com/kurulav1/portfolio-analysis-service
