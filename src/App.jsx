import React, { useState } from 'react';
import { AccountProvider } from './context/AccountContext';
import { FraudEngineProvider } from './context/FraudEngineContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AccountOverview } from './components/overview/AccountOverview';
import { FundTransfer } from './components/transfer/FundTransfer';
import { FraudWatchRules } from './components/fraud/FraudWatchRules';
import { StatementsAnalytics } from './components/statements/StatementsAnalytics';

export const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AccountOverview onNavigateToTransfer={() => setActiveTab('transfer')} />;
      case 'transfer':
        return <FundTransfer />;
      case 'fraud-watch':
        return <FraudWatchRules />;
      case 'statements':
        return <StatementsAnalytics />;
      default:
        return <AccountOverview onNavigateToTransfer={() => setActiveTab('transfer')} />;
    }
  };

  return (
    <AccountProvider>
      <FraudEngineProvider>
        <div className="app-container">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="main-content">
            <Navbar />
            <main className="content-body">
              {renderContent()}
            </main>
          </div>
        </div>
      </FraudEngineProvider>
    </AccountProvider>
  );
};

export default App;
