import { Tooltip, Download } from './Icons';
import { accentBg, type } from '../data';

const TabsBar = ({ activeTab, onTabClick }) => (
  <div className="ferma-tabs-bar mt-3 px-6 flex-shrink-0">
    <div className="h-12 flex items-center justify-between">
      <div className="tabs-container flex items-center gap-1">
        {['Exec Summary', 'Trials'].map((tab, index) => {
          const tabKey = tab === 'Exec Summary' ? 'exec' : 'data';
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tab}
              onClick={() => onTabClick(tabKey, index)}
              className={`tab-button relative h-7 px-3 rounded font-medium transition-colors ${isActive ? 'text-white' : 'text-black hover:bg-black/5'}`}
              style={{ ...(isActive ? accentBg : {}), ...type.small }}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="search-container flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="search-input h-8 w-40 px-3 border border-black/20 rounded text-black placeholder-black/40 focus:outline-none focus:border-violet-400"
          style={type.small}
        />
        <Tooltip label="Export report">
          <button className="h-8 w-8 flex items-center justify-center text-black hover:bg-black/5 rounded">
            <Download size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  </div>
);

export default TabsBar;
