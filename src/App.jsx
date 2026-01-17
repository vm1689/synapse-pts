import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import PlanSidebar from './components/PlanSidebar';
import DataTable from './components/DataTable';

function App() {
  const [planCollapsed, setPlanCollapsed] = useState(false);

  return (
    <DataProvider>
      <div
        className="ferma-app-container h-full flex flex-col"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Header />

      <div className="ferma-main-layout flex flex-1 overflow-hidden">
        <PlanSidebar
          planCollapsed={planCollapsed}
          setPlanCollapsed={setPlanCollapsed}
        />

        <div className="ferma-content-area flex-1 pl-3 overflow-hidden">
          <div className="h-full rounded-tl-2xl shadow-lg flex overflow-hidden" style={{ background: '#FFFFFF' }}>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <div className="ferma-article-content flex-1 overflow-auto px-8 py-6">
                <DataTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DataProvider>
  );
}

export default App;
