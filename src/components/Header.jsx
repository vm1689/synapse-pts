import { SynapseLogo, RefreshIcon, Tooltip } from './Icons';
import { type, accentBg } from '../data';
import { useData } from '../context/DataContext';

const Header = () => {
  const {
    lastRefreshed,
    isBase,
    isRefreshing,
    refreshProgress,
    loadBase,
    refreshWithResearch,
    stopResearch,
    loadFromClaudeOutput
  } = useData();

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="ferma-header h-14 px-5 flex items-center justify-between flex-shrink-0 relative">
      <div className="flex items-center gap-3">
        <SynapseLogo />
        <span className="header-logo-text font-medium text-white" style={type.label}>
          Synapse, Probability of Trial Success Tracker
        </span>
        {!isBase && (
          <span className="ml-2 px-2 py-0.5 text-white text-xs rounded" style={accentBg}>Updated</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isRefreshing && (
          <span className="text-white/70 text-xs animate-pulse" style={type.caption}>
            {refreshProgress || 'Refreshing...'}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-white/50" style={type.caption}>Last refreshed:</span>
          <span className="text-white/80" style={type.caption}>{formatDate(lastRefreshed)}</span>
        </div>
        <button
          onClick={loadFromClaudeOutput}
          className="h-7 px-3 flex items-center justify-center text-xs font-medium rounded transition-colors bg-white/10 text-white/90 hover:bg-white/20"
        >
          Preview
        </button>
        <Tooltip label="Load base data">
          <button
            onClick={loadBase}
            disabled={isRefreshing || isBase}
            className={`h-7 px-3 flex items-center justify-center text-xs font-medium rounded transition-colors ${
              isBase
                ? 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'bg-white/10 text-white/90 hover:bg-white/20'
            }`}
          >
            Base
          </button>
        </Tooltip>
        {isRefreshing ? (
          <button
            onClick={stopResearch}
            className="h-7 px-3 flex items-center gap-1.5 text-xs font-medium rounded transition-colors bg-red-500 text-white hover:bg-red-600"
          >
            <span className="w-3 h-3 border-2 border-white rounded-sm" />
            Stop
          </button>
        ) : (
          <Tooltip label="Browse & refresh with Yutori">
            <button
              onClick={refreshWithResearch}
              className="h-7 px-3 flex items-center gap-1.5 text-xs font-medium rounded text-white hover:opacity-90 transition-opacity"
              style={accentBg}
            >
              <RefreshIcon size={12} />
              Refresh
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
};

export default Header;
